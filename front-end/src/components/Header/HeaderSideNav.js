import React, { useState, useRef, useCallback, useEffect } from 'react';
import { find } from 'lodash';
import { useLocation } from 'react-router-dom';
import routes from '@config/routes';
import { useSubCategories } from '@contexts/categoriesContext';
import { homedata } from '@mocks/components/homesidenav';
import eventBus from '@utilities/EventBus';

import './header-side-nav.scss';
import HeaderSideNavSubMenu from './HeaderSideNavSubMenu';
import HeaderSideNavButton from './HeaderSideNavButton';

const HeaderSideNav = ({ withSideNav }) => {

    const { pathname } = useLocation();
    const currentRouteConfig = find(routes, ({ path }) => pathname === path);
    const { subCategories } = useSubCategories();
    //const categoryTree = useCategoryTree();
    const { on } = eventBus;
    const listRef = useRef();

    const [isVisible, setIsVisible] = useState(true);
    const changeVisibility = () => setIsVisible(!isVisible);
    const [checked, setChecked] = useState(true);
    const checkChange = () => setChecked(!checked);
    // const [isHovered, setisHovered] = useState(false);
    const triggerScroll = useCallback(() => {
        listRef.current.scrollTop += listRef.current.offsetHeight;
    }, [listRef]);

    const handleScroll = useCallback(() => {
        on('scrollPanelScroll', triggerScroll)
    }, [on, triggerScroll]);

    useEffect(() => {
        handleScroll();
    });

    return withSideNav ?
        (
            <div className="header-side-nav">
                <h3 className="header-side-nav__heading"
                    onClick={changeVisibility}
                >
                    <i aria-hidden="true" className="fa fa-bars"></i>CATEGORIES</h3>
                {isVisible ? <div ref={listRef}
                    className="header-side-nav__list"
                >

                    {
                        currentRouteConfig.path === '/' ?
                            (<div>
                                {homedata.map((item, index) => {
                                    return (
                                        <div key={index}
                                            className={["list", index === 0 ? "active" : ""].join(" ")}
                                        >
                                            <button>
                                                {item.categoryIcon}
                                                <span>{item.categoryLabel}</span>
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                            ) : (<div>

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
                                                id={subCategories}
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

                {
                    currentRouteConfig.path === '/productcomparison' ?
                        (isVisible && checked ? <HeaderSideNavButton /> : "") : null
                }

            </div >

        ) : null;
};

export default HeaderSideNav;
