/**
 * Resolvers file for 'users'
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

// Import backend validation functions
const { RegisterValidation, LoginValidation } = require('../../helpers/validators');

// Import UserInputError from apollo-server
const { UserInputError } = require('apollo-server');

// Import Mongoose User schema model
const User = require('../../models/User');

/*
  Import the npm module dotenv (built in Node.js function)
  Dotenv enables to load in environment variables from the .env file
  All values are loaded into the property 'process.env'
  Each defined value is accessable over their respective key (f.e. process.env.MONGODB)
  Supports to keep 'sensitive information' (f.e. like API keys, credentials) separated
  Reference: https://github.com/motdotla/dotenv#readme
*/
require('dotenv').config();

// Import bcrypt for password hashing
// Reference: https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcryptjs');

// Import json web token for authentication
const jwt = require('jsonwebtoken');

/*
  Function to generate/sign user token
  Default algorithm for signing is HMAC using SHA256 (HS256) if not explicit defined
  First parameter is the payload, second the key (in this case environmental variable from .env)
  Reference: https://www.npmjs.com/package/jsonwebtoken
  Reference: https://github.com/auth0/node-jsonwebtoken
*/
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.SEC_KEY,
    { expiresIn: '6h' }
  );
}

module.exports = {
  Mutation: {
    // Resolver to create a user
    // (_ is place holder for parent argument, args deconstructed in ES6 norm)
    async register(_, { registerInput: { username, email, password, confirmPassword } }) {
      // Validate user data
      const { valid, errors } = RegisterValidation(username, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // Check if user already exist
      // Reference: https://mongoosejs.com/docs/api.html#model_Model.findOne
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is already taken',
          },
        });
      }
      // Hash password with bcrypt (10 rounds)
      password = await bcrypt.hash(password, 10);

      // Create User (Mongoose model)
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      /*
        Save new created user in database (model)
        and generate signed token for new user
        Reference: https://mongoosejs.com/docs/models.html
      */
      const res = await newUser.save();
      const token = generateToken(res);

      /*
        Return results
        Info: '...' is ES6 spread syntax. Used here in case more args are returned after we register the user (usually the case)
        See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      */
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },

    // Resolver to log in a user
    async login(_, { username, password }) {
      // Get login validation objects (ES6 deconstructed)
      const { errors, valid } = LoginValidation(username, password);

      // Check for valid input (invalid when more than 1 error happened)
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // Find user
      // Reference: https://mongoosejs.com/docs/api.html#model_Model.findOne
      const user = await User.findOne({ username });

      // User not found?
      if (!user) {
        errors.general = 'Username is not found';
        throw new UserInputError('Invalid username', { errors });
      }

      // Check if password matches with the password in the MongoDB database
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Credentials are wrong';
        throw new UserInputError('Please check your username or password', { errors });
      }

      // Generate signed token for user if everything worked
      const token = generateToken(user);

      /*
        Return results
        Info: '...' is ES6 spread syntax. Used here in case more args are returned after we register the user (usually the case)
        See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      */
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};
