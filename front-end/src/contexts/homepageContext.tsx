import { createContext, useContext } from 'react';
import { useQuery } from "@apollo/react-hooks";
import homepageQuery from '@gql/homepageQuery';

export const HomepageContext = createContext({});

export const HomepageContextProvider = ({ children }) => {
    const {
        loading,
        // error,
        data,
    } = useQuery(homepageQuery);

    return (
        <HomepageContext.Provider value={{ data, loading }}>
            {children}
        </HomepageContext.Provider>
    )
}

HomepageContextProvider.providerName = 'HomepageContextProvider';

export const useHomepageData = () => {
    const context = useContext(HomepageContext);
    return context;
}

// Export as default to be used in testing
export default HomepageContext;