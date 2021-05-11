import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

import { port } from './config';
import typeDefs from '@types';
import resolvers from '@resolvers';

// const express = require('express');
// const { ApolloServer, gql } = require('apollo-server-express');

// const { port } = require('./config');
// const typeDefs = require('./graphql/types');
// const resolvers = require('./graphql/resolvers');

const path = '/graphql';

// Initialize the app
const app = express();

// GraphQL Playground
const playgroundEndpoint = process.env.API_ROOT ? process.env.API_ROOT : `/graphql`;

// Initialize Appolo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: {
    endpoint: playgroundEndpoint
  }
});

server.applyMiddleware({ app, path });

app
.listen(port, () => {
  console.info(`ApolloServer now runs at http://localhost:${port}`);
});

