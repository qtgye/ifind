import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sortly, { useDrag, useDrop } from 'react-sortly';
import {
  useCategories,
  getCategories,
  groupCategoriesBySourceRegion,
} from '../../helpers/categories';
import { useSourceRegion } from '../../helpers/sourceRegion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faPen, faSpinner, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Select } from '@buffetjs/core';
import { Header } from '@buffetjs/custom';
import { LoadingIndicator } from '@buffetjs/styles';

import './styles.scss';

const ItemRenderer = ({ data: { url, id, label, depth, softParent, icon, products } }) => {
  const [, drag] = useDrag();
  const [{ hovered }, drop] = useDrop(); 

  return (
    <>
      <div className="category-tree__item" data-hovered={hovered} ref={drop} data-depth={depth} data-id={id} data-soft-parent={softParent}>
        <div className="category-tree__item-info" ref={drag}>
          <div className="category-tree__drag">
            { icon && (
              <svg className="category-tree__icon"><use xlinkHref={`#${icon.replace(/_/g, '-')}`} /></svg>
            ) }
          </div>
          <div className="category-tree__details">
            <div>{label}</div>
            <a href={url} target="_blank"><small>{url}&nbsp;</small></a>
          </div>
          {products?.length && <ProductListLink count={products.length} categoryId={id} /> || ''}
          <EditCategoryButton id={id} />
        </div>
      </div>
    </>
  );
};

const EditCategoryButton = ({ id }) => (
  <Link
    className="category-tree__edit"
    to={`/plugins/content-manager/collectionType/application::category.category/${id}`}>
    <FontAwesomeIcon icon={faPen} />
  </Link>
);

const ProductListLink = ({ count = 0, categoryId }) => (
  <Link
    className="category-tree__products-link"
    to={`/plugins/content-manager/collectionType/application::product.product?page=1&_sort=url:ASC&_where[0][category.id]=${categoryId}`}>
    {count} Product(s)
  </Link>
)

const AddCategoryButton = () => (
  <Link to='/plugins/content-manager/collectionType/application::category.category/create' className="btn btn-primary category-tree-add">
    <FontAwesomeIcon icon={faPlus} />
    Add Category
  </Link>
);

const SaveButton = ({ save, loading }) => {
  const saveFn = useCallback((e) => {
    e.preventDefault();

    if ( !loading ) {
      save();
    }
  }, [ save, loading ]);

  return (
    <Button
      color={loading ? 'cancel' : 'secondary'}
      icon={<FontAwesomeIcon icon={ loading? faSpinner : faSave} pulse={loading}/>}
      onClick={saveFn}
      label={loading ? 'Saving' : 'Save Changes'}
    />
  );
};

