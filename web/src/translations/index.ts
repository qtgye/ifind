import { useGlobalData } from "providers/globalDataContext";

// Translations
export * as navigation from "./navigation";

const applyTranslationVariables = (
  translatedText: string = "",
  variables: { [key: string]: any } = {}
) => {
  return Object.entries(variables).reduce(
    (updatedText, [variableName, variableValue]) => {
      const variableNamePattern = new RegExp(`{${variableName}}`, "g");
      return updatedText.replace(variableNamePattern, variableValue);
    },
    translatedText
  );
};

export const useTranslation = () => {
  const { userLanguage } = useGlobalData();

  return (
    translationMap: TranslationMap = {},
    variables: { [key: string]: any } = {}
  ) => {
    // Return matched translation
    if (userLanguage && userLanguage in translationMap) {
      return applyTranslationVariables(translationMap[userLanguage], variables);
    }
    // Return en as default instead, or any other available language
    else {
      const [ firstAvailableTranslation ] = Object.keys(translationMap);
      return applyTranslationVariables(translationMap.en || translationMap[firstAvailableTranslation] || '', variables);
    }
  };
};
