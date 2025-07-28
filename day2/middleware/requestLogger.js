const logger = require('../services/LoggerService');

/**
 * Request logging middleware
 * Logs details of each incoming request
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  // Log request details
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
    ip: req.ip
  });

  // Log response details after request is complete
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
}

module.exports = requestLogger; 