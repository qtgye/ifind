import { createContext, useState, useCallback } from 'react';

export const GlobalStateContext = createContext({});

export const GlobalStateContextProvider = ({ children }) => {

    const [activeIndex, setActiveIndex] = useState(null);
    const [focusedCategory, setFocusedCategory] = useState(0);

    const onCategoryClick = useCallback((id) => {
        setFocusedCategory(id);
    }, []);

    return (
        <GlobalStateContext.Provider value={{
            activeIndex: parseInt(activeIndex, 10),
            setActiveIndex,
            focusedCategory,
            onCategoryClick,
        }}>
            {children}
        </GlobalStateContext.Provider>
    );
}