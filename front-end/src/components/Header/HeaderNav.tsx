import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigationRoutes } from '@config/routes';
import routes from '@config/routes';

import HeaderSideNav from './HeaderSideNav';

import './header-nav.scss';

const navigationItems = navigationRoutes.map(path => routes.find(route => route.path === path));

const HeaderNav = ({ withSideNav }: HeaderNavProps) => {

    const { pathname } = useLocation();

    return (
        <div className="header-nav">
            <div className="header-nav__container">
                <div className="header-nav__row">
                    <HeaderSideNav withSideNav={withSideNav} />
                    <div className="menu-area">
                        <ul className="main-menu">
                            {navigationItems.map((navItem) => (
                                <li key={navItem?.path}>
                                    <Link to={navItem?.path || ''} className={pathname === navItem?.path ? 'active current' : ''}>
                                        {navItem?.label}
                                    </Link>
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
    )
}

export default HeaderNav;
