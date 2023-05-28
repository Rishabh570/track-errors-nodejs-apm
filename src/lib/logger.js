const bunyan = require('bunyan');
const config = require('../../config');

const streams = [{ level: 'info', stream: process.stdout }];

const logger = bunyan.createLogger({
  name: config.logger.name,
  streams: streams,
});

module.exports = {
  logger,
};
