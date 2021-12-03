import React, { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";

import "./styles.scss";

import FontAwesomeIcon from "../FontAwesomeIcon";

interface ICustomSelectOption {
  value: string | number;
  label: string | number | JSX.Element;
}

interface CustomSelectOptionProps {
  selected: boolean;
  value?: string | number;
  label?: string | number;
  onClick?: (args: any) => any;
}

interface CustomSelectProps {
  className?: string;
  value: string;
  options: ICustomSelectOption[];
  onChange: (selected: ICustomSelectOption) => void;
  name?: string;
  id?: string | number;
  withSearch: boolean;
}

const CustomSelectOption = ({
  selected = false,
  value,
  label,
  onClick,
}: CustomSelectOptionProps) => {
  const classNames = [
    "custom-select-option",
    selected ? "custom-select-option--selected" : false,
  ].filter(Boolean);

  const onButtonClick = useCallback(
    (e) => {
      e.preventDefault();

      if (typeof onClick === "function") {
        onClick(value);
      }
    },
    [value]
  );

  return (
    <button
      className={classNames.join(" ")}
      type="button"
      dataValue={value}
      onClick={onButtonClick}
    >
      {label}
    </button>
  );
};

/**
 *
 * @param props.options = [{ value, label }] - label can be a React.Component
 * @returns React.Component
 */
const CustomSelect = ({
  className = '',
  value,
  options = [],
  onChange,
  name,
  id,
  withSearch = false,
}: CustomSelectProps) => {
  const customSelectRef = useRef<HTMLElement|null>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<ICustomSelectOption[]>([]);
  const selectedOption = options.find((option) => option.value === value);

  const onBodyClickFocus = useCallback(
    ({ target }) => {
      if (!customSelectRef.current) {
        return;
      }
      setIsExpanded(customSelectRef.current.contains(target));
    },
    [customSelectRef]
  );

  const onOptionSelect = useCallback(
    (value) => {
      if (typeof onChange === "function") {
        const matchedOption = options.find((option) => value === option.value);

        if (matchedOption) {
          onChange(matchedOption);
        }
      }

      setIsExpanded(false);
    },
    [options]
  );

  const onSearchInput = useCallback(({ target }) => {
    setSearch(target.value);
  }, []);

  useEffect(() => {
    setFilteredOptions(
      options.filter(
        ({ value }) => !withSearch || new RegExp(search, "gi").test(String(value || ''))
      )
    );
  }, [options, search, withSearch]);

  useEffect(() => {
    document.body.addEventListener("click", onBodyClickFocus);
    document.body.addEventListener("focusin", onBodyClickFocus);
    return () => {
      document.body.removeEventListener("click", onBodyClickFocus);
      document.body.removeEventListener("focusin", onBodyClickFocus);
    };
  }, []);

  const classNames = [
    "custom-select",
    isExpanded ? "custom-select--expanded" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} tabIndex={0} ref={customSelectRef}>
      <div className="custom-select__label">
        {withSearch && isExpanded ? <FontAwesomeIcon icon="search" /> : ""}
        <span
          className="custom-select__label-text"
          hidden={withSearch && isExpanded}
        >
          {selectedOption ? selectedOption.label : "Please Select"}
        </span>
        {withSearch ? (
          <input
            className="custom-select__search"
            type="text"
            onInput={onSearchInput}
          />
        ) : null}
      </div>
      {isExpanded && (
        <div className="custom-select__options">
          {filteredOptions.map(({ value: optionValue, label }) => (
            <CustomSelectOption
              value={optionValue}
              label={label}
              onClick={onOptionSelect}
              selected={optionValue === value}
            />
          ))}
        </div>
      )}
      <select name={name} id={String(id) || ''} value={value} hidden></select>
    </div>
  );
};

const valuePropType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

CustomSelect.propTypes = {
  value: valuePropType,
  options: PropTypes.arrayOf(
    PropTypes.exact({
      value: valuePropType,
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.func,
      ]),
    })
  ),
  onChange: PropTypes.func,
  name: PropTypes.string,
  id: PropTypes.string,
  withSearch: PropTypes.bool,
};

export default CustomSelect;
