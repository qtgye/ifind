import { createContext, useState, useCallback } from 'react';

export const GlobalStateContext = createContext({});

export const GlobalStateContextProvider = ({ children }) => {

    const [activeIndex, setActiveIndex] = useState(null);
    const [focusedIndex, setFocusedIndex] = useState(0);

    const onCategoryClick = useCallback((index) => {
        setFocusedIndex(index);
    }, []);

    return (
        <GlobalStateContext.Provider value={{
            activeIndex: parseInt(activeIndex, 10),
            setActiveIndex,
            focusedIndex,
            onCategoryClick,
        }}>
            {children}
        </GlobalStateContext.Provider>
    );
}