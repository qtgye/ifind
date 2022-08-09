import React from "react";

import { HTMLProps, PropsWithChildren } from "react";
import { Button as _Button } from "@buffetjs/core";
import "./styles.scss";

declare interface ButtonProps
  extends PropsWithChildren<any>,
    HTMLProps<HTMLButtonElement> {
  disabled: boolean;
  color: string;
  onClick: (args: any) => any;
  title?: string;
}

declare interface ButtonTooltipProps {
  tooltip?: string;
}

const ButtonTooltip = ({ tooltip }: ButtonTooltipProps) => (
  <div className="button__tooltip">{tooltip}</div>
);

const Button = ({
  children,
  disabled,
  color,
  onClick,
  title,
  className,
}: ButtonProps) => (
  <_Button
    disabled={disabled}
    color={color}
    onClick={onClick}
    className={["button", className].filter(Boolean).join(" ")}
  >
    {children}
    {title ? <ButtonTooltip tooltip={title} /> : ""}
  </_Button>
);

export default Button;
