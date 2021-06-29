import React, { useEffect, useState, useCallback } from 'react';
import { InputText, InputNumber, Label, Button } from '@buffetjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import InputBlock from '../InputBlock';
import URLTypeSelect from '../URLTypeSelect';

const ProductURLInputItem = ({ source, region, url, price, onChange, onDelete, softId }) => {
  const [ regionInput, setRegionInput ] = useState(region);
  const [ sourceInput, setSourceInput ] = useState(source);
  const [ urlInput, setUrlInput ] = useState(url);
  const [ priceInput, setPriceInput ] = useState(price);

  const onURLTypeSelect = useCallback(({ source, region }) => {
    setRegionInput(region);
    setSourceInput(source);
  });

  const onURLInput = useCallback((urlValue) => {
    setUrlInput(urlValue);
  });

  const onPriceInput = useCallback((urlValue) => {
    setPriceInput(urlValue);
  });

  const onDeleteClick = useCallback(() => {
    if ( typeof onDelete == 'function' ) {
      onDelete(softId);
    }
  }, [onDelete, softId]);

  useEffect(() => {
    if ( typeof onChange === 'function' ) {
      onChange({
        url: urlInput,
        source: sourceInput,
        region: regionInput,
        price: priceInput,
        softId,
      });
    }
  }, [ regionInput, sourceInput, urlInput, priceInput ]);

  return (
    <div className="product-url-input__item row">
      <InputBlock className="col-md-2">
        <URLTypeSelect
          label="URL Type"
          onChange={onURLTypeSelect}
          region={regionInput}
          source={sourceInput}
        />
      </InputBlock>
      <InputBlock className="col-md-3">
        <Label>Price</Label>
        <InputNumber
          onChange={({ target: { value }}) => onPriceInput(value)}
          value={priceInput}
        />
      </InputBlock>
      <InputBlock className="col-md-6">
        <Label>URL</Label>
        <InputText
          onChange={({ target: { value }}) => onURLInput(value)}
          value={urlInput}
        />
      </InputBlock>
      <InputBlock className="col-md-1">
        <Label>&nbsp;</Label>
        <div className="product-url-input__item-controls">
          <Button
            className="product-url-input__item-delete"
            color="cancel"
            icon={<FontAwesomeIcon icon="trash-alt" />}
            onClick={onDeleteClick}
          ></Button>
        </div>
      </InputBlock>
    </div>
  )
};

export default ProductURLInputItem;