import React, { useState, useEffect, useCallback, memo } from 'react';
import { Label, Select, Text } from '@buffetjs/core';
import InputBlock from '../InputBlock';

/*

  Logic steps
  - Plot options for categories
  - on categories set, check for categoryPath
    - if there's an entry in categoryPath,
      - select category
      - check for children
        - if has children, set children
        - else, call onChange
    - else, clear selection and call onChange
  - on select, call onChange

*/

const NestedCategoryOption = ({ categories, categoryPath = [], onChange = null, level = 1, hasError = false}) => {
  const [ id ] = useState(Math.random() * 1000);
  const [ categoryOptions, setCategoryOptions ] = useState([]);
  const [ selectedCategory, setSelectedCategory ] = useState(null);
  const [ children, setChildren  ] = useState(null);

  const categoryLabel = useCallback((categoryData) => (
    `[${categoryData.id}] ${categoryData.label}`
  ), []);

  const setFinalSelectedCategory = useCallback((categoryData) => {
    console.log('setFinalSelectedCategory', categoryData, categoryData?.id);
    if ( typeof onChange === 'function' ) {
      onChange(categoryData?.id);
    }
  }, [ onChange ]);

  const checkCategoryPath = useCallback(() => {
    if ( !categoryPath?.length ) {
      return;
    }

    const [ rootCategory ] = categoryPath;
    const matchedCategory = categoryOptions.find(({ id }) => id === rootCategory);

    if ( matchedCategory ) {
      setSelectedCategory(matchedCategory.label);
    }
    else {
      // Clear everything
      setSelectedCategory(null);
      setChildren(null);
    }
  }, [ categoryPath, categoryOptions ]);

  const onCategorySelect = useCallback(() => {
    if ( !selectedCategory ) {
      setFinalSelectedCategory(null);
      return;
    }

    if ( categoryOptions?.length && categories?.length ) {
      const matchedCategoryOption = categoryOptions.find(categoryOption => categoryOption.label === selectedCategory);
      const matchedCategory = matchedCategoryOption && categories.find(({ id }) => matchedCategoryOption.id === id);

      if ( !matchedCategory ) {
        setChildren(null);
        return;
      }

      if ( matchedCategory.children ) {
        setChildren(Object.values(matchedCategory.children));
        setFinalSelectedCategory(null)
      }
      else {
        setChildren(null);
        setFinalSelectedCategory(matchedCategory);
      }
    }
  }, [ categories, categoryOptions, selectedCategory ]);

  useEffect(() => {
    const processedCategories = categories.map(category => ({
      label: categoryLabel(category),
      id: category.id,
      category
    }));

    setCategoryOptions([
      '',
      ...processedCategories
    ]);
  }, [ categories ]);

  useEffect(() => {
    checkCategoryPath();
  }, [ categoryOptions, checkCategoryPath ]);

  useEffect(() => {
    onCategorySelect();
  }, [ selectedCategory, onCategorySelect ]);

  return (
    <>
      <InputBlock className={[ 'col-md-12', hasError ? 'input-block--error': '' ].join(' ')}>
        <Label htmlFor="category">{level > 1 ? 'Subcategory' : 'Category'}</Label>
        {
          <Select
            name="category"
            id="category"
            onChange={({ target: { value } }) => {
              setSelectedCategory(value);
            }}
            options={categoryOptions.map(option => option?.label || '')}
            value={selectedCategory}
          />
        }
      </InputBlock>
      {
        (children && selectedCategory && (
          <NestedCategoryOption
            categories={children}
            onChange={onChange}
            level={++level}
            categoryPath={categoryPath.slice(1)}
            hasError={hasError}
            />
        ))
      }
    </>
  )
};

export default memo(NestedCategoryOption);