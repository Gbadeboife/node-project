const logger = require('../utils/logger');

/**
 * Global error handling middleware
 * Catches all errors and formats them into a consistent response
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: req.requestId
  });

  // Don't leak stack traces in production
  const error = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
  
  res.status(err.status || 500).json({
    success: false,
    error,
    message: err.userMessage || 'An unexpected error occurred'
  });
};

module.exports = errorHandler;
