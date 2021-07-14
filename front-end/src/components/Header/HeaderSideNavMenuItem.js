import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { GlobalStateContext } from '@contexts/globalStateContext';
import IfindIcon from '@components/IfindIcon';
import HeaderSideNavSubMenu from './HeaderSideNavSubMenu';
import { getGrandchildrenCategories } from '../../utilities/category';

const HeaderSideNavMenuItem = ({ category, checked, checkChange }) => {

    const [subCategories, setSubCategories] = useState(false);
    const showSubCategories = () => setSubCategories(!subCategories);
    const { activeCategory, onCategoryClick } = useContext(GlobalStateContext);
    const grandChildren = getGrandchildrenCategories(category?.children || []);
    const categoryRef = useRef();

    const onItemClick = useCallback((id) => {
        onCategoryClick(id);
        console.log(id);
    }, []);

    const onActiveCategory = useCallback((activeCategory) => {
        if (grandChildren.find((category) => category.id == activeCategory)) {
            setSubCategories(true);
        }
        else {
            setSubCategories(false);
        }
    }, [grandChildren]);

    useEffect(() => {
        onActiveCategory(activeCategory);
        console.log(activeCategory, grandChildren);
    }, [activeCategory])

    const categoryClick = () => {
        if (!category.children) {
            onItemClick(category.id);
        }
        showSubCategories();
    }
    // useEffect(() => {
    //     let handleClick = (event) => {
    //         if (categoryRef.current && !categoryRef.current.contains(event.target)) {
    //             setSubCategories(false);
    //         }
    //     };

    //     window.addEventListener("click", handleClick);
    //     return () => {
    //         window.removeEventListener("click", handleClick);
    //     }
    // }, [categoryRef, subCategories, setSubCategories])

    return (
        <div ref={categoryRef} key={category.id} className={["list", activeCategory == category.id ? "active" : ""].join(" ")}>
            <button onClick={categoryClick}>
                <IfindIcon icon={category.icon} className="header-side-nav__icon" />
                {category.label.label}
            </button>
            {checked ?
                (subCategories && category.children &&
                    <div className="listing" key={category.id}>
                        <HeaderSideNavSubMenu categories={category.children} key={category.id} checked={checked} />
                    </div>) : null
            }
        </div>
    )
}

export default HeaderSideNavMenuItem;
