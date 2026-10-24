const mongoose = require('mongoose');

const ATLAS_DEFAULT_URI = 'mongodb+srv://faiqghumman4_db_user:gpQhCBHJ6KZjlGuo@cluster0.n28jzto.mongodb.net/nfc_bank?retryWrites=true&w=majority';
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || ATLAS_DEFAULT_URI;

mongoose.set('strictQuery', false);

const connectWithRetry = () => {
  return mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 15,
    minPoolSize: 2,
    retryWrites: true,
  })
  .then(() => {
    console.log('✓ Successfully connected to MongoDB Atlas (nfc_bank)');
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err.message);
    console.log('Retrying MongoDB connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠ MongoDB connection lost. Reconnecting...');
  setTimeout(connectWithRetry, 3000);
});

mongoose.connection.on('error', (err) => {
  console.error('⚠ MongoDB connection error event:', err.message);
});

const Connection = connectWithRetry();

module.exports = Connection;