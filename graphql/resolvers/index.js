/**
 * This file combines all resolvers of the different files in this folder
 * Imported in index.js to create the backend server in combination with the schema
 * FYI: Check what kind of operation are used. F.e. if a resolver from a specific file
 * uses both query and mutationoperations, they must be both added as
 * query and as mutation (see for example questionsResolver below)
 * Example: questionsResolvers (question.js) uses both query and mutations resolvers in its file
 */

// Import resolvers
const questionsResolver = require('./questions');
const usersResolver = require('./users');
const responsesResolvers = require('./responses');

module.exports = {
  /* 
    New resolver object to access the lengts of a schema field (without an own operation resolver)
    In this file favoriteCount and responseCount are child resolvers. favoriteCount and responseCount
    in the schema (typeDefs) are the parent objects. Since GraphQL resolvers are nested, the values
    from favorites and responses are accessable after every question resolver is requested
    Reference: https://www.apollographql.com/docs/apollo-server/data/resolvers/#return-values
 */
  Question: {
    favoriteCount: (parent) => parent.favorites.length,
    responseCount: (parent) => parent.responses.length,
  },
  Query: {
    ...questionsResolver.Query,
  },
  Mutation: {
    ...usersResolver.Mutation,
    ...questionsResolver.Mutation,
    ...responsesResolvers.Mutation,
  },
};
