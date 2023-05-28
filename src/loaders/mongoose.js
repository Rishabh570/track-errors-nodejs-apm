const mongoose = require('mongoose');
const config = require('../../config');
let mongoClient;

module.exports = {
  // connects to mongo and attaches event handlers
  getConnection: (logger = console) => {
    if (mongoClient) return mongoClient;

    mongoose.connection.on('open', function () {
      logger.debug(`mongodb: 'open'`);
    });
    mongoose.connection.on('connected', function () {
      logger.debug('mongodb: "connected"');
    });
    mongoose.connection.on('error', function (err) {
      logger.error(err);
    });
    mongoose.connection.on('reconnected', function () {
      logger.debug(`mongodb: 'reconnected'`);
    });
    mongoose.connection.on('disconnecting', function () {
      logger.debug(`mongodb: 'disconnecting'`);
    });
    mongoose.connection.on('disconnected', function () {
      logger.debug(`mongodb: 'disconnected'`);
    });
    mongoose.connection.on('close', function () {
      logger.debug(`mongodb: 'close'`);
    });

    mongoose
      .connect(config.database.host)
      .then((conn) => {
        logger.debug(`mongo connected ${conn.connections[0].name}`);
      })
      .catch((error) => {
        logger.error(error);
      });

    mongoClient = mongoose.connection;
    return mongoClient;
  },

  // Closes the mongo connection
  closeConnection: () => {
    if (!mongoClient) return Promise.resolve();
    return mongoClient.close();
  },
};
