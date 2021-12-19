import { Suspense, lazy, useEffect, useState, useCallback } from "react";
import { useLanguages } from "@contexts/languagesContext";

import countriesConfig from "@config/countries";

const FlagSelect = lazy(
  () => import("@components/FlagsSelect") as Promise<any>
);

const HeaderLanguageButton = () => {
  const {
    languages = [],
    userLanguage = "en",
    replaceLanguage,
  } = useLanguages();
  const [countries, setCountries] = useState<string[]>([]);
  const [labels, setLabels] = useState<{ [key: string]: string }>();
  const [selected, setSelected] = useState<string>("");

  const applyUserLanguage = useCallback(
    (countryCode) => {
      const matchedCountryConfig:
        | CountryConfig
        | undefined = countriesConfig.find(
        ({ code }: CountryConfig) => code.toLocaleLowerCase() === countryCode
      );

      if (!matchedCountryConfig) {
        return;
      }

      const countryNameSlug = matchedCountryConfig.name;
      const matchedLanguage = languages.find(
        ({ country_flag }) => countryNameSlug === country_flag
      );

      if (matchedLanguage && replaceLanguage) {
        replaceLanguage(matchedLanguage.code);
      }
    },
    [languages, replaceLanguage]
  );

  useEffect(() => {
    if (languages.length) {
      setCountries(
        languages.map(({ flag }) => flag?.toLocaleLowerCase() || "")
      );
      setLabels(
        languages.reduce(
          (
            all: { [key: string]: string },
            { flag, name }: LanguageWithFlag
          ) => {
            all[flag?.toLocaleLowerCase() || ""] = name || "";
            return all;
          },
          {}
        )
      );
    }
  }, [languages]);

  useEffect(() => {
    if (countries?.length && userLanguage) {
      const matchedLanguage = languages.find(
        ({ code }) => code === userLanguage
      );
      const matchedCountryNameSlug = matchedLanguage
        ? matchedLanguage.country_flag
        : null;
      const matchedCountry = countriesConfig.find(
        ({ name }) => name === matchedCountryNameSlug
      );

      if (matchedCountry) {
        setSelected(matchedCountry?.code?.toLocaleLowerCase() || "");
      }
    }

  }, [languages, countries, userLanguage]);

  return (
    <div>
      <Suspense fallback="">
        <FlagSelect
          placeholder='Please Select'
          selected={selected}
          onSelect={(flag: string) => applyUserLanguage(flag)}
          customLabels={labels}
        />
      </Suspense>
    </div>
  );
};

export default HeaderLanguageButton;
