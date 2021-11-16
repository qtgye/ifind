import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useQuery } from "@apollo/react-hooks";
import getLanguagesQuery from "@gql/getLanguagesQuery";
import { USER_LANGUAGE_KEY, locale } from '@config/locale';

export const LanguagesContext = createContext<LanguagesContextValue>({});

export const LanguagesProvider = ({
  children,
}: React.PropsWithChildren<React.ReactNode>) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [userLanguage, setUserLanguage] = useState<string>(locale);
  const {
    data,
    // loading,
    // error
  } = useQuery(getLanguagesQuery);

  const saveUserLanguage = useCallback((countryCode) => {
    window.localStorage.setItem(USER_LANGUAGE_KEY, countryCode);
    // Need to reload window in order to restart requests using the selected language
    window.location.reload();
  }, []);

  useEffect(() => {
    if (data?.languages) {
      setLanguages(data.languages);
    }
  }, [data]);

  return (
    <LanguagesContext.Provider
      value={{
        languages,
        userLanguage,
        saveUserLanguage,
      }}
    >
      {children}
    </LanguagesContext.Provider>
  );
};

export const useLanguages = () => useContext(LanguagesContext);
