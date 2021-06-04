import React from 'react';

import { DragAndDropProvider } from './dragAndDropProvider';
import { AuthContextProvider } from './authProvider';
import { SourceRegionProvider } from './sourceRegionProvider';

const providers = [
  AuthContextProvider,
  SourceRegionProvider,
  DragAndDropProvider,
];

const Providers = ({ children }) => (
  providers.reverse().reduce((all, ParentProvider) => (
    <ParentProvider>
      {all}
    </ParentProvider>
  ), children)
);

export default Providers;