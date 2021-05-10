import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';

// Import mock data for use while backend is not yet available
import { phone, email, supportPhone, supportEmail } from '@mocks/global/contact';

/**
 * Initial globalData contents
 * Using mock data for now
 */
const initialData = {

    /**
     * Stores global site loading state
     */
    isSiteLoading: false,

    /**
     * Stores navigation items
     */
    navigation: {
        home: '/'
    },

    /**
     * Stores global contact info
     * Using mock data for now
     */
    contactInfo: {
        phone,
        email,
        supportPhone,
        supportEmail
        // ... Add more
    }
};

/**
 * This context should contain global data:
 * - Site data (contact infos, logo, etc.)
 * - Navigation items ?
 * - Footer items ?
 */
const GlobalContext = createContext({
    initialData
});

const actions = {
    UPDATE_CONTACT: 'UPDATE_CONTACT'
}

const globalDataReducer = (state, action) => {
    switch (action.type) {
        case actions.UPDATE_CONTACT:
            return {
                ...state,
                contactInfo: {
                    email: action.payload.email,
                    phone: action.payload.phone,
                    supportPhone: action.payload.supportPhone,
                    supportEmail: action.payload.supportEmail
                }
            }
        default: ;
    }
}

export const GlobalContextProvider = ({ children }) => {
    const [globalData, dispatch] = useReducer(globalDataReducer, initialData);

    // Handle global data fetching here
    useEffect(() => {
        // Fetch global data,
        // preferably create a hook for fetch
        // instead of calling it directly
    }, []);

    const updateContact = useCallback(({ email, phone, supportPhone, supportEmail }) => {
        dispatch({
            type: actions.UPDATE_CONTACT,
            payload: { email, phone, supportPhone, supportEmail }
        })
    }, [dispatch]);

    return (
        <GlobalContext.Provider value={{ ...globalData, updateContact }}>
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