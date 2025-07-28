const winston = require('winston');
const path = require('path');

/**
 * Logger Service for consistent logging across the application
 * Uses Winston for structured logging with different levels and formats
 */
class LoggerService {
  constructor() {
    const logDir = 'logs';
    
    // Define log format
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    );

    // Create logger instance
    this.logger = winston.createLogger({
      format: logFormat,
      transports: [
        // Console logging
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        }),
        // Error logging
        new winston.transports.File({
          filename: path.join(logDir, 'error.log'),
          level: 'error'
        }),
        // Combined logging
        new winston.transports.File({
          filename: path.join(logDir, 'combined.log')
        })
      ]
    });
  }

  /**
   * Log an info message
   * @param {string} message - Log message
   * @param {Object} [meta] - Additional metadata
   */
  info(message, meta = {}) {
    this.logger.info(message, meta);
  }

  /**
   * Log an error message
   * @param {string} message - Error message
   * @param {Error|Object} [error] - Error object or additional metadata
   */
  error(message, error = {}) {
    this.logger.error(message, {
      error: error instanceof Error ? error.stack : error
    });
  }

  /**
   * Log a debug message
   * @param {string} message - Debug message
   * @param {Object} [meta] - Additional metadata
   */
  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }

  /**
   * Log a warning message
   * @param {string} message - Warning message
   * @param {Object} [meta] - Additional metadata
   */
  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }
}

module.exports = new LoggerService(); 