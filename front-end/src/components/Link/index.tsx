import { Link, LinkProps, useRouteMatch } from "react-router-dom";

const CustomLink = ({ children, ...props}: Partial<LinkProps>) => {
  const { url } = useRouteMatch();

  props.to = props.to ? `${url.replace(/\/$/, "")}${props.to}` : '';

  return props.to ? <Link {...props as LinkProps}>{children}</Link> : <a {...props}>{children}</a>;
};

export default CustomLink;
