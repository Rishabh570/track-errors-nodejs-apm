module.exports = {
  database: {
    host: process.env.MONGODB_URL || 'mongodb://localhost:27017/track-errors-nodejs-apm',
  },
  logger: {
    name: 'MyAppLogger',
  },
};
