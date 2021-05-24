import React from 'react';
import { useState } from 'react';

const HeaderSideNavSubMenu = ({ item, index, checked }) => {

    const [subCategories, setSubCategories] = useState(false);

    const showSubCategories = () => setSubCategories(!subCategories);

    return (
        <>
            <li>
                <a onClick={item.subCategories && showSubCategories} href="#" key={index}>{item.categoryLabel}</a>
                <ul className="header-side-nav__sub-list">
                    {checked ? (
                        subCategories && item.subCategories.map((item, index) => {
                            return (
                                <li key={index}><a href="#" >{item.categoryLabel}</a></li>
                            );
                        })
                    ) : null}
                </ul>
            </li>
        </>
    )
}

export default HeaderSideNavSubMenu;
