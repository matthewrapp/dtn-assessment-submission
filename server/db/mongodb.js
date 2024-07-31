// CONNECT USING MONGOOSE
const mongoose = require('mongoose');
const logger = require('../logger');
require('dotenv').config();

const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/dtndb';

const connecToMongo = async () => {
  try {
    await mongoose.connect(url, {});
    logger.mongoDbStarted();
  } catch (err) {
    logger.error('Failed to connect to MongoDB', err);
    throw err;
  }
};

module.exports = connecToMongo;

// CONNECT USING MONGO CLIENT
// Code to demonstrate connecting to your local mongo db without using Mongoose

// const { MongoClient } = require('mongodb');
// const logger = require('../logger');
// require('dotenv').config();

// const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/dtndb';

// let dbInstance = null;

// const connectToDb = async () => {
//   if (dbInstance) return dbInstance;
//   try {
//     const client = new MongoClient(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     await client.connect();
//     dbInstance = client.db();
//     logger.mongoDbStarted();
//     return dbInstance;
//   } catch (err) {
//     logger.error('Failed to connect to MongoDB', err);
//     throw err;
//   }
// };

// module.exports = connectToDb;
