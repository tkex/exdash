/**
 * This file contains the schema to model the User document on the MongoDB server via Mongoose
 * A document contains fields and values (that will be added to a collection as a data set
 * Mongoose helps to define that document in code and map it to MongoDB
 * Reference: https://mongoosejs.com/docs/guide.html
 *
 * Analogies (in comparison to relational databases terms):
 * - Fields: columns
 * - Document: Rows/Data sets
 * - Collection: Table
 */

// Import Model and schema from mongoose
const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  // Define user document properties with string schema types
  username: String,
  password: String,
  email: String,
  createdAt: String,
});

// Export model (to create an instance of the document with the collection name 'User')
module.exports = model('User', userSchema);
