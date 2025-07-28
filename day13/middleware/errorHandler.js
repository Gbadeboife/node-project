const { ValidationError } = require('./validate');
const Stripe = require('stripe');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Handle validation errors
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: true,
      message: 'Validation failed',
      details: err.errors
    });
  }

  // Handle Stripe errors
  if (err instanceof Stripe.errors.StripeError) {
    return res.status(402).json({
      error: true,
      message: 'Payment failed',
      details: err.message
    });
  }

  // Handle 404 errors
  if (err.status === 404) {
    return res.status(404).json({
      error: true,
      message: 'Not found',
      details: err.message
    });
  }

  // Handle all other errors
  res.status(err.status || 500).json({
    error: true,
    message: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler; 