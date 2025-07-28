const logger = require('../services/LoggerService');
const ResponseService = require('../services/ResponseService');

/**
 * Global error handling middleware
 * Catches all unhandled errors and provides a consistent error response
 */
function errorHandler(err, req, res, next) {
  // Log the error
  logger.error('Unhandled error:', err);

  // Determine error type and status code
  let statusCode = 500;
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
  }

  // Send error response
  return ResponseService.error(res, err, statusCode);
}

module.exports = errorHandler; 