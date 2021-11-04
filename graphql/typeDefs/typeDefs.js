/**
 * GraphQL-Schema file to define the types of data useable in GraphQL operations
 * This schema defines how the data is structured and can be used
 * The GraphQL backend server is implemented over Apollo
 * Imported in index.js to create the backend server in combination with the resolvers
 * Reference: https://www.apollographql.com/docs/apollo-server/api/apollo-server/
 * To get an idea about the SDL-Syntax: https://www.apollographql.com/docs/apollo-server/schema/schema/
 * Resolvers add the functionalities (in folder 'resolvers')
 */

// Import the gql tag from apollo-server to be able to use the GraphQL schema definitions (SDL)
// Reference: https://www.apollographql.com/docs/apollo-server/api/apollo-server/#gql
const { gql } = require('apollo-server');

module.exports = gql`
  #
  # -  Schema definition starts here -
  # Short info:
  # id is an unique identifier (basically the 'primary key'). MongoDB already takes care of creating that after an insert.
  # In here it only gets defined to be able to use that id in the MongoDB.
  # []: List/Array
  # !: Field is not nullable (and thus a value can not be null)
  # (): Argument / Parameter (and thus mandatory)
  #
  # A Question that can be created from a user
  type Question {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    responses: [Response]!
    responseCount: Int!
    favorites: [Favorite]!
    favoriteCount: Int!
  }
  # A user that can be used
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  # A response that can be used
  type Response {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  # A favorire that can be used
  type Favorite {
    id: ID!
    createdAt: String!
    username: String!
  }
  # RegisterInput Type to be able to pass credentials (in queries or mutations)
  # Reference: https://www.apollographql.com/docs/apollo-server/schema/schema/#input-types
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  # Queries to GET data
  type Query {
    # Get all questions with a list (array) of Question
    getQuestions: [Question]
    # Get a specific question over the ID (ID argument mandatory)
    getQuestion(questionId: ID!): Question
  }
  # Mutations to ALTER data (create, delete, ...)
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createQuestion(body: String!): Question!
    deleteQuestion(questionId: ID!): String!
    createResponse(questionId: String!, body: String!): Question!
    deleteResponse(questionId: ID!, responseId: ID!): Question!
    favoriteQuestion(questionId: ID!): Question!
  }
`;
