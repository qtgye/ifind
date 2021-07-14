import React, { useState, useEffect, useCallback, memo } from 'react';
import { Label, Select, Text } from '@buffetjs/core';
import InputBlock from '../InputBlock';
import CustomSelect from '../CustomSelect';
import IFINDIcon from '../IFINDIcon';

import './styles.scss';

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

  const setFinalSelectedCategory = useCallback((categoryOption) => {
    if ( typeof onChange === 'function' ) {
      onChange(categoryOption?.value);
    }
  }, [ onChange ]);

  const checkCategoryPath = useCallback(() => {
    if ( !categoryPath?.length ) {
      return;
    }

    const [ rootCategory ] = categoryPath;
    const matchedCategory = categoryOptions.find(({ value }) => value === rootCategory);

    if ( matchedCategory ) {
      setSelectedCategory(matchedCategory.value);
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
      const matchedCategoryOption = categoryOptions.find(categoryOption => categoryOption.value === selectedCategory);
      const matchedCategory = matchedCategoryOption && categories.find(({ id }) => matchedCategoryOption.value === id);

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
    const processedCategories = categories.map(category => {
      return {
        value: category.id,
        label: (
          <div className="nested-category-option__option">
            <IFINDIcon icon={category.icon.replace('_','-')} />
            {categoryLabel(category)}
          </div>
        ),
      }
    });

    setCategoryOptions([
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
          <CustomSelect
            name="category"
            id="category"
            value={selectedCategory}
            options={categoryOptions}
            onChange={(option) => setSelectedCategory(option.value)}
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