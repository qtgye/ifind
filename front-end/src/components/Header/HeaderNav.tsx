import React from 'react';
import { useLocation } from 'react-router-dom';
import { navigationRoutes } from '@config/routes';
import routes from '@config/routes';

import HeaderSideNav from './HeaderSideNav';
import CustomLink from '@components/Link';

import './header-nav.scss';

const navigationItems = navigationRoutes.map(path => routes.find(route => route.path === path));

const HeaderNav = ({ withSideNav }: HeaderNavProps) => {

    const { pathname } = useLocation();
    const noLanguagePathName = '/' + pathname.split('/').slice(2).join('/');

    // let time = new Date().toLocaleTimeString();
    // const [currentTime, setCurrentTime] = useState(time);

    // const runningTime = () => {
    //     currentTime = new Date().toLocaleTimeString();
    //     setCurrentTime(currentTime);
    // }

    // setInterval(runningTime, 1000);

    return (
        <div className="header-nav">
            <div className="header-nav__container">
                <div className="header-nav__row">
                    <HeaderSideNav withSideNav={withSideNav} />
                    <div className="menu-area">
                        <ul className="main-menu">
                            {navigationItems.map((navItem) => (
                                <li key={navItem?.path}>
                                    <CustomLink to={navItem?.path || ''} className={noLanguagePathName === navItem?.path ? 'active current' : ''}>
                                        {navItem?.label}
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
    )
}

export default HeaderNav;
