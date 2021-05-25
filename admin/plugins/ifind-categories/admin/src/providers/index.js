import React from 'react';
import { ContextProvider } from 'react-sortly';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { AuthContextProvider } from './authProvider';

const providers = [
  ({ children }) => (
    <DndProvider backend={HTML5Backend}>
      {children}
    </DndProvider>
  ),
  ContextProvider,
  AuthContextProvider,
];

const Providers = ({ children }) => (
  providers.reverse().reduce((all, ParentProvider) => (
    <ParentProvider>
      {all}
    </ParentProvider>
  ), children)
);

export default Providers;