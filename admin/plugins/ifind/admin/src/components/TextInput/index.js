import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Label, InputText } from '@buffetjs/core';

import InputBlock from '../InputBlock';

const TextInput = ({ label, id, value = '', name = null, disabled = false, error = null, onChange = () => {}, className = '' }) => {
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
        onChange={({ target: { value }}) => typeof onChange === 'function' && onChange(value)}
      />
    </InputBlock>
  )
};

TextInput.propTypes = {
  disabled: PropTypes.bool,
};

export default TextInput;