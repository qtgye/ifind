import { useEffect, useState, useCallback } from "react";
import FlagSelect from "components/FlagsSelect";
import { useRouter } from "next/router";

import countriesConfig from "config/countries";
import { useGlobalData } from "providers/globalDataContext";

const HeaderLanguageButton = () => {
  const { asPath: pathname } = useRouter();
  const { languages, userLanguage = "en" } = useGlobalData();
  const [countries, setCountries] = useState<string[]>([]);
  const [labels, setLabels] = useState<{ [key: string]: string }>();
  const [selected, setSelected] = useState<string>("");

  const replaceLanguage = useCallback(
    (languageCode: string) => {
      const urlSegments = pathname.replace(/\/$/, "").split("/");

      // Replace language code
      urlSegments[1] = languageCode;

      // Redirect
      window.location.href = urlSegments.join("/");
    },
    [pathname]
  );

  const applyUserLanguage = useCallback(
    (countryCode: string) => {
      const matchedCountryConfig: CountryConfig | undefined =
        countriesConfig.find(
          ({ code }: CountryConfig) => code.toLocaleLowerCase() === countryCode
        );

      if (!matchedCountryConfig) {
        return;
      }

      const countryNameSlug = matchedCountryConfig.name;
      const matchedLanguage = languages?.find(
        ({ country_flag }) => countryNameSlug === country_flag
      );

      if (matchedLanguage && replaceLanguage) {
        replaceLanguage(matchedLanguage.code);
      }
    },
    [languages, replaceLanguage]
  );

  useEffect(() => {
    if (languages?.length) {
      setCountries(
        languages.map(
          ({ country_flag }) => country_flag?.toLocaleLowerCase() || ""
        )
      );
      setLabels(
        languages.reduce(
          (
            all: { [key: string]: string },
            { country_flag, name }: IFINDLanguages.Language
          ) => {
            // Get matching country code for language
            const matchedCountry = countriesConfig.find(
              ({ name }) => name === country_flag
            );
            all[matchedCountry?.code?.toLocaleLowerCase() || ""] = name || "";
            return all;
          },
          {}
        )
      );
    }
  }, [languages]);

  useEffect(() => {
    if (countries?.length && userLanguage) {
      const matchedLanguage = languages?.find(
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
      <FlagSelect
        placeholder="Please Select"
        selected={selected}
        onSelect={(flag: string) => applyUserLanguage(flag)}
        customLabels={labels}
      />
    </div>
  );
};

export default HeaderLanguageButton;
