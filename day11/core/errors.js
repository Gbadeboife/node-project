class BaseError extends Error {
  constructor(message, code = 'INTERNAL_ERROR', statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

class ValidationError extends BaseError {
  constructor(message) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

class NotFoundError extends BaseError {
  constructor(message) {
    super(message, 'NOT_FOUND', 404);
  }
}

class AuthenticationError extends BaseError {
  constructor(message) {
    super(message, 'AUTHENTICATION_ERROR', 401);
  }
}

const formatError = (error) => {
  if (error.originalError instanceof BaseError) {
    return {
      message: error.message,
      code: error.originalError.code,
      status: error.originalError.statusCode,
      path: error.path
    };
  }
  
  return {
    message: error.message,
    code: 'INTERNAL_ERROR',
    status: 500,
    path: error.path
  };
};

module.exports = {
  BaseError,
  ValidationError,
  NotFoundError,
  AuthenticationError,
  formatError
}; 