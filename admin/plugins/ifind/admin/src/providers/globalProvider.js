import React, {
  createContext,
  useState,
  useContext
} from 'react';

export const GlobalContext = createContext({});

export const GlobalContextProvider = ({ children }) => {
  const [ isLoading, setIsLoading ] = useState(false);

  return (
    <GlobalContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </GlobalContext.Provider>
  )
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  return context;
}