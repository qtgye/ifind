import React, { createContext, useState, useCallback } from 'react';

export const GlobalStateContext = createContext<GlobalStateContextData>({});

export const GlobalStateContextProvider = ({ children }: React.PropsWithChildren<React.ReactNode>) => {

    const [activeCategory, setActiveCategory] = useState(null);
    const [focusedCategory, setFocusedCategory] = useState(0);

    const onCategoryClick = useCallback((id) => {
        setFocusedCategory(id);
    }, []);

    return (
        <GlobalStateContext.Provider value={{
            activeCategory: parseInt(activeCategory || '', 10),
            setActiveCategory,
            focusedCategory,
            onCategoryClick,
        }}>
            {children}
        </GlobalStateContext.Provider>
    );
}
