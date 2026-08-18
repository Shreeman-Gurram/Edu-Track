const { errorResponse } = require('../utils/response');

function notFoundHandler(req, res) {
  return errorResponse(res, {
    statusCode: 404,
    message: 'Route not found',
  });
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = Number.isInteger(err.statusCode)
    ? err.statusCode
    : Number.isInteger(err.status)
      ? err.status
      : 500;
  const isServerError = statusCode >= 500;

  return errorResponse(res, {
    statusCode,
    message: isServerError ? 'Internal server error' : (err.message || 'Request failed'),
  });
}

module.exports = { notFoundHandler, errorHandler };
