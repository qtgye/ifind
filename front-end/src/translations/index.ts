import { useLanguages } from "@contexts/languagesContext";

// Translations
export * as navigation from './navigation';

export const useTranslation = () => {
  const { userLanguage } = useLanguages();

  return (translationMap: TranslationMap) => {
    // Return matched translation
    if (userLanguage && userLanguage in translationMap) {
      return translationMap[userLanguage];
    }
    // Return en as default instead
    else {
      return translationMap.en || "";
    }
  };
};
