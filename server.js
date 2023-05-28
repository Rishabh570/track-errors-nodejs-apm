const app = require('./src/app');
const { logger } = require('./src/lib');
const loaders = require('./src/loaders');

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  logger.info(`🎉🎉🎉 Application running on port: ${PORT} 🎉🎉🎉`);
});

// Perform graceful shutdown; close open connections before closing server
process.on('SIGINT', () => loaders.close(server));
process.on('SIGTERM', () => loaders.close(server));

module.exports = server;
