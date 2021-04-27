import HeaderTop from './HeaderTop';
import HeaderMiddle from './HeaderMiddle';
import HeaderNav from './HeaderNav';

const Header = () => {

    console.log('Test CI if it works');

    return (
        <header className="header shop">
            <HeaderTop />
            <HeaderMiddle />
            <HeaderNav />
        </header>
    )
}

export default Header;