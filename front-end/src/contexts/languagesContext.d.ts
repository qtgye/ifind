declare interface LanguageWithFlag extends Language {
  flag?: string;
}

declare interface LanguagesContextValue {
  languages?: LanguageWithFlag[];
  userLanguage?: string;
  saveUserLanguage?: (countryCode: string) => any;
}
