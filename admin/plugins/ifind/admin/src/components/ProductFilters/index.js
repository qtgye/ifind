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
  const [ region, setRegion ] = useState('');
  const [ source, setSource ] = useState('');
  const [ category, setCategory ] = useState('');

  const onURLTypeChange = useCallback((value) => {
    setSource(value?.source || '');
    setRegion(value?.region || '');
  }, []);

  const onCategorySelect = useCallback((categoryID) => {
    setCategory(categoryID);
  }, [ setCategory ]);

  const applyFilters = useCallback(() => {
    const filters = Object.entries({
        region, source, category
      })
      .filter(([ key, value ]) => value)
      .map(([ key, value ]) => `${key}:${value}`)
      .join(',');

    const targetURL = generatePluginLink('', { filters })

    history.push(targetURL);
  }, [ region, source, category ])

  useEffect(() => {
    const { filters = '' } = searchParams;

    // Extract filters
    const filtersMap = filters ?
    filters.split(',').reduce((all, filterString) => {
      const [ key, value ] = filterString.split(':');

      all[key] = value;
      return all;
    }, {})
    : {};

    setCategory(filtersMap?.category || '');
    setSource(filtersMap?.source || '');
    setRegion(filtersMap?.region || '');
  }, [ searchParams ]);
  

  return (
    <div className="product-filters">
      <div className="product-filters__item">
        <URLTypeSelect
          region={region}
          source={source}
          onChange={onURLTypeChange}
        />
      </div>
      <div className="product-filters__item">
        <CategorySelect
          source={source}
          region={region}
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