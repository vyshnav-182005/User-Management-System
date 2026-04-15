const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri);
};

module.exports = connectDB;
