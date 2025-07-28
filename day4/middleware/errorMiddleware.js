const logger = require('../utils/logger');

class ErrorMiddleware {
    static async handleError(err, req, res, next) {
        logger.error({
            message: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method
        });

        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Internal Server Error',
            errors: err.errors || []
        });
    }

    static async notFound(req, res) {
        logger.warn({
            message: 'Route not found',
            path: req.path,
            method: req.method
        });

        return res.status(404).json({
            success: false,
            message: 'Route not found'
        });
    }
}

module.exports = ErrorMiddleware;
