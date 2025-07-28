const logger = require('../utils/logger');

/**
 * Custom error class for application-specific errors
 * Extends the built-in Error class with additional properties
 */
class AppError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;  // Indicates if error is operational or programming

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 * Processes all errors and sends appropriate responses
 * 
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log all errors for debugging and monitoring
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode
  });

  if (process.env.NODE_ENV === 'development') {
    // Development error response - includes stack trace and details
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production error response - sanitized for security
    if (err.isOperational) {
      // Send operational error details
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Programming or unknown errors - don't leak error details
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  }
};

module.exports = {
  AppError,
  errorHandler
}; 