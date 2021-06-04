import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sortly, { useDrag, useDrop } from 'react-sortly';
import {
  useCategories,
  getCategories,
  groupCategoriesByLanguage,
} from '../../helpers/categories';

import { useLanguages } from '../../helpers/languages';

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
  const { languages } = useLanguages();
  const [ languageOptions, setLanguageOptions ] = useState(['en']);
  const [ currentLanguage, setCurrentLanguage ] = useState('en');
  const [ isSaving, setIsSaving ] = useState(false);

  // Original category data
  const [
    categories,
    updateCategories,
    error
  ] = useCategories();

  // Local data
  const [ itemsByLanguage, setItemsByLanguage ] = useState([]);
  const [ itemsInView, setItemsInView ] = useState([]);
  const [ changedItems, setChangedItems ] = useState([]);

  const handleChange = useCallback((newItems) => {
    const updatedItemsByLanguage = itemsByLanguage.map(itemsGroup => {
      // Use newItems for current categories
      if ( itemsGroup.language.code === currentLanguage ) {
        itemsGroup.categories = processCategories(newItems, true);
      };

      return itemsGroup;
    });

    const _changedItems = getChangedItems();

    // Set changed items
    setChangedItems(_changedItems);

    // Apply updated itemsByLanguage
    setItemsByLanguage(updatedItemsByLanguage);
  }, [ itemsByLanguage, currentLanguage ]);

  const getChangedItems = useCallback(() => {
    // Flatten grouped items into a single array
    // Filter only changed items
    const _changedItems = itemsByLanguage.reduce((all, byLanguage)=> {
      all.push(
        ...byLanguage.categories
          // Filter only changed items
          .filter(({ softParent, softOrder, parent, order }) => (
            (parent?.id || null) !== softParent || order !== softOrder
          ))
      );

      return all;
    }, []);
    
    return _changedItems;
  }, [ itemsByLanguage ]);

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
  }, [ itemsByLanguage, changedItems ]);

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
   * Processes raw categories and languages data from hooks
   * Into UI-consumable data
   */
  useEffect(() => {
    if ( languages?.length ) {
      setLanguageOptions(languages.map(({ code }) => code));

      if ( categories?.length ) {
        setIsSaving(false);

        const categoryGroups = groupCategoriesByLanguage(categories, languages);
        const processedItemsByLanguage = categoryGroups.map(group => ({
          ...group,
          categories: processCategories(group.categories),
        }));

        setItemsByLanguage(processedItemsByLanguage);

        window.strapi.notification.toggle({
          type: 'success',
          message: 'Categories Loaded!',
        });
      }
    }
  }, [ categories, languages ]);

  useEffect(() => {
    const _changedItems = getChangedItems();
    setChangedItems(_changedItems);
  }, [ itemsByLanguage ]);

  useEffect(() => {
    // Find categoriesGroup for current language
    const currentGroupByLanguage = itemsByLanguage.find(({ language }) => language.code === currentLanguage);

    if ( currentGroupByLanguage ) {
      setItemsInView(currentGroupByLanguage.categories);
    }

  }, [ itemsByLanguage, currentLanguage ])

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
      { currentLanguage &&
        <Select
          name='language'
          onChange={({ target: { value } }) => setCurrentLanguage(value)}
          options={languageOptions}
          value={currentLanguage}
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