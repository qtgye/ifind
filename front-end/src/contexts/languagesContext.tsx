import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useQuery } from "@apollo/react-hooks";
import getLanguagesQuery from "@gql/getLanguagesQuery";
import { USER_LANGUAGE_KEY, locale } from "@config/locale";
import countriesConfig from "@config/countries";

export const LanguagesContext = createContext<LanguagesContextValue>({});

export const LanguagesProvider = ({
  children,
}: React.PropsWithChildren<React.ReactNode>) => {
  const [languages, setLanguages] = useState<LanguageWithFlag[]>([]);
  const [userLanguage] = useState<string>(locale);
  const {
    data,
    // loading,
    // error
  } = useQuery(getLanguagesQuery);

  const saveUserLanguage = useCallback((languageCode) => {
    window.localStorage.setItem(USER_LANGUAGE_KEY, languageCode);
    // Need to reload window in order to restart requests using the selected language
    window.location.reload();
  }, []);

  useEffect(() => {
    if (data?.languages) {
      const languagesWithFlags: LanguageWithFlag[] = data.languages.map((language: LanguageWithFlag) => {
        const { country_flag } = language;
        const matchedCountry = countriesConfig.find(({ name }) => name === country_flag);

        if ( matchedCountry ) {
          language.flag = matchedCountry.code;
        }

        return language;
      })
      setLanguages(languagesWithFlags);
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
