import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { find } from 'lodash';
import { useLocation } from 'react-router-dom';

import { homedata } from '@mocks/components/homesidenav';
import { data } from '@mocks/components/prodcompsidenav';

import routes from '@config/routes';
import { useCategoryTree } from '@contexts/categoriesContext';
// import { GlobalStateContext } from '@contexts/globalStateContext';

import './header-side-nav.scss';

import HeaderSideNavSubMenu from './HeaderSideNavSubMenu';
import HeaderSideNavButton from './HeaderSideNavButton';

const HeaderSideNav = ({ withSideNav }) => {

    const { pathname } = useLocation();
    const currentRouteConfig = find(routes, ({ path }) => pathname === path);
    const categoryTree = useCategoryTree();
    const listRef = useRef();

    const [checked, setChecked] = useState(true);
    const checkChange = () => setChecked(!checked);

    const triggerScroll = useCallback(() => {
        listRef.current.scrollTop += listRef.current.offsetHeight / 2;
    }, [listRef]);
    // const scroll = () => {
    //     const currentScroll = window.pageYOffset;
    //     const { top } = listRef.current.getBoundingClientRect();
    //     const targetScroll = currentScroll + top;

    //     window.scrollTo(0, targetScroll);
    // }
    return withSideNav ?
        (
            <div className="header-side-nav">
                <h3 className="header-side-nav__heading"><i aria-hidden="true"
                    className="fa fa-bars"></i>CATEGORIES</h3>
                <ul ref={listRef} className="header-side-nav__list">

                    {currentRouteConfig.path === '/' ?
                        (<div>
                            {homedata.map((item, index) => {
                                return (
                                    <li key={index}
                                        className={["list", index === 0 ? "active" : ""].join(" ")}
                                    >
                                        <Link to="#">
                                            {item.categoryIcon}
                                            <span>{item.categoryLabel}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </div>
                        ) : (<div>

                            <div className="header-side-nav__label">

                                <label className="label">Scroll with Subcategories</label>
                                <label className="switch">
                                    <input id="check" type="checkbox"
                                        onChange={checkChange}
                                        checked={checked}
                                    />
                                    <span className="slider round"></span>
                                </label>

                            </div>
                            {/* <div>
                                {categoryTree.map((item, index) => {
                                    // {data.map((item, index) => {
                                    return (
                                        <HeaderSideNavSubMenu item={item} index={index}
                                            checked={checked} key={index}
                                            triggerScroll={triggerScroll}
                                        />
                                    )
                                })}

                            </div> */}

                            <div>
                                <HeaderSideNavSubMenu categories={categoryTree} checked={checked} triggerScroll={triggerScroll} />
                            </div>



                        </div>)

                    }

                    {/* {(() => {
                        switch (currentRouteConfig.path) {
                            case '/':
                                return (proddata.map((item, index) => {
                                    return (
                                        <li key={index}><a>{item.categoryLabel}</a></li>
                                    )
                                }));
                            case '/productcomparison':
                                return <HeaderSwitch /> && data.map((item, index) => {
                                    return (
                                        <HeaderSideNavSubMenu item={item} key={index} />
                                    )
                                });

                            default:
                                return 'null';
                        }

                    })

                    } */}

                </ul>

                {
                    currentRouteConfig.path === '/productcomparison' ?
                        (<HeaderSideNavButton />) : null
                }

            </div >

        ) : null;
};

export default HeaderSideNav;