const Joi = require('joi');
const { AppError } = require('./errorHandler');

/**
 * Validation middleware factory
 * Creates middleware that validates request body against a Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,  // Return all errors, not just the first one
      stripUnknown: true  // Remove unknown fields from the validated data
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      return next(new AppError(errorMessage, 400));
    }

    next();
  };
};

/**
 * Validation schemas for different API operations
 * Each schema defines the expected structure and types of request data
 */
const schemas = {
  // Schema for creating a new node
  createNode: Joi.object({
    name: Joi.string().required().trim(),
    parentId: Joi.number().integer().positive().allow(null),
    data: Joi.object().allow(null)
  }),

  // Schema for updating an existing node
  updateNode: Joi.object({
    name: Joi.string().trim(),
    parentId: Joi.number().integer().positive().allow(null),
    data: Joi.object().allow(null)
  }),

  // Schema for moving a node to a new parent
  moveNode: Joi.object({
    newParentId: Joi.number().integer().positive().allow(null).required()
  })
};

module.exports = {
  validate,
  schemas
}; 