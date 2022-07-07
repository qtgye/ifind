/**
 * TODO: Abstract out custom Schema definitions for better structure
 */
const scheduledTasksTypes = require("../.types/scheduled-tasks");
const dealTypesTypes = require("../.types/deal-types");
const offersCategoriesTypes = require("../.types/offers-categories");
const prerendererTypes = require("../.types/prerenderer");
const envTypes = require("../.types/env");

const scheduledTasksResolver = require("../.resolvers/scheduled-tasks");
const dealTypesResolver = require("../.resolvers/deal-types");
const offersCategoriesResolver = require("../.resolvers/offers-categories");
const prerendererResolver = require("../.resolvers/prerenderer");
const envResolver = require("../.resolvers/env");

const withQueries = [
  scheduledTasksResolver,
  dealTypesResolver,
  offersCategoriesResolver,
  prerendererResolver,
  envResolver,
];

const withMutations = [
  scheduledTasksResolver,
  dealTypesResolver,
  prerendererResolver,
];

module.exports = {
  definition: [
    dealTypesTypes,
    scheduledTasksTypes,
    offersCategoriesTypes,
    prerendererTypes,
    envTypes,
  ].join("\n"),
  query: withQueries.map(({ query }) => query).join("\n"),
  mutation: withMutations.map(({ mutation }) => mutation).join("\n"),
  type: {},
  resolver: {
    Query: withQueries.reduce(
      (allResolvers, { resolveQuery }) => ({
        ...allResolvers,
        ...resolveQuery,
      }),
      {}
    ),
    Mutation: withMutations.reduce(
      (allResolvers, { resolveMutation }) => ({
        ...allResolvers,
        ...resolveMutation,
      }),
      {}
    ),
  },
};
