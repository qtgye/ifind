declare type DealTypeLanguages = "en" | "de" | "ru";

declare interface DealTypeConfig {
  site: string;
  nav_label: {
    [DealTypeLanguages]: string;
  };
  label: {
    language: DealTypeLanguages;
    label: string;
  }[];
}

declare interface DealTypesConfig {
  [dealID: string]: DealTypeConfig;
}
