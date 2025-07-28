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
    // Write all logs with importance level of 'info' or less to combined.log
    new winston.transports.File({ filename: 'logs/combined.log' }),
    // Write all logs with importance level of 'error' or less to error.log
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
