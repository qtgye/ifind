import React, { useState, useEffect, useCallback } from 'react';
import { Text } from '@buffetjs/core';

import { useSourceRegion } from '../../providers/sourceRegionProvider';
import { useCategories, mapCategoriesTree, buildCategoryPath } from '../../providers/categoryProvider';

import NestedCategoryOption from '../NestedCategoryOption';

const CategorySelect = ({
  source = null,
  region = null,
  category = null,
  onChange = null,
  hasError = false,
  emptyMessage = 'No category options available'
}) => {
  const { categories } = useCategories();

  // Nested category data
  const [ categoryPath, setCategoryPath ] = useState([]);
  const [ categoryOptions, setCategoryOptions ] = useState([]); // source-region-filtered categories

  const setInitialCategoryPath = useCallback(() => {
    // Build category path
    const _categoryPath = buildCategoryPath(category, categories);
    // Use only id's for path
    setCategoryPath(_categoryPath.map(({ id }) => id));
  }, [ category, categories ]);

  useEffect(() => {
    const filteredCategories = (categories && categories.filter(category => (
      category.source?.id === source &&
      category.region?.id === region
    ))) || [];

    const categoryTree = mapCategoriesTree(filteredCategories);
    setCategoryOptions(Object.values(categoryTree));
  }, [ source, region, categories ]);

  useEffect(() => {
    if ( category ) {
      setInitialCategoryPath();
    }
  }, [ category ]);

  useEffect(() => {
    console.log({ source, region, categories });
  }, [ source, region, categories ]);

  return (
    <div className="category-select">
      <NestedCategoryOption
          categories={categoryOptions}
          categoryPath={categoryPath}
          onChange={onChange}
          hasError={hasError}
        />
      {
        ( categoryPath.length <= 1 && categoryOptions.length <= 1 ) ?
        <Text color="orange" className="col-md-12">Please select URL Type</Text> : 
        null
      }
    </div>
  )
}

export default CategorySelect;