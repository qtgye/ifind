import React, { useEffect, useState, useCallback } from 'react';
import { InputText, InputNumber, Label, Button } from '@buffetjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import InputBlock from '../InputBlock';
import URLTypeSelect from '../URLTypeSelect';

const ProductURLInputItem = ({ is_base = false, source, region, url, price, onChange, onDelete, onSelect, softId }) => {
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

  const onCheckClick = useCallback(() => {
    if ( typeof onSelect == 'function' ) {
      onSelect(softId);
    }
  }, [ onSelect, softId ])

  useEffect(() => {
    if ( typeof onChange === 'function' ) {
      onChange({
        url: urlInput,
        source: sourceInput,
        region: regionInput,
        price: priceInput,
        is_base,
        softId,
      });
    }
  }, [ regionInput, sourceInput, urlInput, priceInput, is_base ]);

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
      <InputBlock className="col-md-2">
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
      <InputBlock className="col-md-2">
        <Label>&nbsp;</Label>
        <div className="product-url-input__item-controls">
          <Button
            className="product-url-input__item-check"
            color={ is_base ? 'success' : 'cancel' }
            icon={<FontAwesomeIcon icon="check" />}
            onClick={onCheckClick}
          ></Button>
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