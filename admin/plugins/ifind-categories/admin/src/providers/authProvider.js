import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext
} from 'react';

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const storage = /ifindilu\.com\/admin/i.test(strapi.remoteURL) ? window.sessionStorage : window.localStorage;
  const [ jwt ] = useState(( storage.getItem('jwtToken') || '' ).replace(/"/g, ''));

  return (
    <AuthContext.Provider value={{ jwt }}>
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
}