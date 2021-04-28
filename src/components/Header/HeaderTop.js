import './header-top.scss';
import TiIcon from '@components/TiIcon';

const HeaderTop = () => {
    return (
        <div className="header-top">
            <div className="header-top__container">
                <div className="header-top__content">
                    <div className="header-top__left">
                        <ul className="list-main">
                            <li>
                                <TiIcon icon='headphone-alt' />
                                 +123 (456)
                                789-102</li>
                            <li>
                                <TiIcon icon='email' />
                                support@ifindilu.com</li>
                        </ul>
                    </div>
                    <div className="header-top__right">
                        <ul className="list-main">
                            <li>
                                <TiIcon icon='alarm-clock' />
                                <a
                                    href="#">Daily deal</a></li>
                            <li>
                                <TiIcon icon='user' />
                                <a
                                    href="#">My account</a></li>
                            <li>
                                <TiIcon icon='power-off' />
                                <a
                                    href="login.html#">Login</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderTop;