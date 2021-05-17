import { createContext, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { locale } from '@config/locale';
import globalDataQuery from '@gql/globalDataQuery';

/**
 * This context should contain global data:
 * - Site data (contact infos, logo, etc.)
 * - Navigation items ?
 * - Footer items ?
 */
const GlobalContext = createContext({});

export const GlobalContextProvider = ({ children }) => {
    const {
        // loading,
        // error,
        data: globalData
    } = useQuery(globalDataQuery, {
        variables: { locale },
        context: { apiSource: 'admin' }
    });

    return (
        <GlobalContext.Provider value={{
            contactInfo: globalData?.contactDetail,
            footerSetting: globalData?.footerSetting,
            socialNetwork: globalData?.socialNetwork
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalData = () => {
    const context = useContext(GlobalContext);
    return context;
}

// Export as default to be used in testing
export default GlobalContext;