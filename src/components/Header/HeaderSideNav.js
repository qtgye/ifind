import { useLocation } from 'react-router-dom';
import { find } from 'lodash';
import routes from '@config/routes';

import './header-side-nav.scss';

const HeaderSideNav = () => {
    const { pathname } = useLocation();

    const currentRouteConfig = find(routes, ({ path }) => pathname === path );
    const withSideNav = currentRouteConfig && currentRouteConfig.withSideNav;

    return  withSideNav ?
    (
        <div className="header-side-nav">
            <h3 className="header-side-nav__heading"><i aria-hidden="true"
                    className="fa fa-bars"></i>CATEGORIES</h3>
            <ul className="header-side-nav__list">
                <li>
                    <a href="/">New Arrivals <i aria-hidden="true" className="fa fa-angle-right"></i></a>
                </li>
                <li>
                    <a href="/">Best Selling <i aria-hidden="true" className="fa fa-angle-right"></i></a>
                </li>
                <li><a href="/">Accessories</a></li>
                <li><a href="/">Top 100 Offer</a></li>
                <li><a href="/">Sunglass</a></li>
                <li><a href="/">Watch</a></li>
                <li><a href="/">Man’s Product</a></li>
                <li><a href="/">Ladies</a></li>
                <li><a href="/">Western Dress</a></li>
                <li><a href="/">Denim </a></li>
            </ul>
        </div>
    ) : null;
};

export default HeaderSideNav;