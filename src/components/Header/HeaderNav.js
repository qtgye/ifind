import routes from '@config/routes';

import HeaderSideNav from './HeaderSideNav';

const HeaderNav = () => {

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
                                                <li><a
                                                        routerlinkactive="active current"
                                                        ng-reflect-router-link-active="active current"
                                                        ng-reflect-router-link="/" href="/" className="active current">Home</a>
                                                </li>
                                                <li><a routerlinkactive="active"
                                                        ng-reflect-router-link-active="active"
                                                        ng-reflect-router-link="/productcomparison"
                                                        href="/productcomparison">Product Comparison</a></li>
                                                <li><a routerlinkactive="active"
                                                        ng-reflect-router-link-active="active"
                                                        ng-reflect-router-link="/findtube" href="/findtube">Findtube</a>
                                                </li>
                                                <li><a routerlinkactive="active"
                                                        ng-reflect-router-link-active="active"
                                                        ng-reflect-router-link="/blog" href="/blog">Blog</a></li>
                                                <li><a routerlinkactive="active"
                                                        ng-reflect-router-link-active="active"
                                                        ng-reflect-router-link="/contact" href="/contact">Contact Us</a>
                                                </li>
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