import React, { useEffect, memo } from 'react';

import { DragAndDropProvider } from './dragAndDropProvider';
import { AuthContextProvider } from './authProvider';
import { CategoriesListingProvider } from './categoriesListingProvider';
import { SourceRegionProvider } from './sourceRegionProvider';
import { GlobalContextProvider } from './globalProvider';
import { AdminUserProvider } from './adminUserProvider';
import { LanguageProvider } from './languageProvider';

const Providers = ({ children }) => {
  return (
    <GlobalContextProvider>
      <AuthContextProvider>
        <AdminUserProvider>
          <LanguageProvider>
            <SourceRegionProvider>
              <CategoriesListingProvider>
                <DragAndDropProvider>
                  {children}
                </DragAndDropProvider>
              </CategoriesListingProvider>
            </SourceRegionProvider>
          </LanguageProvider>
        </AdminUserProvider>
      </AuthContextProvider>
    </GlobalContextProvider>
  )
};

export default memo(Providers);