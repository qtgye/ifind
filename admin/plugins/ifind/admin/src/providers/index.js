import React, { useEffect, memo } from 'react';

import { DragAndDropProvider } from './dragAndDropProvider';
import { AuthContextProvider } from './authProvider';
import { CategoriesListingProvider } from './categoriesListingProvider';
import { SourceRegionProvider } from './sourceRegionProvider';
import { GlobalContextProvider } from './globalProvider';
import { AdminUserProvider } from './adminUserProvider';

const Providers = ({ children }) => {
  return (
    <GlobalContextProvider>
      <AuthContextProvider>
        <AdminUserProvider>
          <SourceRegionProvider>
            <CategoriesListingProvider>
              <DragAndDropProvider>
                {children}
              </DragAndDropProvider>
            </CategoriesListingProvider>
          </SourceRegionProvider>
        </AdminUserProvider>
      </AuthContextProvider>
    </GlobalContextProvider>
  )
};

export default memo(Providers);