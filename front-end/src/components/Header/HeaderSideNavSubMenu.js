import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import IfindIcon from '@components/IfindIcon';

const HeaderSideNavSubMenu = ({ item, index, checked }) => {

    const [subCategories, setSubCategories] = useState(false);

    const showSubCategories = () => setSubCategories(!subCategories);

    return (
        <>
            <li>
                <Link onClick={item.children && showSubCategories} key={index} to="#">
                    <IfindIcon icon={item.icon} className="header-side-nav__icon"/>
                    <span>{item.label}</span>
                </Link>
                <ul className="header-side-nav__sub-list">
                    {checked ? (
                        subCategories && item.children.map((item, index) => {
                            return (
                                <li key={index}><Link to="#">{item.label}</Link></li>
                            );
                        })
                    ) : null}
                </ul>
            </li>
        </>
    )
}

export default HeaderSideNavSubMenu;
