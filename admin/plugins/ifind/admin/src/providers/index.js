import React, { useEffect, memo } from 'react';

import { DragAndDropProvider } from './dragAndDropProvider';
import { AuthContextProvider } from './authProvider';
import { CategoriesListingProvider } from './categoriesListingProvider';
import { SourceRegionProvider } from './sourceRegionProvider';
import { GlobalContextProvider } from './globalProvider';

const Providers = ({ children }) => {
  return (
    <GlobalContextProvider>
      <AuthContextProvider>
        <SourceRegionProvider>
          <CategoriesListingProvider>
            <DragAndDropProvider>
              {children}
            </DragAndDropProvider>
          </CategoriesListingProvider>
        </SourceRegionProvider>
      </AuthContextProvider>
    </GlobalContextProvider>
  )
};

export default memo(Providers);