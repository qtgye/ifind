import { useCallback, useEffect, useState } from "react";

import { routesExtraConfig } from "@config/routes";
import { useCurrentRouteConfig } from "@utilities/route";

import HeaderMiddle from "./HeaderMiddle";
import HeaderNav from "./HeaderNav";
import "./header.scss";

const Header = () => {
  const currentRouteConfig = useCurrentRouteConfig();
  const [isSticky, setIsSticky] = useState(false);
  const [additionalClassNames, setAdditionalClassNames] = useState<string[]>(
    []
  );
  const classNames = ["header", ...additionalClassNames]
    .filter(Boolean)
    .join(" ");

  /**
   * Handles intersection
   * isInterSected is false when header is in sticky state
   */
  const handleHeaderIntersection = useCallback((isInterSected) => {
    setIsSticky(!isInterSected);
  }, []);

  useEffect(() => {
    const additionalClassNames = [];
    const offersRouteConfig = routesExtraConfig.find(
      ({ id }) => id === "offers"
    );

    if (offersRouteConfig?.pattern?.test(window.location.pathname)) {
      additionalClassNames.push("header--with-side-nav");
    }

    setAdditionalClassNames(additionalClassNames);
  }, []);

  return (
    <header className={classNames}>
      <HeaderMiddle onInterSect={handleHeaderIntersection} />
      <HeaderNav />
    </header>
  );
};

export default Header;
