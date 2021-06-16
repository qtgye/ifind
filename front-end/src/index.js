import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { API_ROOT } from '@config/api';
import { ADMIN_API_ROOT, apiSourceHandle, userTokenHandle } from '@config/adminApi';

import { ApolloClient, HttpLink, InMemoryCache, concat } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloLink } from "apollo-link";

import { spriteContents } from 'ifind-icons';

// TODO: Drop this once API Layer is no longer needed
// API Link
const apiLink = new HttpLink({
  uri: API_ROOT,
  headers: {},
});

// Admin Link
const adminApiLink = new HttpLink({
  uri: ADMIN_API_ROOT,
  headers: {},
});

// Auth middleware, handles authentication to admin endpoints
const adminAuthMiddleware = new ApolloLink((operation, forward) => {
  const currentContext = operation.getContext();
  const token = localStorage.getItem(userTokenHandle) || null;

  if ( token ) {
    operation.setContext({
      ...currentContext,
      headers: {
        authorization: `Bearer ${token}`,
      }
    });
  }
  return forward(operation);
})

const client = new ApolloClient({
  // link: adminApiLink,
  link: concat(
    // adminApiLink,
    adminAuthMiddleware,
    ApolloLink.split(
      operation => operation.getContext().apiSource === apiSourceHandle, adminApiLink, apiLink
    )
  ),
  cache: new InMemoryCache().restore({})
});


ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <div hidden dangerouslySetInnerHTML={{ __html: spriteContents }}></div>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
