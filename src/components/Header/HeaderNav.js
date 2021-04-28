import { Link, useLocation } from 'react-router-dom';
import routes, { navigationRoutes } from '@config/routes';

import HeaderSideNav from './HeaderSideNav';

const navigationItems = navigationRoutes.map(path => routes.find(route => route.path === path ));

const HeaderNav = () => {
    const { pathname } = useLocation();

    return (
        <div className="header-inner">
            <div className="container">
                <div className="cat-nav-head">
                    <div className="row">
                        <HeaderSideNav />
                        
                        <div className="col-lg-9 col-12">
                            <div className="menu-area">
                                <nav className="navbar navbar-expand-lg">
                                    <div className="navbar-collapse">
                                        <div className="nav-inner">
                                            <ul className="nav main-menu menu navbar-nav">
                                                { navigationItems.map(({ path, label }) => (
                                                    <li key={path}>
                                                        <Link to={path} className={ pathname === path ? 'active current' : '' }>
                                                            {label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderNav;