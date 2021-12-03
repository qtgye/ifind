import React from "react";
import { useLocation } from "react-router-dom";
import { navigationRoutes } from "@config/routes";
import routes from "@config/routes";
import { useTranslation, navigation } from "@translations/index";

import HeaderSideNav from "./HeaderSideNav";
import CustomLink from "@components/Link";

import "./header-nav.scss";

const navigationItems = navigationRoutes.map((path) =>
  routes.find((route) => route.path === path)
);

const HeaderNav = ({ withSideNav }: HeaderNavProps) => {
  const { pathname } = useLocation();
  const noLanguagePathName = "/" + pathname.split("/").slice(2).join("/");
  const translate = useTranslation();

  return (
    <div className="header-nav">
      <div className="header-nav__container">
        <div className="header-nav__row">
          <HeaderSideNav withSideNav={withSideNav} />
          <div className="menu-area">
            <ul className="main-menu">
              {navigationItems.map((navItem) => (
                <li key={navItem?.path}>
                  <CustomLink
                    to={navItem?.path || ""}
                    className={
                      noLanguagePathName === navItem?.path
                        ? "active current"
                        : ""
                    }
                  >
                    {translate(
                      (navigation as GenericObject)[
                      navItem?.translationKey || ""
                      ]
                    ) || navItem?.label}
                  </CustomLink>
                </li>
              ))}
            </ul>
            {/* <div className="clock">
              <span>{time}</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderNav;
