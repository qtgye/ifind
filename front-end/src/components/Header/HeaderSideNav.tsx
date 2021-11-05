import React, { useState, useRef, useCallback, useEffect, LegacyRef, useContext } from 'react';
import { find } from 'lodash';
import { useLocation } from 'react-router-dom';
import routes from '@config/routes';
import { useSubCategories } from '@contexts/categoriesContext';
import { homedata } from '@mocks/components/homesidenav';
import eventBus from '@utilities/EventBus';
import { useWindowSize } from '../../utilities/WindowResize';
import { GlobalStateContext } from '@contexts/globalStateContext';

import './header-side-nav.scss';
import HeaderSideNavSubMenu from './HeaderSideNavSubMenu';
import HeaderSideNavButton from './HeaderSideNavButton';

const HeaderSideNav = ({ withSideNav }: HeaderNavProps) => {

    const { pathname } = useLocation();
    const currentRouteConfig = find(routes, ({ path }) => pathname === path);
    const { subCategories } = useSubCategories();
    const { on } = eventBus;
    const listRef = useRef<HTMLDivElement | null>();
    const { dealTypeName, onOffersClick } = useContext(GlobalStateContext);

    const [isVisible, setIsVisible] = useState(false);
    const [checked, setChecked] = useState(true);
    const checkChange = () => setChecked(!checked);
    const [width] = useWindowSize();

    const ecommerceClick = useCallback((catName) => {
        if (onOffersClick) {
            onOffersClick(catName);
        }
        //console.log(catName);
    }, [onOffersClick]);

    const triggerScroll = useCallback(() => {
        if (listRef.current) {
            listRef.current.scrollTop += listRef.current.offsetHeight;
        }
    }, [listRef]);

    const handleScroll = useCallback(() => {
        on('scrollPanelScroll', triggerScroll)
    }, [on, triggerScroll]);

    useEffect(() => {
        handleScroll();
    });

    return withSideNav ?
        (
            <div className="header-side-nav"
                onMouseEnter={() => setIsVisible(true)}
            >
                <h3 className="header-side-nav__heading"
                    onMouseLeave={() => setIsVisible(false)}
                >
                  {/*
                    TODO: Instead of dynamically rendering depending on width,
                    display/hide the "CATEGORIES" text instead through CSS
                  */}
                    <i aria-hidden="true" className="fa fa-bars"></i>{width > 991 ? "CATEGORIES" : ""}
                </h3>
                {isVisible ? <div ref={listRef as LegacyRef<HTMLDivElement>}
                    className="header-side-nav__list"
                    onMouseEnter={() => setIsVisible(true)}
                    onMouseLeave={() => setIsVisible(false)}
                >

                    {
                        currentRouteConfig?.path === '/' ?
                            (<div className="home-sidenav">
                                {homedata.map((item, index) => {
                                    return (
                                        <div key={index}
                                            className={["list", dealTypeName === item.categoryName ? "active" : ""].join(" ")}
                                        >
                                            <button onClick={() => ecommerceClick(item.categoryName)}>
                                                <span className="home-icon">{item.categoryIcon}</span>
                                                <span className="home-label">{item.categoryLabel}</span>
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                            ) : (<div className="prodcomp-sidenav">

                                <div className="header-side-nav__label">

                                    <label className="label">Display SideNav Bar</label>
                                    <label className="switch">
                                        <input id="check" type="checkbox"
                                            onChange={checkChange}
                                            checked={checked}
                                        />
                                        <span className="slider round"></span>
                                    </label>

                                </div>
                                <div>

                                    {
                                        checked ?
                                            <HeaderSideNavSubMenu
                                                categories={subCategories}
                                                checked={checked}
                                                //checkChange={checkChange}
                                                triggerScroll={triggerScroll}
                                            /> : null
                                    }

                                </div>



                            </div>)

                    }

                </div> : null

                }
                {isVisible && checked ? <div className="header-side-nav__arrow-container"
                    onMouseEnter={() => setIsVisible(true)}
                    onMouseLeave={() => setIsVisible(false)}
                >
                    {
                        currentRouteConfig?.path === '/productcomparison' ?
                            <HeaderSideNavButton /> : null
                    }
                </div> : null
                }

            </div >

        ) : null;
};

export default HeaderSideNav;
