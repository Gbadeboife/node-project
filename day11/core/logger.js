const winston = require('winston');
const path = require('path');

// Create a Winston logger instance with custom configuration
const logger = winston.createLogger({
  // Set log level from environment variable or default to 'info'
  level: process.env.LOG_LEVEL || 'info',
  // Format logs as JSON with timestamps
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  // Define log file transports
  transports: [
    // Log errors to a separate file
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error' 
    }),
    // Log all levels to combined log file
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/combined.log') 
    })
  ]
});

// Add console transport in non-production environments for debugging
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger; 