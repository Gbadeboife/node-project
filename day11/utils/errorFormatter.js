/**
 * Standard error codes for the application
 */
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR'
};

/**
 * Format error for consistent API response
 * @param {Error} error - Error object
 * @returns {Object} Formatted error response
 */
const formatError = (error) => {
  // If error is already formatted, return as is
  if (error.code && error.message) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details && { details: error.details })
      }
    };
  }

  // Format validation errors
  if (error.name === 'ValidationError') {
    return {
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Validation failed',
        details: error.errors
      }
    };
  }

  // Format database errors
  if (error.name === 'SequelizeError') {
    return {
      success: false,
      error: {
        code: ErrorCodes.DATABASE_ERROR,
        message: 'Database operation failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    };
  }

  // Default error format
  return {
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }
  };
};

module.exports = {
  ErrorCodes,
  formatError
};
