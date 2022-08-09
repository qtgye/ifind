import React, { AnchorHTMLAttributes } from "react";
import { Link } from "react-router-dom";

import "./styles.scss";

// TYPES
export enum E_ButtonLinkColor {
  primary = "primary",
  secondary = "secondary",
  cancel = "cancel",
  success = "success",
  delete = "delete",
  none = "none",
}

export interface I_ButtonLinkProps extends AnchorHTMLAttributes<any> {
  color?: E_ButtonLinkColor;
  routerLink?: boolean;
  tooltip?: string;
}

export interface I_ButtonLinkTooltipProps {
  tooltip: string;
}

const ButtonLinkTooltip = ({ tooltip }: I_ButtonLinkProps) => {
  return tooltip ? (
    <div className="button-link__tooltip">{tooltip}</div>
  ) : (
    <></>
  );
};

// COMPONENT
const ButtonLink = ({
  href = "",
  color = E_ButtonLinkColor.primary,
  children = null,
  routerLink,
  title,
  ...props
}: I_ButtonLinkProps): JSX.Element => {
  const className = ["button-link", `button-link--${color}`];

  return routerLink ? (
    <Link to={href} className={className.join(" ")} {...props}>
      {children}
      <ButtonLinkTooltip tooltip={title} />
    </Link>
  ) : (
    <a href={href} className={className.join(" ")} {...props}>
      {children}
      <ButtonLinkTooltip tooltip={title} />
    </a>
  );
};

export default ButtonLink;
