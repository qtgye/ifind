import { createContext, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { locale } from '@config/locale';
import globalDataQuery from '@gql/globalDataQuery';
import { apiSourceHandle } from '@config/adminApi'
import { useAuth } from '@contexts/authContext';

/**
 * This context should contain global data:
 * - Site data (contact infos, logo, etc.)
 * - Navigation items ?
 * - Footer items ?
 */
const GlobalContext = createContext({});

export const GlobalContextProvider = ({ children }) => {
    const { token } = useAuth();
    const {
        // loading,
        // error,
        data: globalData
    } = useQuery(globalDataQuery, {
        variables: { language: locale },
        context: {
            apiSource: apiSourceHandle,
            token
        }
    });

    return (
        <GlobalContext.Provider value={{
            contactInfo: globalData?.contactDetail,
            footerSetting: globalData?.footerSettingsByLanguage,
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