const CategoryTree = () => {
  const { sources } = useSourceRegion();
  const [ sourcesRegions, setSourcesRegions ] = useState([]);
  const [ currentSourceRegion, setCurrentSourceRegion ] = useState(null); // e.g., "amazon international"
  const [ isSaving, setIsSaving ] = useState(false);

  // Original category data
  const [
    categories,
    updateCategories,
    error
  ] = useCategories();

  // Local data
  const [ itemsBySourceRegion, setItemsBySourceRegion ] = useState([]);
  const [ itemsInView, setItemsInView ] = useState([]);
  const [ changedItems, setChangedItems ] = useState([]);

  const handleChange = useCallback((newItems) => {
    const updatedItemsBySourceRegion = itemsBySourceRegion.map(itemsGroup => {
      // Use newItems for current categories
      if ( itemsGroup.label === currentSourceRegion ) {
        itemsGroup.categories = processCategories(newItems, true);
      };

      return itemsGroup;
    });

    const _changedItems = getChangedItems();

    // Set changed items
    setChangedItems(_changedItems);

    // Apply updated itemsBySourceRegion
    setItemsBySourceRegion(updatedItemsBySourceRegion);
  }, [ itemsBySourceRegion, currentSourceRegion ]);

  const getChangedItems = useCallback(() => {
    // Flatten grouped items into a single array
    // Filter only changed items
    const _changedItems = itemsBySourceRegion.reduce((all, bySourceRegion)=> {
      all.push(
        ...bySourceRegion.categories
          // Filter only changed items
          .filter(({ softParent, softOrder, parent, order }) => (
            (parent?.id || null) !== softParent || order !== softOrder
          ))
      );

      return all;
    }, []);
    
    return _changedItems;
  }, [ itemsBySourceRegion ]);

  const saveChanges = useCallback(() => {
    if ( !changedItems.length ) {
      return;
    }

    setIsSaving(true);

    // Format data to be passed into GraphQL
    const itemsToChange = changedItems.map(({ id, parent, softParent, order, softOrder }) => ({
      id, parent: softParent, order: softOrder,
    }));
    
    updateCategories(itemsToChange);
  }, [ changedItems, updateCategories ]);

  const processCategories = useCallback((categoriesList, retainIndex = false) => {
    // Add softParent and softOrder used for temporary changes in UI
    const processedCategories = categoriesList.map((category, index) => ({
      ...category,
      softParent: category.softParent || category.parent?.id || null,
      softOrder: retainIndex ? index : category.softOrder || category.order,
    }));

    // Sort categories
    const sortedCategories = processedCategories.sort((categoryA, categoryB) => (
      categoryA.softOrder > categoryB.softOrder ? 1  :-1
    ));

    const updatedSoftParents = updateSoftParents(sortedCategories);
    return updatedSoftParents;
  });

  /**
   * Recursive function to update soft parents
   * of a flat list of categories
   * based on each item's depth
   */
  const updateSoftParents = useCallback((items) => {
    const updatedSoftParents = [];
    let currentParentPath = [
      // { id, depth } - parent id and depth, add as the level goes deeper
    ];

    items.forEach((item, index) => {
      const [ previousItem ] = updatedSoftParents.slice(-1);

      // Update softOrder, as this can still be null
      item.softOrder = index;

      // First item in the list
      if ( !previousItem ) {
        item.softParent = null;
        updatedSoftParents.push(item);
        return;
      }

      // One level deeper
      if ( item.depth > previousItem.depth ) {
        // Add previous item as a parent
        currentParentPath.push({
          id: previousItem.id,
          depth: previousItem.depth,
        });
      }
      // One level back
      else if ( item.depth < previousItem.depth ) {
        // Pop till we get to the direct parent
        while ( currentParentPath.length && currentParentPath.slice(-1)[0].depth >= item.depth ) {
          currentParentPath.pop();
        }
      }

      item.softParent = (currentParentPath.slice(-1)[0] || {}).id || null;
      updatedSoftParents.push(item);
    });

    return updatedSoftParents;
  });

  /**
   * Initial effect,
   * Processes raw categories and sources-regions data from hooks
   * Into UI-consumable data
   */
  useEffect(() => {
    if ( sources?.length ) {
      const flatSourcesRegions = sources.reduce((list, source) => {
        (source.regions || []).forEach(region => {
          list.push({
            label: `${source.name} ${region.name}`.toLowerCase(),
            source: source.id,
            region: region.id,
          });
        });

        return list;
      }, []);

      setSourcesRegions(flatSourcesRegions);
      setCurrentSourceRegion(flatSourcesRegions[0].label);

      if ( categories?.length ) {
        const categoriesBySourceRegion = groupCategoriesBySourceRegion(categories, flatSourcesRegions);
        const processedItemsBySourceRegion = categoriesBySourceRegion.map(group => ({
          ...group,
          categories: processCategories(group.categories),
        }));

        setItemsBySourceRegion(processedItemsBySourceRegion);

        window.strapi.notification.toggle({
          type: 'success',
          message: 'Categories Loaded!',
        });

        setIsSaving(false);
      }
    }
  }, [ categories, sources ]);

  useEffect(() => {
    // Find categoriesGroup for current source-region
    const currentGroupBySourceRegion = itemsBySourceRegion.find(({ label }) => label === currentSourceRegion);
    if ( currentGroupBySourceRegion ) {
      setItemsInView(currentGroupBySourceRegion.categories);
    }

  }, [ itemsBySourceRegion, currentSourceRegion ]);

  useEffect(() => {
    if ( error ) {
      strapi.notification.toggle({
        type: 'warning',
        title: 'Unable to update categories',
        message: error.message,
      });
      setIsSaving(false);
      console.error(error);
    }
  }, [ error ]);

  return <>
    <div className="row category-tree__header">
      {
        sourcesRegions.length &&
        <Select
          name='source_region'
          onChange={({ target: { value } }) => setCurrentSourceRegion(value)}
          options={sourcesRegions.map(({label}) => label)}
          value={currentSourceRegion}
          className="col-sm-2"
        />
      }
      <div className="category-tree__controls">
        {changedItems.length ? <SaveButton save={saveChanges} loading={isSaving} /> : null}
        <AddCategoryButton />
      </div>
    </div>
    <div className="row">
      <div className="category-tree col-md-6">
        {
          !categories?.length
          ? (<h3 className="pt-30"><FontAwesomeIcon icon={faSpinner} pulse size="md" />&nbsp;Loading...</h3>)
          : (
            <Sortly items={itemsInView} onChange={handleChange}>
              {(props) => <ItemRenderer {...props} />}
            </Sortly>
          )
        }
      </div>
    </div>
  </>
};

export default CategoryTree;