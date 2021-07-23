import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Label } from '@buffetjs/core';
import { v4 as uuid } from 'uuid';

import { useProductAttributes } from '../../providers/productAttributesProvider';
import Item from './item';

const AttributesFactorInput = ({ label, factors, onChange, className }) => {
  const { productAttributes } = useProductAttributes();
  const [ factorsInputs, setFactorInputs ] = useState([]);

  const classNames = [
    'attributes-factor-input',
    className
  ].filter(Boolean).join(' ');

  const onItemChange = useCallback((changedItemData) => {
    console.log({ changedItemData });
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    console.log({ factorsInputs });
  }, [ factorsInputs ]);

  return (
    <div className={classNames}>
      { (label && <Label className='attributes-factor-input__label'>{label}</Label>) || ''}
      <table className="attributes-factor-input__table">
        <thead>
          <th>Attribute</th>
          <th>Factor</th>
        </thead>
        <tbody>
          {
            factorsInputs.map(attrWithFactor => (
              <tr>
                <td>
                  {attrWithFactor.label_preview}
                </td>
                <td>
                  {attrWithFactor.factor}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
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
  factors: [],
  onChange: () => {},
  className: '',
};

export default AttributesFactorInput;