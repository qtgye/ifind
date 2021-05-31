import { useState } from 'react';
import { Link } from 'react-router-dom';
import { find } from 'lodash';
import { useLocation } from 'react-router-dom';

import { homedata } from '@mocks/components/homesidenav';
// import { data } from '@mocks/components/prodcompsidenav';

import HeaderSideNavSubMenu from './HeaderSideNavSubMenu';
import routes from '@config/routes';
import { useCategoryTree } from '@contexts/categoriesContext';

import './header-side-nav.scss';

const HeaderSideNav = ({ withSideNav }) => {

    const { pathname } = useLocation();
    const currentRouteConfig = find(routes, ({ path }) => pathname === path);
    const categoryTree = useCategoryTree();

    const [checked, setChecked] = useState(false);
    const checkChange = () => setChecked(!checked);

    return withSideNav ?
        (
            <div className="header-side-nav">
                <h3 className="header-side-nav__heading"><i aria-hidden="true"
                    className="fa fa-bars"></i>CATEGORIES</h3>
                <ul className="header-side-nav__list">

                    {currentRouteConfig.path === '/' ?
                        (<div>
                            {homedata.map((item, index) => {
                                return (
                                    <li key={index}>
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
                                    <input id="check" type="checkbox" onChange={checkChange} checked={checked} />
                                    <span className="slider round"></span>
                                </label>

                            </div>
                            {categoryTree.map((item, index) => {
                                return (
                                    <HeaderSideNavSubMenu item={item} key={index} checked={checked} />
                                )
                            })}
                        </div>

                        )
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
            </div >
        ) : null;
};

export default HeaderSideNav;