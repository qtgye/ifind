import React, { useState, useEffect, useCallback } from "react";
import { Select, Label } from "@buffetjs/core";
import InputBlock from "../InputBlock";
import { useDealType } from "../../providers/dealTypeProvider";

import "./styles.scss";

export interface I_DealTypeOption {
  value: string;
  label: string;
}

export type T_DealTypeSelectProps = {
  value: string;
  onChange: (dealType: string) => any;
  error?: string;
  label: string;
  id?: string | number;
  disabled?: boolean;
  className?: string;
};

const DealTypeSelect = ({
  value = "",
  onChange,
  id,
  disabled,
  className,
  error,
  label,
}: T_DealTypeSelectProps): JSX.Element => {
  const { dealTypes } = useDealType();
  const [inputValue, setInputValue] = useState<string>(value);
  const [options, setOptions] = useState<I_DealTypeOption[]>([]);

  const onSelect = useCallback(
    (label: string) => {
      if (typeof onChange === "function") {
        const matchedOption = options.find(
          ({ label: optionLabel }) => optionLabel === label
        );

        if (typeof onChange === "function") {
          onChange(matchedOption?.value || "none");
        }
      }
    },
    [onChange, options]
  );

  console.log({ options });

  useEffect(() => {
    const matchedOption = options.find(
      ({ value: optionValue }) => optionValue === value
    );
    setInputValue(matchedOption?.label || "");
  }, [value, options]);

  useEffect(() => {
    const options: I_DealTypeOption[] = Object.entries(dealTypes).map(([ dealType, dealData ]) => ({
      value: dealType,
      label: dealData.label.find(({ language }) => language === 'en')?.label || ''
    }));

    setOptions(options);
  }, [dealTypes])

  return (
    <InputBlock
      className={["deal-type-select"].concat(className).join(" ")}
      error={error}
    >
      {label ? <Label htmlFor={id}>{label}</Label> : ""}
      <Select
        onChange={({
          target: { value },
        }: React.ChangeEvent<HTMLSelectElement>) => {
          onSelect(value);
        }}
        options={options.map((option) => option.label)}
        value={inputValue}
        disabled={disabled}
        className={"deal-type-select__select"}
      />
    </InputBlock>
  );
};

export default DealTypeSelect;
