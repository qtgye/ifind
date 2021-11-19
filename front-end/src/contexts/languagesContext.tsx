import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import getLanguagesQuery from "@gql/getLanguagesQuery";
import countriesConfig from "@config/countries";

export const LanguagesContext = createContext<LanguagesContextValue>({});

export const LanguagesProvider = ({
  children,
}: React.PropsWithChildren<React.ReactNode>) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const { language } = useParams<{ language?: string }>();
  const [languages, setLanguages] = useState<LanguageWithFlag[]>([]);
  const [userLanguage, setUserLanguage] = useState(language || "");
  const {
    data,
    // loading,
    // error
  } = useQuery(getLanguagesQuery);

  const replaceLanguage = useCallback((languageCode) => {
    const urlSegments = pathname.replace(/\/$/, '').split('/');

    // Replace language code
    urlSegments[1] = languageCode;

    // Redirect
    history.push(urlSegments.join('/'));
  }, [ pathname, history ]);

  useEffect(() => {
    if (data?.languages) {
      const languagesWithFlags: LanguageWithFlag[] = data.languages.map(
        (language: LanguageWithFlag) => {
          const { country_flag } = language;
          const matchedCountry = countriesConfig.find(
            ({ name }) => name === country_flag
          );

          if (matchedCountry) {
            language.flag = matchedCountry.code;
          }

          return language;
        }
      );
      setLanguages(languagesWithFlags);
    }
  }, [data]);

  useEffect(() => {
    setUserLanguage(language || "");
  }, [language]);

  return (
    <LanguagesContext.Provider
      value={{
        languages,
        userLanguage,
        replaceLanguage,
      }}
    >
      {children}
    </LanguagesContext.Provider>
  );
};

export const useLanguages = () => useContext(LanguagesContext);
