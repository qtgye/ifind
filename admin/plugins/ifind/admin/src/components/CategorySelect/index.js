import React, { useState, useEffect, useCallback } from 'react';
import { Text } from '@buffetjs/core';

import { useCategoriesListing, mapCategoriesTree, buildCategoryPath } from '../../providers/categoriesListingProvider';

import NestedCategoryOption from '../NestedCategoryOption';

import './styles.scss';

const CategorySelect = ({
  // TODO: Clean up once single category tree is implemented
  // source = null,
  // region = null,
  category = null,
  onChange = null,
  hasError = false,
  emptyMessage = 'No category options available'
}) => {
  const { categories } = useCategoriesListing();

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
    const categoryTree = mapCategoriesTree(categories);
    setCategoryOptions(Object.values(categoryTree));
  }, [ categories ]);

  useEffect(() => {
    if ( category ) {
      setInitialCategoryPath();
    }
  }, [ category ]);

  return (
    <div className="category-select">
      <NestedCategoryOption
          categories={categoryOptions}
          categoryPath={categoryPath}
          onChange={onChange}
          hasError={hasError}
        />
      {/* {
        ( categoryPath.length <= 1 && categoryOptions.length < 1 ) ?
        <Text color="orange" className="col-md-12">Please select URL Type</Text> : 
        null
      } */}
    </div>
  )
}

export default CategorySelect;