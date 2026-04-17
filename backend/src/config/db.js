const mongoose = require('mongoose');
const env = require('./env');

let cachedConnectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnectionPromise) {
    return cachedConnectionPromise;
  }

  mongoose.set('strictQuery', true);
  cachedConnectionPromise = mongoose.connect(env.mongoUri).catch((error) => {
    cachedConnectionPromise = null;
    throw error;
  });

  return cachedConnectionPromise;
};

module.exports = connectDB;
