import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const HeaderSideNavSubMenu = ({ item, index, checked }) => {

    const [subCategories, setSubCategories] = useState(false);

    const showSubCategories = () => setSubCategories(!subCategories);

    return (
        <>
            <li>
                <Link onClick={item.subCategories && showSubCategories} key={index}>
                    {item.categoryIcon}
                    <span>{item.categoryLabel}</span>
                </Link>
                <ul className="header-side-nav__sub-list">
                    {checked ? (
                        subCategories && item.subCategories.map((item, index) => {
                            return (
                                <li key={index}><Link>{item.categoryLabel}</Link></li>
                            );
                        })
                    ) : null}
                </ul>
            </li>
        </>
    )
}

export default HeaderSideNavSubMenu;
