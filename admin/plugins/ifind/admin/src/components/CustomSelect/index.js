import React, { useEffect, useState, useCallback } from 'react';

import './styles.scss';

const CustomSelectOption = ({ selected = false, value, label, onClick }) => {
  const classNames = [
    'custom-select-option',
    selected ? 'custom-select-option--selected' : false,
  ].filter(Boolean);

  const onButtonClick = useCallback(e => {
    e.preventDefault();

    if ( typeof onClick === 'function' ) {
      onClick(value);
    }
  }, [ value ]);

  return (
    <button
      className={classNames.join(' ')}
      type='button'
      dataValue={value}
      onClick={onButtonClick}
    >
      {label}
    </button>
  )
}

/**
 * 
 * @param props.options = [{ value, label }] - label can be a React.Component
 * @returns React.Component
 */
const CustomSelect = ({ value, options = [], onChange, name, id,  }) => {
  const [ isExpanded, setIsExpanded ] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  const onOptionSelect = useCallback((value) => {
    console.log({ value });
    if ( typeof onChange === 'function' ) {
      const matchedOption = options.find(option => value === option.value);

      if ( matchedOption ) {
        onChange(matchedOption);
      }
    }
  }, [ options ]);

  const onClick = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [ isExpanded ]);

  return (
    <div className="custom-select" tabindex='0' onClick={onClick}>
      <div className="custom-select__label">
        { selectedOption ? selectedOption.label : 'Please Select' }
      </div>
      {
        isExpanded && (
          <div className="custom-select__options">
            {options.map(({ value: optionValue, label }) => (
              <CustomSelectOption
                value={optionValue}
                label={label}
                onClick={onOptionSelect}
                selected={optionValue === value}
              />
            ))}
          </div>
        )
      }
      <select name={name} id={id} value={value} hidden></select>
    </div>
  )
};

export default CustomSelect;