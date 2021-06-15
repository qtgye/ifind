import React, { useEffect, memo } from 'react';

import { DragAndDropProvider } from './dragAndDropProvider';
import { AuthContextProvider } from './authProvider';
import { CategoryProvider } from './categoryProvider';
import { SourceRegionProvider } from './sourceRegionProvider';

const Providers = ({ children }) => {
  return (
    <AuthContextProvider>
      <SourceRegionProvider>
        <CategoryProvider>
          <DragAndDropProvider>
            {children}
          </DragAndDropProvider>
        </CategoryProvider>
      </SourceRegionProvider>
    </AuthContextProvider>
  )
};

export default memo(Providers);