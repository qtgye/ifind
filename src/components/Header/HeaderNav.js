const HeaderNav = () => {
    return (
        <div className="header-inner">
            <div className="container">
                <div className="cat-nav-head">
                    <div className="row">
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