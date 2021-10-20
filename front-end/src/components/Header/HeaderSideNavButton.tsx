import React, { useState, useEffect, useCallback } from 'react';
import { useWindowScroll } from 'react-use';
import eventBus from '@utilities/EventBus';

const HeaderSideNavButton = (): JSX.Element => {

    const { y: pageYOffset } = useWindowScroll();
    const [isVisible, setIsVisible] = useState(false);
    const { dispatch } = eventBus;

    const onClick = useCallback(() => {
        //console.log("clicked");
        dispatch('scrollPanelScroll', null);
    }, [dispatch]);


    useEffect(() => {
        if (pageYOffset === window.document.documentElement.offsetHeight) {
            setIsVisible(false);
        }
        else {
            setIsVisible(true);
        }

    }, [pageYOffset])


    if (!isVisible) {
        return <></>;
    }

    return (
        <div className="arrow-button" onClick={onClick}>
            <i className="fa fa-chevron-down"></i>
        </div>
    )
}

export default HeaderSideNavButton;
