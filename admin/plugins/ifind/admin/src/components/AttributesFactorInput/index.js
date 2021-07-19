import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Label } from '@buffetjs/core';
import { v4 as uuid } from 'uuid';

import { useProductAttributes } from '../../providers/productAttributesProvider';

const AttributesFactorInput = ({ label, factors, onChange, className }) => {
  const productAttributes = useProductAttributes();
  const [ factorsInputs, setFactorInputs ] = useState([]);

  const classNames = [
    'attributes-factor-input',
    className
  ].filter(Boolean).join(' ');

  useEffect(() => {
    console.log({ productAttributes });

    // Map productAttributes
    // Match category's factorInputs
    const attributesWithFactors = productAttributes.map(productAttribute => {
      const matchedCategoryAttributeFactor = factors.find(factor => (
        factor && factor.product_attribute && factor.product_attribute.id === productAttribute.id
      ));

      const itemKey = matchedCategoryAttributeFactor?.itemKey || uuid();
      const factor = matchedCategoryAttributeFactor?.factor || 1;
      const label_preview = matchedCategoryAttributeFactor?.label_preview || `${productAttribute.name} (${factor})`;

      return {
        id: matchedCategoryAttributeFactor?.id || null,
        itemKey,
        factor,
        label_preview,
      }
    });

    setFactorInputs(attributesWithFactors)
  }, [ factors, productAttributes ]);

  return (
    <div className={classNames}>
      <Label className='attributes-factor-input__label'>{label}</Label>
      {/* {
        factors.map(labelInput => (
          <Item
            {...labelInput}
            itemKey={labelInput.key}
            onChange={onItemChange}
            deleteItem={deleteItem}
          />
        ))
      } */}
    </div>
  )
};

AttributesFactorInput.propTypes = {
  label: PropTypes.string,
  factors: PropTypes.arrayOf(PropTypes.object), // attributesFactorComponent data
  onChange: PropTypes.func,
  className: PropTypes.string,
};

AttributesFactorInput.defaultProps = {
  label: 'Attribute Factors',
  factors: [],
  onChange: () => {},
  className: '',
};

export default AttributesFactorInput;