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
    const categoryRef = useRef();

    const { activeIndex, onCategoryClick } = useContext(GlobalStateContext);

    const onCategorySelect = () => {
        item.children && showSubCategories();
    }

    const handleScroll = useCallback(() => {
        on('scrollPanelScroll', triggerScroll)
    }, [on, triggerScroll]);

    const onItemClick = useCallback((id) => {
        onCategoryClick(id);
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
            <li key={index} ref={categoryRef} key={index} className={["list", activeIndex === index ? "active" : ""].join(" ")}>
                <Link onClick={item.children && showSubCategories} to="#">
                    <IfindIcon icon={item.icon} className="header-side-nav__icon" />
                    <span>{item.label.label}</span>

                </Link>
                <ul className="header-side-nav__sub-list">
                    {checked ? (
                        subCategories && item.children.map((item, index) => {
                            return (
                                <li key={index}>
                                    <Link to={item.categoryURL}>
                                        {/* <IfindIcon icon={item.icon} className="header-side-nav__icon" /> */}
                                        {/* <span>{item.categoryLabel}</span> */}

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
