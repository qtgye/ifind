import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { routesExtraConfig } from "config/routes";

import HeaderMiddle from "./HeaderMiddle";
import HeaderNav from "./HeaderNav";

const Header = () => {
  const { asPath: pathname = "" } = useRouter();
  const additionalClassNames = [];
  const offersRouteConfig = routesExtraConfig.find(({ id }) => id === "offers");

  if (offersRouteConfig?.pattern?.test(pathname)) {
    additionalClassNames.push("header--with-side-nav");
  }
  const classNames = ["header", ...additionalClassNames]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={classNames}>
      <HeaderMiddle />
      <HeaderNav />
    </header>
  );
};

export default Header;
