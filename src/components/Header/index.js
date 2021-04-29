import { useCallback, useEffect, useState } from 'react';

import HeaderTop from './HeaderTop';
import HeaderMiddle from './HeaderMiddle';
import HeaderNav from './HeaderNav';

import './header.scss';

const Header = () => {
    const [ isSticky, setIsSticky ] = useState(false);
    const [ classNames, setClassNames ] = useState('header');

    /**
     * Handles intersection
     * isInterSected is false when header is in sticky state
     */
    const handleHeaderIntersection = useCallback(isInterSected => {
        setIsSticky(!isInterSected);
    }, []);

    // Apply necessary classnames for sticky state
    useEffect(() => {
        const updatedClassNames = ['header'];

        if ( isSticky ) {
            updatedClassNames.push('header--sticked');
        }

        setClassNames(updatedClassNames.join(' '));
    }, [ isSticky ]);

    return (
        <header className={classNames}>
            <HeaderTop />
            <HeaderMiddle onInterSect={handleHeaderIntersection} />
            <HeaderNav />
        </header>
    )
}

export default Header;