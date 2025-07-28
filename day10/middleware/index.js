const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Response formatter middleware
const responseFormatter = (req, res, next) => {
  res.success = (data, message = 'Success') => {
    return res.json({
      success: true,
      message,
      data
    });
  };

  res.error = (message = 'Error', statusCode = 400) => {
    return res.status(statusCode).json({
      success: false,
      message
    });
  };

  next();
};

module.exports = {
  securityMiddleware: [
    helmet(), // Adds various HTTP headers for security
    limiter
  ],
  responseFormatter
};
