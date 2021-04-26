import logo from '@assets/images/logo.png';

const HeaderMiddle = () => {
    return (
        <div className="middle-inner">
            <div className="container">
                <div className="row">
                    <div className="col-lg-2 col-md-2 col-12">
                        <div className="logo"><a href="/"><img
                                    src={logo} alt="logo" /></a></div>
                        <div className="search-top">
                            <div className="top-search"><a href="#0"><i
                                        className="ti-search"></i></a></div>
                            <div className="search-top">
                                <form className="search-form"><input type="text"
                                        placeholder="Search here..." name="search" /><button
                                        value="search" type="submit"><i
                                            className="ti-search"></i></button></form>
                            </div>
                        </div>
                        <div className="mobile-nav">
                            <div className="slicknav_menu"><a href="#" aria-haspopup="true" role="button" tabindex="0"
                                    className="slicknav_btn slicknav_collapsed" style={{outline: 'none'}}><span
                                        className="slicknav_menutxt"></span><span className="slicknav_icon slicknav_no-text"><span
                                            className="slicknav_icon-bar"></span><span className="slicknav_icon-bar"></span><span
                                            className="slicknav_icon-bar"></span></span></a>
                                <ul className="slicknav_nav slicknav_hidden" style={{display: 'none'}}
                                    aria-hidden="true" role="menu">
                                    <li><a routerlinkactive="active current"
                                            ng-reflect-router-link-active="active current" ng-reflect-router-link="/"
                                            href="/" className="active current" role="menuitem" tabindex="-1">Home</a></li>
                                    <li><a routerlinkactive="active"
                                            ng-reflect-router-link-active="active"
                                            ng-reflect-router-link="/productcomparison" href="/productcomparison"
                                            role="menuitem" tabindex="-1">Product Comparison</a></li>
                                    <li><a routerlinkactive="active"
                                            ng-reflect-router-link-active="active" ng-reflect-router-link="/findtube"
                                            href="/findtube" role="menuitem" tabindex="-1">Findtube</a></li>
                                    <li><a routerlinkactive="active"
                                            ng-reflect-router-link-active="active" ng-reflect-router-link="/blog"
                                            href="/blog" role="menuitem" tabindex="-1">Blog</a></li>
                                    <li><a routerlinkactive="active"
                                            ng-reflect-router-link-active="active" ng-reflect-router-link="/contact"
                                            href="/contact" role="menuitem" tabindex="-1">Contact Us</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8 col-md-7 col-12">
                        <div className="search-bar-top">
                            <div className="search-bar">
                                <form><input name="search"
                                        placeholder="Search Products Here....." type="search" /><button
                                        className="btnn"><i className="ti-search"></i></button></form>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-12">
                        <div className="right-bar">
                            <div className="sinlge-bar"><a href="#"
                                    className="single-icon"><i aria-hidden="true"
                                        className="fa fa-user-circle-o"></i></a></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderMiddle;