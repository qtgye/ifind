import React from "react";
import { Link, useRouteMatch, LinkProps } from "react-router-dom";

const CustomLink = ({ to, ...props }: LinkProps) => {
  const { url } = useRouteMatch();

  return <Link to={`${url.replace(/\/$/, '')}${to}`} {...props} />;
};

export default CustomLink;
