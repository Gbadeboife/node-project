const Joi = require('joi');
const ApiResponse = require('../utils/apiResponse');

/**
 * Creates a validation middleware using a Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json(
        ApiResponse.error('Validation failed', 400, errors)
      );
    }
    
    next();
  };
};

module.exports = validateRequest;
