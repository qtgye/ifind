declare interface LanguagesContextValue {
  languages?: Language[];
  userLanguage?: string;
  saveUserLanguage: (countryCode: string) => any;
}
