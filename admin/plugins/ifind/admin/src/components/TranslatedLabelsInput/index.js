import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Label, Button } from '@buffetjs/core';
import FontAwesomeIcon from '../FontAwesomeIcon';

import InputBlock from '../InputBlock';
import TextInput from '../TextInput';
import Item from './item';

import './styles.scss';

const TranslatedLabelsInput = ({ label, labels, onChange, className }) => {
  const [ labelInputs, setLabelInputs ] = useState([]);

  const onItemChange = useCallback((itemData) => {
    if ( typeof onChange === 'function' ) {
      const newLabelsData = labelInputs.map(labelInput => {
        if ( labelInput.key === itemData.key ) {
          return {
            ...labelInput,
            ...itemData,
          }
        }
        return labelInput;
      });

      onChange(newLabelsData);
    }
  }, [ labelInputs ]);

  const onAddClick = useCallback(() => {
    if ( typeof onChange === 'function' ) {
      const newLabels = [
        ...labelInputs,
        {
          language: null,
          label: '',
        }
      ];

      onChange(newLabels);
    }
  }, [ labelInputs, onChange ]);

  useEffect(() => {
    setLabelInputs(labels.map(label => ({
      ...label,
      key: label.key || uuid(),
    })))
  }, [labels]);
  
  const classNames = [
    'translated-labels-input',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <Label className=''>{label}</Label>
      {
        labelInputs.map(labelInput => (
          <Item
            {...labelInput}
            itemKey={labelInput.key}
            onChange={onItemChange} />
        ))
      }
      <Button
        className='translated-labels-input__add'
        label='Add Label'
        icon={<FontAwesomeIcon icon='plus' />}
        onClick={onAddClick} />
    </div>
  );
};

TranslatedLabelsInput.propTypes = {
  label: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.shape({
    language: PropTypes.number,
    label: PropTypes.string,
  })),
  onChange: PropTypes.func,
  className: PropTypes.string,
};

TranslatedLabelsInput.defaultProps = {
  label: 'Translated Labels',
  labels: [],
  onChange: () => {},
};

export default TranslatedLabelsInput;