/**
 * Main file for the backend server
 */

/*
 * -*-*- Load in Modules -*-*-
 * require() is a built in Node.js function to load (import) code
 * Reference: https://nodejs.org/en/knowledge/getting-started/what-is-require/
 */

/*
  Import ApolloServer and makeExecutable schema to create a GraphQL Server
  Reference: https://www.apollographql.com/docs/apollo-server/getting-started/
  Reference: https://www.apollographql.com/docs/apollo-server/api/graphql-tools/
*/
const { ApolloServer, makeExecutableSchema } = require('apollo-server');

/*
  Moongose is a Node.js driver to be able to work with MongoDB databases
  As an Object Document Mapper (ODM) it provides various functions and features
  f.e. to manage the data flow between Node.js and schema definitions
  Reference: https://www.npmjs.com/package/mongoose
*/
const mongoose = require('mongoose');

/*
  Import resolvers (see respective resolver files for details)
  Exported resolvers are combined in index.js (index.js don't need explicitly stated here)
*/
const resolvers = require('./graphql/resolvers');

/*
  Import in the defined schema (see schema file for details)  
*/
const typeDefs = require('./graphql/typeDefs/typeDefs');

/*  
  Import the npm module dotenv (built in Node.js function)
  Dotenv enables to load in environment variables from the .env file
  All values are loaded into the property 'process.env'
  Each defined value is accessable over their respective key (f.e. process.env.MONGODB)
  Supports to keep 'sensitive information' (f.e. like API keys, credentials) separated
  Reference: https://github.com/motdotla/dotenv#readme
*/
require('dotenv').config();

/*
  Combine the separated defined schema and resolvers to create an executable schema
  Doing it this way allows to keep the schema and resolvers modularized
  (makeExecutableSchema()is provided from Apollo Server)
  Reference: https://www.apollographql.com/docs/apollo-server/api/graphql-tools/
*/
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

/*
  Initialize ApolloServer to create a server (after executable schema is defined)
  Context enables to pass additional information in a request as the context object is shared 
  among all resolvers so f.e. it's a practical way to pass data in it that a specific resolver could need
  The served data is shared (and accessable) among each resolver with each request
  In this case a Callback with the req argument is passed and forwarded
  The request body (from Express)can now be used by a resolver and the HTTP header provided from Express
  (Expresss authorization header) can be used in the resolvers (f.e. to check if a user is authenticated)
  Reference: https://www.apollographql.com/docs/apollo-server/api/apollo-server/#apolloserver
  and https://www.apollographql.com/docs/apollo-server/security/authentication/
*/
const server = new ApolloServer({
  schema,
  context: ({ req }) => ({ req }),
});

/*
  Moongose to connect to the MongoDB Database (in this case remote to remote MongoDB database in the Cloud)
  As service provider MongoDB Atlas is chosen for a cloud-based Database (etablished by the same developers as MongoDB)
  The URL string is passed from the .env file (dotenv) as an environmental variable
  The server can be started from the console (same directoy) with the commend 'node index'
  The aboved created GraphQL server can then be accessed and is served over http://localhost:5000 
  (if the port 5000 is not already used for a different service) with a direct connection to MongoDB 
*/
mongoose
  .connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB.');
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server ready at ${res.url}`);
  })
  .catch((err) => {
    console.error(err);
  });
