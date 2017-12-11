const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = {
  createEventListeners,
  connect,
  disconnect
};

function createEventListeners(logger) {
  const log = logger || console;
  mongoose.connection.on('connected', () => {
    log.info('Successfully connected to database.');
  });

  mongoose.connection.on('disconnected', () => {
    log.info('Database connection closed.');
  });

  mongoose.connection.on('error', (err) => {
    log.info(`There was an issue connecting to the database: ${err}`);
  });
}

function connect() {
  mongoose.connect(process.env.MONGO_URI, { useMongoClient: true });
}

function disconnect() {
  mongoose.disconnect();
}
