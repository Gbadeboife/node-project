const { validationResult } = require('express-validator');

class ValidationError extends Error {
  constructor(errors) {
    super('Validation failed');
    this.errors = errors;
    this.statusCode = 400;
  }
}

const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    next(new ValidationError(errors.array()));
  };
};

module.exports = {
  validate,
  ValidationError
}; 