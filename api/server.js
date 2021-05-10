const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = require('./graphql/types');
const resolvers = require('./graphql/resolvers');

const PORT = 8000;
const path = '/graphql';

// Initialize the app
const app = express();

// Initialize Appolo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.applyMiddleware({ app, path });

app
.listen(PORT, () => {
  console.info(`ApolloServer now runs at http://localhost${PORT}`);
});

