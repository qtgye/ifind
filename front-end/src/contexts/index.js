import { useEffect, useState } from 'react';

import { UserContextProvider } from './userContext';
import { GlobalContextProvider } from './globalDataContext';
import { HomepageContextProvider } from './homepageContext';
import { ProductContextProvider } from './productContext';
import { useUser } from '@contexts/userContext';

const providers = [
    UserContextProvider,
    GlobalContextProvider,
    HomepageContextProvider,
    ProductContextProvider,
];

export const Providers = ({ children }) => {
    const [ userToken, setUserToken ] = useState(null);
    const userData = useUser();

    useEffect(() => {
        if ( userData?.login?.jwt ) {
            setUserToken(userData.login.jwt);
        }
    }, [ setUserToken, userData ]);

    return userToken && (
        providers.reverse().reduce(( all, ParentProvider ) => (
            <ParentProvider>
                {all}
            </ParentProvider>
        ), children)
    )
};
