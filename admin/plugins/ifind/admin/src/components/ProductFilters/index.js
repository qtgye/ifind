/**
 TODO:

 Clean up URLType Select once removed from implementation
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@buffetjs/core';

import { useSearchParams, generatePluginLink } from '../../helpers/url';

import URLTypeSelect from '../URLTypeSelect';
import CategorySelect from '../CategorySelect';

import './styles.scss';

const ProductFilters = ({ onChange }) => {
  const searchParams = useSearchParams();
  const history = useHistory();

  // States
  const [ category, setCategory ] = useState('');

  const onCategorySelect = useCallback((categoryID) => {
    setCategory(categoryID);
  }, [  ]);

  const applyFilters = useCallback(() => {
    const filters = Object.entries({ category })
      .filter(([ key, value ]) => value)
      .map(([ key, value ]) => `${key}:${value}`)
      .join(',');

    const targetURL = generatePluginLink('', { filters })

    history.push(targetURL);
  }, [ category ])

  useEffect(() => {
    const { filters } = searchParams;

    // Extract filters
    const filtersMap = filters ?
    filters.split(',').reduce((all, filterString) => {
      const [ key, value ] = filterString.split(':');

      all[key] = value;
      return all;
    }, {})
    : {};

    if ( filtersMap?.category ) {
      setCategory(filtersMap.category);
    }
  }, [ searchParams ]);

  useEffect(() => {
    console.log({ category });
  }, [ category ]);
  
  return (
    <div className="product-filters">
      <div className="product-filters__item">
        <CategorySelect
          category={category}
          onChange={onCategorySelect}
          emptyMessage="Please select URL Type"
        />
      </div>
      <div className="product-filters__item">
        <Button
          type="submit"
          label="Apply"
          onClick={applyFilters}
        />
      </div>
    </div>
  )
};

export default ProductFilters;