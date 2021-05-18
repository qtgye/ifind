import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { API_ROOT } from '@config/api';
import { ADMIN_API_ROOT } from '@config/adminApi';

import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloLink } from "apollo-link";

console.log({ API_ROOT, ADMIN_API_ROOT });

// API Link
const apiLink = new HttpLink({
  uri: API_ROOT,
  headers: {},
});

console.log({ API_ROOT });

const adminApiLink = new HttpLink({
  uri: ADMIN_API_ROOT,
  headers: {},
});

const client = new ApolloClient({
  link: ApolloLink.split(
    operation => operation.getContext().apiSource === "admin", adminApiLink, apiLink
  ),
  cache: new InMemoryCache().restore({})
});


ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
