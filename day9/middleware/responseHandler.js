/**
 * Middleware to standardize API responses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const standardResponse = (req, res, next) => {
  // Add custom response methods
  res.successResponse = (data, message = 'Success') => {
    return res.json({
      success: true,
      message,
      data
    });
  };

  res.errorResponse = (message = 'Error occurred', statusCode = 400) => {
    return res.status(statusCode).json({
      success: false,
      message
    });
  };

  next();
};

module.exports = standardResponse;
