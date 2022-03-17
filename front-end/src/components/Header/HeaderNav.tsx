import HeaderSideNav from "./HeaderSideNav";
import NavPills from "@components/NavPills";

import "./header-nav.scss";

import navPillProps from "@mocks/components/nav-pills";

const HeaderNav = () => {
  return (
    <div className="header-nav">
      <div className="header-nav__container">
        <div className="header-nav__row">
          <HeaderSideNav />
          <div className="menu-area">
            <ul className="main-menu">
              <NavPills items={navPillProps.items} />
            </ul>
            {/* <div className="clock">
              <span>{time}</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderNav;
