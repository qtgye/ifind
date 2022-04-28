declare interface GetPageVariables {
  language?: string;
  slug?: string;
}

declare interface PagePayload {
  pageBySlug: PageData;
}

declare interface PagesPayload {
  pages: Page[];
}

declare interface PageContextData {
  loading?: boolean;
  data?: {
    data?: ComponentEntryFieldsPageFields;
  };
}

declare interface PageContextProviderProps {
  children: React.ReactNode;
}
