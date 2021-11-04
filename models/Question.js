/**
 * This file contains the schema to model the question document on the MongoDB server via Mongoose
 * A document contains fields and values (that will be added to a collection) as a dataset
 * Mongoose helps to define that document in code and map it to MongoDB
 * Reference: https://mongoosejs.com/docs/guide.html
 *
 * Analogies (in comparison to relational databases terms):
 * - Fields: columns
 * A field (in MongoDB) is called property in Mongoose
 * - Document: Rows/Data sets
 * - Collection: Table
 */

// Import Model and schema from mongoose
const { model, Schema } = require('mongoose');

const questionSchema = new Schema({
  // Define question document (properties with string schema types)
  username: String,
  body: String,
  createdAt: String,

  // Responses array schema type (with nested properties + string schema types)
  responses: [
    {
      username: String,
      body: String,
      createdAt: String,
    },
  ],
  // Favorites array schema type   (with nested properties + string schema types)
  favorites: [
    {
      username: String,
      createdAt: String,
    },
  ],
  /* 
    User field/property (with reference to a users objectId)
    ObjectId contains ObjectIds (unique identifier strings for each created dataset)
    An objectId is by default automatically generated (as the property/field _id in MongoDB)
    Thus, the questions collection (in the MongoDB database) will implement a referenced
    field with the name 'user' which references to an ObjectId from the (existing) user collection
    Reference: https://docs.mongodb.com/manual/reference/bson-types/#objectid
  */
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

// Export model (to create an instance of the document with the collection name 'Question')
module.exports = model('Question', questionSchema);
