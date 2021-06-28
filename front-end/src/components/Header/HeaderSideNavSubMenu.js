import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { GlobalStateContext } from '@contexts/globalStateContext';
import eventBus from '@utilities/EventBus';
import IfindIcon from '@components/IfindIcon';

const HeaderSideNavSubMenu = ({ item, index, checked, triggerScroll }) => {

    const { on } = eventBus;
    const [subCategories, setSubCategories] = useState(false);
    const showSubCategories = () => setSubCategories(!subCategories);
    //const [withColor, setWithColor] = useState(true);
    const categoryRef = useRef();

    const { activeIndex, onCategoryClick } = useContext(GlobalStateContext);

    const onCategorySelect = () => {
        item.subCategories && showSubCategories();
    }

    const handleScroll = useCallback(() => {
        on('scrollPanelScroll', triggerScroll)
    }, [on, triggerScroll]);

    const onItemClick = useCallback((index) => {
        onCategoryClick(index);
    }, []);

    useEffect(() => {
        if (activeIndex === index) {
            onCategorySelect();
        }
        else {
            setSubCategories(false);
        }
        console.log(activeIndex, index);
    }, [activeIndex, index])

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

    useEffect(() => {
        handleScroll();
    }, []);

    return (
        <>
            <li ref={categoryRef} key={index} className={["list", activeIndex === index ? "active" : ""].join(" ")}>
                <Link onClick={() => { onItemClick(index); }} to="#">
                    {/* <IfindIcon icon={item.icon} className="header-side-nav__icon" /> */}
                    {item.categoryIcon}
                    <span>{item.categoryLabel}</span>
                </Link>
                <ul className="header-side-nav__sub-list">
                    {checked ? (
                        subCategories && item.subCategories.map((item, index) => {
                            return (
                                <li key={index}>
                                    <Link to={item.categoryURL}>
                                        {/* <IfindIcon icon={item.icon} className="header-side-nav__icon" /> */}
                                        <span>{item.categoryLabel}</span>
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
