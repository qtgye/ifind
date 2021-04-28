import { Link } from 'react-router-dom';

import logo from '@assets/images/logo.png';
import routes from '@config/routes';

const informationPaths = [ '/about-us', '/agb', '/impressum', '/data-protection' ];
const informationLinks = informationPaths.map( path => routes.find(routeItem => routeItem.path === path));

const Footer = () => (

    <footer className="footer" id="footer">
        <div className="footer-top section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5 col-md-6 col-12">
                        <div className="single-footer about">
                            <div className="logo">
                                <a href="index.html"><img src={logo} alt="#" /></a>
                            </div>
                            <p className="text">Praesent dapibus, neque id cursus ucibus, tortor neque egestas augue,
                                magna eros eu erat.
                                Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus,
                                metus.</p>
                            <p className="call">Got Question? Call us 24/7<span><a href="tel:123456789">+0123 456
                                        789</a></span></p>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-6 col-12">
                        <div className="single-footer links">
                            <h4>Information</h4>
                            <ul>
                                {informationLinks.map(infoRoute => (
                                    infoRoute && <li key={infoRoute.path}>
                                        <Link to={infoRoute.path}>{infoRoute.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-6 col-12">
                        <div className="single-footer links">
                            <h4>Customer Service</h4>
                            <ul>

                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-12">
                        <div className="single-footer social">
                            <h4>Get In Touch</h4>
                            <div className="contact">
                                <ul>

                                </ul>
                            </div>
                            <ul>
                                <li><a href="#"><i className="ti-facebook"></i></a></li>
                                <li><a href="#"><i className="ti-twitter"></i></a></li>
                                <li><a href="#"><i className="ti-flickr"></i></a></li>
                                <li><a href="#"><i className="ti-instagram"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="copyright">
            <div className="container">
                <div className="inner">
                    <div className="row">
                        <div className="col-lg-6 col-12">
                            <div className="left">
                                <p>Copyright © 2021 <a href="http://www.ifindilu.com" target="_blank">iFINDilu</a> -
                                    All Rights Reserved.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="right">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;