import { useLocation } from 'react-router-dom';
import { find } from 'lodash';
import routes from '@config/routes';

const HeaderSideNav = () => {
    const { pathname } = useLocation();

    const currentRouteConfig = find(routes, ({ path }) => pathname === path );
    const withSideNav = currentRouteConfig && currentRouteConfig.withSideNav;

    return  withSideNav ?
    (
        <div className="col-lg-3">
            <div className="all-category">
                <h3 className="cat-heading"><i aria-hidden="true"
                        className="fa fa-bars"></i>CATEGORIES</h3>
                <ul className="main-category">
                    <li><a href="#">New Arrivals <i
                                aria-hidden="true" className="fa fa-angle-right"></i></a>
                    </li>
                    <li className="main-mega"><a href="#">best
                            selling <i aria-hidden="true"
                                className="fa fa-angle-right"></i></a></li>
                    <li><a href="#">accessories</a></li>
                    <li><a href="#">top 100 offer</a></li>
                    <li><a href="#">sunglass</a></li>
                    <li><a href="#">watch</a></li>
                    <li><a href="#">man’s product</a></li>
                    <li><a href="#">ladies</a></li>
                    <li><a href="#">western dress</a></li>
                    <li><a href="#">denim </a></li>
                </ul>
            </div>
        </div>
    ) : null;
};

export default HeaderSideNav;