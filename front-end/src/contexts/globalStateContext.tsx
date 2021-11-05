import React, { createContext, useState, useCallback, useContext } from "react";

export const GlobalStateContext = createContext<GlobalStateContextData>({});

export const GlobalStateContextProvider = ({
  children,
}: React.PropsWithChildren<React.ReactNode>) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [focusedCategory, setFocusedCategory] = useState(0);
  const [dealTypeName, setDealTypeName] = useState("amazon_flash_offers");

  const onCategoryClick = useCallback((id) => {
    setFocusedCategory(id);
  }, []);

  const onOffersClick = useCallback((name) => {
    setDealTypeName(name);
  }, []);

  return (
    <GlobalStateContext.Provider value={{
      activeCategory: parseInt(activeCategory || '', 10),
      setActiveCategory,
      focusedCategory,
      onCategoryClick,
      dealTypeName,
      onOffersClick,
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
}
export const useGlobalState = () => useContext(GlobalStateContext);
