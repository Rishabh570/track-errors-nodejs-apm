const mongoose = require('./mongoose');
const { logger } = require('../lib');

module.exports = {
  run: () => {
    return new Promise((resolve, reject) => {
      const mongoClient = mongoose.getConnection();
      // other dependencies init goes here...

      resolve({ mongoClient });
    });
  },
  // runs before app crash/shutdown
  close: async (server) => {
    if (!server) {
      logger.warn("Cannot stop server, it's not running");
      process.exit(0);
    }

    // Fetching DB conn from loader as it is idempotent
    const { mongoClient } = await module.exports.run();

    server.close(async (err) => {
      // closing connection(s)
      await mongoClient.close();

      if (err) process.exit(1);
      process.exit(0);
    });
  },
};
