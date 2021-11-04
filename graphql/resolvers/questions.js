/**
 * Resolvers file for 'questions'
 * A resolver is a query handler function for a type/field in the defined GraphQL schema (typeDefs.js)
 * Using resolvers, we can actually work with the data fields declared
 * For operations: Queries (fetching data) and Mutations (altering data)
 * Operations (Queries, Mutations, ...):
 * (1): https://www.apollographql.com/docs/react/data/queries/
 * (2): https://www.apollographql.com/docs/react/data/mutations/
 *
 * A resolver accepts four arguments: fieldName: (parent, args, context, info)
 * Reference: https://www.apollographql.com/docs/tutorial/resolvers/
 */

// Import Mongoose Question schema model
const Question = require('../../models/Question');

// Import authentication helper functions
const authcheck = require('../../helpers/authcheck');

module.exports = {
  Query: {
    async getQuestions() {
      try {
        /* 
          Find Question and sort questions by date (newest first) in the database
          Reference: https://mongoosejs.com/docs/api.html#model_Model.find
          Reference: https://mongoosejs.com/docs/api.html#query_Query-sort
        */
        const questions = await Question.find().sort({ createdAt: -1 });
        return questions;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getQuestion(_, { questionId }) {
      try {
        /*
          Find question by their document id (_id) in the database
          Mongoose creates for every new data entry (document) a unique _id automatically in the database
          Reference: https://mongoosejs.com/docs/api.html#model_Model.findById
        */
        const question = await Question.findById(questionId);
        // If question is found
        if (question) {
          return question;
        } else {
          throw new Error('Question does not exist');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    /* 
      Resolver for creating a question
      (_ is place holder for parent argument, args are data objects from the GraphQL schema)
      The HTTP-header auth information from Express is delivered with each resolver request (see context in index.js)
      A user can only create a question when there's valid token in the HTTP-Header
    */
    async createQuestion(_, { body }, context) {
      // Check if user has a token
      const user = authcheck(context);

      // Check if body (content of question) is empty
      if (body.trim() === '') {
        throw new Error('Question body is not allowed to be empty');
      }

      // Create new question (Mongoose model)
      const newQuestion = new Question({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      // Save new question in database (model)
      // Reference: https://mongoosejs.com/docs/models.html
      const question = await newQuestion.save();

      return question;
    },

    async deleteQuestion(_, { questionId }, context) {
      // Check if user has a token
      const user = authcheck(context);

      try {
        /* 
          Find question by their document id (_id) in the database
          Mongoose creates for every new data entry (document) a unique _id automatically in the database
          Reference: https://mongoosejs.com/docs/api.html#model_Model.findById
        */
        const question = await Question.findById(questionId);

        // Check if user is really publisher of question (in case someone else wanna delete it)
        if (user.username === question.username) {
          await question.delete();
          return 'Question has been deleted';
        } else {
          // If user is not publisher of question
          throw new AuthenticationError('Whatever you tried did not work');
        }
      } catch (err) {
        // Throw error if try catch did fail
        throw new Error(err);
      }
    },

    // Function to favorite and unfavorite a question
    async favoriteQuestion(_, { questionId }, context) {
      // Check if user has a token
      const { username } = authcheck(context);
      /* 
        Find question by their document id (_id) in the database
        Mongoose creates for every new data entry (document) a unique _id automatically in the database
        Reference: https://mongoosejs.com/docs/api.html#model_Model.findById
      */
      const question = await Question.findById(questionId);

      // If question found
      if (question) {
        // Check if favorite exists from a user in the database
        if (question.favorites.find((favorite) => favorite.username === username)) {
          /*
            Question already favorited, then unfavorite it
            Filter creates a new array with defined conditions
            In this case: create a new question favorites JSON array WITHOUT the user who favorited it
            deleting the user from the array and thus from the database)
            Reference: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
          */
          question.favorites = question.favorites.filter(
            (favorite) => favorite.username !== username
          );
        } else {
          /*
            If user can not be found (did not favorite the question yet), then let user favorite it
            with adding user to the question.favorites JSON array
            Reference: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/push
          */
          question.favorites.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        // Save in MongoDB database
        // Reference: https://docs.mongodb.com/manual/reference/method/db.collection.save/
        await question.save();
        return question;
      } else throw new UserInputError('Question not found');
    },
  },
};
