const { Validator } = require('node-input-validator');

/**
 * Validates request body against a schema
 * @param {Object} schema - Validation schema
 */
const validateRequest = (schema) => {
  return async (req, res, next) => {
    const validator = new Validator(req.body, schema);
    const matched = await validator.check();
    
    if (!matched) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: validator.errors
      });
    }
    next();
  };
};

module.exports = validateRequest;
