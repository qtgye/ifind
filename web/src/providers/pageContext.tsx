import { useParams } from "react-router-dom";
import React, { createContext, useContext } from "react";
import { locale as language } from "config/locale";
import gqlFetch from "utilities/gqlFetch";

interface PageContextData {
  loading?: boolean;
  data?: {
    data?: ComponentEntryFieldsPageFields;
  };
}

export const pageBySlugQuery = `
query PageBySlugQuery ($slug: String!, $language: String) {
  pageBySlug (slug:$slug, language:$language) {
      slug
      data {
          title
          body
      }
  }
}`;

export const PageContext = createContext<PageContextData>({});

export const PageContextProvider = ({
  children,
}: React.PropsWithChildren<React.ReactNode>) => {
  return <PageContext.Provider value={{}}>{children}</PageContext.Provider>;
};

// Supply a name in order to check for it outside
PageContextProvider.providerName = "PageContextProvider";

export const usePageData = () => {
  const context = useContext(PageContext);
  return context;
};

export const getPage = ({ language, slug }: GetPageVariables) =>
  gqlFetch<PagePayload>(pageBySlugQuery, {
    language,
    slug,
  });

// Export as default to be used in testing
export default PageContext;
