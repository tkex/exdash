/**
 * Resolvers file for 'responses'
 * A resolver is a query handler function for a type/field in the defined GraphQL schema (typeDefs.js)
 * Using resolvers, we can actually work with the data fields declared
 * For operations: Queries (fetching data) and Mutations (alterin data)
 * Operations (Queries, Mutations, ...):
 * (1): https://www.apollographql.com/docs/react/data/queries/
 * (2): https://www.apollographql.com/docs/react/data/mutations/
 *
 * A resolver accepts four arguments: fieldName: (parent, args, context, info)
 * Reference: https://www.apollographql.com/docs/tutorial/resolvers/
 */

// Import AuthenticationError and UserInputError from apollo-server
const { AuthenticationError, UserInputError } = require('apollo-server');

// Import authentication helper functions
const authcheck = require('../../helpers/authcheck');

// Import Mongoose Question schema model
const Question = require('../../models/Question');

module.exports = {
  Mutation: {
    /* 
      Resolver for creating a response to a question
      (_ is place holder for parent argument, args are data objects from the GraphQL schema)
      The HTTP-header auth information from Express is delivered with each resolver request (see context in index.js)
      A user can only respond when there's valid token in the HTTP-Header
    */
    createResponse: async (_, { questionId, body }, context) => {
      // Check if user has a token
      const { username } = authcheck(context);

      // Check if body field (content) is empty
      if (body.trim() === '') {
        throw new UserInputError('Empty response', {
          errors: {
            body: 'Response body must not empty',
          },
        });
      }

      /* 
        Find question by their document id (_id)
        Mongoose creates for every new data entry (document) a unique _id automatically in the database
        Reference: https://mongoosejs.com/docs/api.html#model_Model.findById
      */
      const question = await Question.findById(questionId);

      // If question found
      if (question) {
        /*
          Add response content to question (add elements to JSON Array)
          Since we use Mongoose: question.responses contains all the responses elements from the database
          unshift adds all these elements into this array on top/at the start of the array so the response
        */
        question.responses.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });

        // Save question with response in MongoDB database
        // Reference: https://docs.mongodb.com/manual/reference/method/db.collection.save/
        await question.save();
        return question;
      } else throw new UserInputError('Question not found');
    },

    // Resolver to delete a response for a existing question
    async deleteResponse(_, { questionId, responseId }, context) {
      // Check if user has a token
      const { username } = authcheck(context);

      /* 
        Find question by their document id (_id)
        Mongoose creates for every new data entry (document) a unique _id automatically in the database
        findById()is a Mongoose Query: https://mongoosejs.com/docs/queries.html
      */
      const question = await Question.findById(questionId);

      // If question found
      if (question) {
        /* 
        Find response index in the database 
        findIndex() returns the index of the first (matched) element
        Reference: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
        To note: question.responses is a JSON object (and 'responses' a nested object in the collection 'question') 
        and thus the values easily accessable via Mongoose functions
        The response index in the MongoDB collection 'question' is compared to the passed function parameter 'responseId'
        If the passed id over the function matches to an id in the question.responses array 
        (in the database) that index is assigned into the variable responseIndex
      */
        const responseIndex = question.responses.findIndex((c) => c.id === responseId);

        // Check if response really belongs to user (in case someone else wants to delete it)
        if (question.responses[responseIndex].username === username) {
          // Remove found response with splice (element in the JSON Array with accoridng responseIndex)
          // Reference: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
          question.responses.splice(responseIndex, 1);

          // Save modified question (model)
          // Reference: https://mongoosejs.com/docs/models.html
          await question.save();
          return question;
        } else {
          throw new AuthenticationError('Whatever you tried is not allowed');
        }
      } else {
        throw new UserInputError('Question not found');
      }
    },
  },
};
