import React from 'react';
import PropTypes from 'prop-types';
import { Label, InputText } from '@buffetjs/core';

import InputBlock from '../InputBlock';

const TextInput = ({ label, id, value = '', name = null, disabled = false, error = null, onChange = () => {}, className = '', placeholder = '', search }) => {
  const classNames = [
    className,
    'text-input',
  ].join(' ');

  return (
    <InputBlock className={classNames} error={error}>
      <Label htmlFor={id}>
        <span dangerouslySetInnerHTML={{ __html: label || '&nbsp;' }} />
      </Label>
      <InputText
        name={name || id}
        id={id}
        value={value}
        disabled={disabled}
        type={ search ? 'search' : 'text' }
        placeholder={placeholder}
        onChange={({ target: { value }}) => typeof onChange === 'function' && onChange(value)}
      />
    </InputBlock>
  )
};

TextInput.propTypes = {
  disabled: PropTypes.bool,
  search: PropTypes.bool,
};

export default TextInput;