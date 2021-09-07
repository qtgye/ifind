import React, { useState, useCallback } from 'react';
import IfindIcon from '@components/IfindIcon';
import { useSubCategories } from '../../contexts/categoriesContext';

import './header-cat-nav.scss';

const HeaderCategoriesNav = ({ categories, visible }) => {

    const { setSubCategories } = useSubCategories();
    const [active, setActive] = useState(0);

    const onCategoryNavClick = useCallback((category, index) => {
        setSubCategories(category.children);
        setActive(index);
    }, [setSubCategories]);

    return (
        <div className="header-cat-nav">
            <div className="header-cat-nav__container">
                <div className="header-cat-nav__row">
                    <div className="cat-menu-area">
                        <ul className="cat-menu">
                            {categories.map((category, index) => (
                                <li key={index}>
                                    <button className={["cat-menu", active === index ? "active" : ""].join(" ")}
                                        onClick={() => { onCategoryNavClick(category); visible(true); }}
                                    >
                                        <IfindIcon icon={category.icon} className="cat-menu-icon" />
                                        <span>{(category.label.label).split(" ")[0]}</span>
                                    </button>
                                </li>
                            ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderCategoriesNav;
