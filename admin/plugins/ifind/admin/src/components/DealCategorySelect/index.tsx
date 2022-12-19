import React, { useState, useEffect, useCallback } from "react";
import { Select, Label } from "@buffetjs/core";
import InputBlock from "../InputBlock";
import { useDealCategory } from "../../providers/dealCategoryProvider";

import "./styles.scss";

export interface I_DealCategoryOption {
  value: string;
  label: string;
}

export type T_DealCategorySelectProps = {
  value: string;
  onChange: (dealType: string) => any;
  error?: string;
  label: string;
  id?: string | number;
  disabled?: boolean;
  className?: string;
};

const DealCategorySelect = ({
  value = "",
  onChange,
  id,
  disabled,
  className,
  error,
  label,
}: T_DealCategorySelectProps): JSX.Element => {
  const { dealCategories } = useDealCategory();
  const [inputValue, setInputValue] = useState<string>(value);
  const [options, setOptions] = useState<I_DealCategoryOption[]>([]);

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

  useEffect(() => {
    const matchedOption = options.find(
      ({ value: optionValue }) => optionValue === value
    );
    setInputValue(matchedOption?.label || "");
  }, [value, options]);

  useEffect(() => {
    const options: I_DealCategoryOption[] = dealCategories.map(
      ({ id, label }) => ({
        value: id as string,
        label: label.find(({ language }) => language === "en")?.label || "",
      })
    );

    setOptions(options);
  }, [dealCategories]);

  return (
    <InputBlock
      className={["deal-category-select"]
        .concat(className || "")
        .filter(Boolean)
        .join(" ")}
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

export default DealCategorySelect;
