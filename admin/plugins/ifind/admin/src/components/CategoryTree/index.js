import React, { useCallback, useEffect, useState } from 'react';
import Sortly from 'react-sortly';
import {
  useCategories,
  groupCategoriesBySourceRegion,
} from '../../helpers/categories';
import { useSourceRegion } from '../../helpers/sourceRegion';
import { useGlobal } from '../../providers/globalProvider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SaveButton from '../SaveButton';
import AddCategoryButton from './add-category-button';
import ItemRenderer from './item-renderer';

import './styles.scss';

const CategoryTree = () => {
  const { setIsLoading } = useGlobal();
  const { sources, loading: sourcesLoading } = useSourceRegion();
  const [ sourcesRegions, setSourcesRegions ] = useState([]);
  const [ currentSourceRegion, setCurrentSourceRegion ] = useState(null); // e.g., "amazon international"
  const [ isSaving, setIsSaving ] = useState(false);

  // Original category data
  const [
    categories,
    updateCategories,
    error,
    categoriesLoading,
  ] = useCategories();

  // Local data
  const [ itemsInView, setItemsInView ] = useState([]);
  const [ changedItems, setChangedItems ] = useState([]);

  const filterChangedItems = useCallback((updatedItems) => {
    // Filter only changed items
    const _changedItems = updatedItems.filter(({ softParent, softOrder, parent, order }) => (
      (parent?.id || null) !== softParent || order !== softOrder
    ));
    return _changedItems;
  }, []);

  const handleChange = useCallback((newItems) => {
    const updatedItems = processCategories(newItems, true);
    const _changedItems = filterChangedItems(updatedItems);

    // Set changed items
    setChangedItems(_changedItems);
    // Apply updated items
    setItemsInView(updatedItems);
  }, []);

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
        softOrder: retainIndex ? index : 
                   category.softOrder ? category.softOrder :
                   category.order,
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
   * Processes raw categories data
   * Into UI-consumable data
   */
  useEffect(() => {
    if ( categories?.length ) {
      setItemsInView(categories);

      window.strapi.notification.toggle({
        type: 'success',
        message: 'Categories Loaded!',
      });

      setIsSaving(false);
    }
  }, [ categories ]);

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

  useEffect(() => {
    setIsLoading(categoriesLoading);
  }, [ categoriesLoading ]);

  return <>
    <div className="row category-tree__header">
      <div className="category-tree__controls">
        {changedItems.length ? <SaveButton save={saveChanges} loading={isSaving} /> : null}
        <AddCategoryButton />
      </div>
    </div>
    <div className="row">
      <div className="category-tree col-md-6">
        {
          !categories?.length
          ? (<h3 className="pt-30"><FontAwesomeIcon icon='spinner' pulse size="md" />&nbsp;Loading...</h3>)
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