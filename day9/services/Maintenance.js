// Middleware to check if the application is in maintenance mode
const config = require('../config');

module.exports = function (req, res, next) {
  // If maintenance mode is enabled, return 503 Service Unavailable
  if (config.maintenance) {
    return res.status(503).json({
      success: false,
      message: 'Service is under maintenance. Please try again later.'
    });
  }
  // Otherwise, proceed to the next middleware or route handler
  next();
}; 