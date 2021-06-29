import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Label, InputText } from '@buffetjs/core';

import InputBlock from '../InputBlock';

const NumberInput = ({ label, id, value, name = null, step = 1, disabled = false, error = null, onChange = () => {}, className = '' }) => {
  const classNames = [
    className,
    'text-input',
  ].join(' ');

  return (
    <InputBlock className={classNames} error={error}>
      <Label htmlFor={id}>{label}</Label>
      <InputText
        type='number'
        step={step}
        name={name || id}
        id={id}
        value={value}
        disabled={disabled}
        onChange={({ target: { value }}) => typeof onChange === 'function' && onChange(value)}
      />
    </InputBlock>
  )
};

NumberInput.propTypes = {
  disabled: PropTypes.bool,
};

export default NumberInput;