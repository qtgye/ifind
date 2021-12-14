import { Link, LinkProps, useRouteMatch } from "react-router-dom";

const CustomLink = ({ to, ...props }: LinkProps) => {
  const { url } = useRouteMatch();

  return <Link to={`${url.replace(/\/$/, "")}${to}`} {...props} />;
};

export default CustomLink;
