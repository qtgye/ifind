import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import IfindIcon from '@components/IfindIcon';

const HeaderSideNavSubMenu = ({ item, index, checked, ref }) => {

    const [subCategories, setSubCategories] = useState(false);

    const showSubCategories = () => setSubCategories(!subCategories);

    return (
        <>
            <li key={index}>
                <div ref={ref} />
                <Link onClick={item.children && showSubCategories} to="#">
                    <IfindIcon icon={item.icon} className="header-side-nav__icon" />
                    <span>{item.label.label}</span>
                </Link>
                {console.log(ref)}

                <ul className="header-side-nav__sub-list">
                    {checked ? (
                        subCategories && item.children.map((item, index) => {
                            return (
                                <li key={index}>
                                    <Link to="#">
                                        {/* <IfindIcon icon={item.icon} className="header-side-nav__icon" /> */}
                                        <span>{item.label.label}</span>
                                    </Link>
                                </li>
                            );
                        })
                    ) : null}
                </ul>
            </li>
        </>
    )
}

export default HeaderSideNavSubMenu;
