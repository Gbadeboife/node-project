const winston = require('winston');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  format: logFormat,
  transports: [
    // Write all logs error (and below) to error.log
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error' 
    }),
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: 'combined.log' 
    })
  ]
});

// If we're not in production, log to console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
