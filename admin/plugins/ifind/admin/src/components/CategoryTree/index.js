import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sortly, { useDrag, useDrop } from 'react-sortly';
import {
  useCategories,
  getCategories,
  flattenCategoriesTree,
  mapCategoriesTree,
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
      <div className="category-tree__item" data-hovered={hovered} ref={drop} data-has-parent={depth > 0} data-parent-soft={softParent || null}>
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

  const handleChange = useCallback((newItems) => {
    const updatedItemsByLanguage = itemsByLanguage.map(itemsGroup => {
      // Use newItems for current categories
      if ( itemsGroup.language.code === currentLanguage ) {
        itemsGroup.categories = processCategories(newItems, true);
      };

      return itemsGroup;
    });

    // Apply updated itemsByLanguage
    setItemsByLanguage(updatedItemsByLanguage);
  }, [ itemsByLanguage, currentLanguage ]);

  const saveChanges = useCallback(() => {
    setIsSaving(true);

    // Flatted grouped items into a single array
    const flatItems = itemsByLanguage.reduce((all, byLanguage)=> {
      all.push(
        ...byLanguage.categories
          // Filter only changed items
          .filter(({ softParent, softOrder, parent, order }) => (
            (parent?.id || null) !== softParent || order !== softOrder
          ))
          // Format data to be passed into GraphQL
          .map(({ id, parent, softParent, order, softOrder }) => ({
            id, parent: softParent, order: softOrder,

          }))
      );

      return all;
    }, []);

    if ( !flatItems.length ) {
      setIsSaving(false);
      return;
    }
    
    updateCategories(flatItems);
  }, [ itemsByLanguage ]);

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

    // - Max depth is 1 only
    // - Add softParent
    let lastParentID = null;

    sortedCategories.forEach((category, index) => {
      // Update softParent
      if ( category.depth >= 1 ) {
        category.softParent = lastParentID;
      }
      else {
        category.softParent = null;
        lastParentID = category.id;
      }

      // Update softOrder, as this can still be null
      // Even after the previous sorting
      category.softOrder = index;
    });

    return sortedCategories;
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
        <SaveButton save={saveChanges} loading={isSaving} />
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