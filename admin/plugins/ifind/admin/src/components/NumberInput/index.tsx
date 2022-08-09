import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEventHandler,
} from "react";
import PropTypes from "prop-types";
import { Label, InputText } from "@buffetjs/core";

import InputBlock from "../InputBlock";

export interface NumberInputProps {
  label?: string;
  id?: string;
  value?: number;
  name?: string;
  step?: number;
  disabled?: boolean;
  error?: string;
  onChange?: (value: number) => void;
  className?: string;
  max?: number | null;
  min?: number | null;
  size?: number;
}

const NumberInput = ({
  label,
  id,
  value,
  name = "",
  step = 1,
  disabled = false,
  error = "",
  onChange = () => {},
  className = "",
  max = 9999,
  min = 0,
  size = 2,
}: NumberInputProps) => {
  const classNames = [className, "text-input"].join(" ");

  return (
    <InputBlock className={classNames} error={error}>
      {label ? <Label htmlFor={id}>{label}</Label> : ""}
      <InputText
        type="number"
        step={step}
        name={name || id}
        id={id}
        value={value}
        disabled={disabled}
        onChange={({
          target: { value },
        }: Parameters<ChangeEventHandler<HTMLInputElement>>[0]) =>
          typeof onChange === "function" && onChange(Number(value))
        }
        max={max}
        min={min}
        size={size}
      />
    </InputBlock>
  );
};

NumberInput.propTypes = {
  disabled: PropTypes.bool,
};

export default NumberInput;
