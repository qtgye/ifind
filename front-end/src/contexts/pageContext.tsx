import { useParams } from 'react-router-dom';
import React, { createContext, useContext } from 'react';
import { useQuery } from "@apollo/react-hooks";
import { ApolloError } from "@apollo/client";

import pageBySlugQuery from '@gql/pageBySlugQuery';
import { locale as language } from '@config/locale';

interface PageContextData {
  loading?: boolean;
  error?: ApolloError
  data?: {
    data?: ComponentEntryFieldsPageFields
  }
}

export const PageContext = createContext<PageContextData>({});

export const PageContextProvider = ({ children }: React.PropsWithChildren<React.ReactNode>) => {
    const { slug } = useParams<{ slug: string }>();
    const {
        loading,
        error,
        data
    } = useQuery(pageBySlugQuery, {
        variables: { slug, language },
    });

    return (
        <PageContext.Provider value={{loading, error, data: data?.pageBySlug}}>
            {children}
        </PageContext.Provider>
    )
}

// Supply a name in order to check for it outside
PageContextProvider.providerName = 'PageContextProvider';

export const usePageData = () => {
    const context = useContext(PageContext);
    return context;
}

// Export as default to be used in testing
export default PageContext;
