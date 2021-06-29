import React, { useEffect, memo } from 'react';

import { DragAndDropProvider } from './dragAndDropProvider';
import { AuthContextProvider } from './authProvider';
import { CategoryProvider } from './categoryProvider';
import { SourceRegionProvider } from './sourceRegionProvider';
import { GlobalContextProvider } from './globalProvider';

const Providers = ({ children }) => {
  return (
    <GlobalContextProvider>
      <AuthContextProvider>
        <SourceRegionProvider>
          <CategoryProvider>
            <DragAndDropProvider>
              {children}
            </DragAndDropProvider>
          </CategoryProvider>
        </SourceRegionProvider>
      </AuthContextProvider>
    </GlobalContextProvider>
  )
};

export default memo(Providers);