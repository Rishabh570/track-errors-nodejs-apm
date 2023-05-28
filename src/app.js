const express = require('express');
const { expressErrorHandler } = require('@appsignal/nodejs');

const { logger } = require('./lib');
const loaders = require('./loaders');
const { itemRoutes } = require('./routes');

const app = express();

loaders
  .run()
  .then(({ mongoClient }) => {
    app.use(express.urlencoded({ limit: '5mb', extended: true }));
    app.use(express.json({ limit: '5mb' }));

    // Health check route
    app.get('/', (req, res) => {
      res.json({ status: true });
    });

    // Main app route(s)
    app.use('/item', itemRoutes);

    // AppSignal error handler should come after all app routes
    // but before all other error handlers
    app.use(expressErrorHandler());

    // Error handlers
    process.on('uncaughtException', (err) => {
      logger.fatal(`uncaughtException error: ${err}`);
      process.exit(1);
    });

    process.on('unhandledRejection', (err) => {
      logger.fatal(`uncaughtRejection error: ${err}`);
      process.exit(1);
    });
  })
  .catch((err) => {
    logger.error(`Could not initialize server: ${err}`);
    process.exit(1);
  });

module.exports = app;
