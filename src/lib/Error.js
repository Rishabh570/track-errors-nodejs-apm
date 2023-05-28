const { sendError } = require('@appsignal/nodejs');
const { HTTP_STATUS_CODES } = require('../../constants');

class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);

    // send to APM
    sendError(this);
  }
}

module.exports = {
  AppError,
};
