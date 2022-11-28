import React, { useState, useEffect, useCallback } from "react";
import { Select, Label } from "@buffetjs/core";
import InputBlock from "../InputBlock";
import { useDealType } from "../../providers/dealTypeProvider";
import { useDealCategory } from "../../providers/dealCategoryProvider";
import { useProductsList } from "../../providers/productsListProvider";

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
  const { dealCategory } = useProductsList();
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

  useEffect(() => {
    const matchedOption = options.find(
      ({ value: optionValue }) => optionValue === value
    );
    setInputValue(matchedOption?.label || "");
  }, [value, options]);

  useEffect(() => {
    // Extract deal types with matching deal category
    const filteredDealTypes = dealTypes.filter(
      ({ deal_category = "" }) => deal_category === dealCategory
    );

    const options: I_DealTypeOption[] = filteredDealTypes.map(
      ({ id, label }) => ({
        value: id,
        label: label.find(({ language }) => language === "en")?.label || "",
      })
    );

    setOptions(options);
  }, [dealTypes, dealCategory]);

  return (
    <InputBlock
      className={["deal-type-select"]
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

export default DealTypeSelect;
