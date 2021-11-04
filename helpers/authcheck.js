/**
 * File to validate the login (authentication) in the backend
 * In this file the Token is checked for it's validity
 * As we are using Express the HTTP-Header can be accessed easily (below)
 * As Token the JSON Web token (JWT) is used
 * Reference: https://github.com/auth0/node-jsonwebtoken
 */

// Import AuthentifationError for error handling from Apollo
// Reference: https://www.apollographql.com/docs/apollo-server/data/errors/
const { AuthenticationError } = require('apollo-server');

// Import JSON Web Token
const jwt = require('jsonwebtoken');

/*  
  Import the npm module dotenv (built in Node.js function)
  Dotenv enables to load in environment variables from the .env file
  All values are loaded into the property 'process.env'
  Each defined value is accessable over their respective key (f.e. process.env.MONGODB)
  Supports to keep 'sensitive information' (f.e. like API keys, credentials) separated
  Reference: https://github.com/motdotla/dotenv#readme
*/
require('dotenv').config();

// Context is in this case just an argument to pass down as an parameter
module.exports = (context) => {
  /*
    Get JWT Token from the HTTP Express header field (token string is in the Authorization-Field in the HTTP-Header)
    For context: More detailed information in the index.js
    Reference for Express: https://expressjs.com/en/api.html#req.get
  */
  const authHead = context.req.headers.authorization;

  // Check if JSON token string is present
  if (authHead) {
    /* 
      JWT token is in the format: Bearer <token>
      To get the token string from the authorization header array, get the substring <token>
      To do that: set delimiter/seperator to Bearer to get 'everything' after Bearer
      Reference: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/split
    */
    const token = authHead.split('Bearer ')[1];

    // Check if we have now the Token String to check if token is valid and not expired
    if (token) {
      try {
        // Check for a user if token (Json Web Token string) is valid with jwt.verify()
        const user = jwt.verify(token, process.env.SEC_KEY);
        return user;
        // otherwise throw an error is the token string does not match
      } catch (err) {
        throw new AuthenticationError('Token is invalid');
      }
    }
    // If neither authHead (HTTP header is empty) or token (no token string) is valid throw an error:
    throw new Error('Token or authentication header do not exist');
  }
};
