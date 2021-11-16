import { useEffect, useState } from "react";
import { useLanguages } from "@contexts/languagesContext";
import ReactFlagsSelect from "react-flags-select";

const HeaderLanguageButton = () => {
  const { languages = [], userLanguage = 'US', saveUserLanguage } = useLanguages();
  const [countries, setCountries] = useState<string[]>([]);
  const [labels, setLabels] = useState<{ [key: string]: string }>();
  const [selected] = useState(userLanguage);

  useEffect(() => {
    if (languages.length) {
      setCountries(languages.map(({ code }) => code.toUpperCase()));
      setLabels(
        languages.reduce(
          (all: { [key: string]: string }, { code, name }: Language) => {
            all[code.toUpperCase()] = name || "";
            return all;
          },
          {}
        )
      );
    }
  }, [languages]);

  return (
    <div>
      <ReactFlagsSelect
        selected={selected}
        onSelect={(flag) => saveUserLanguage(flag)}
        countries={countries}
        placeholder="Select a Language"
        showSelectedLabel={false}
        className="menu-flags"
        selectButtonClassName="menu-flags-button"
        fullWidth={false}
        alignOptionsToRight={true}
        customLabels={labels}
      />
      {/* <button onClick={onClick}>
                <CountryFlag countryCode="us" svg />
                <span><AiFillCaretDown /></span>
            </button>
            <ul className="single-bar">
                {dropdown && language.map((item, index) => {
                    return (
                        <HeaderLanguages item={item} key={index} />
                    )
                })}
            </ul> */}
    </div>
  );
};

export default HeaderLanguageButton;
