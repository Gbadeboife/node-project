const logger = require('../utils/logger');

class ResponseHandler {
    /**
     * Send a success response
     * @param {Response} res - Express response object
     * @param {*} data - Data to send
     * @param {string} message - Success message
     * @param {number} status - HTTP status code
     */
    static success(res, data = null, message = 'Success', status = 200) {
        return res.status(status).json({
            success: true,
            message,
            data
        });
    }

    /**
     * Send an error response
     * @param {Response} res - Express response object
     * @param {Error} error - Error object
     * @param {number} status - HTTP status code
     */
    static error(res, error, status = 500) {
        logger.error({
            message: error.message,
            stack: error.stack
        });

        return res.status(status).json({
            success: false,
            message: error.message || 'Internal Server Error',
            errors: error.errors || []
        });
    }

    /**
     * Send a validation error response
     * @param {Response} res - Express response object
     * @param {Array} errors - Array of validation errors
     */
    static validationError(res, errors) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Array.isArray(errors) ? errors : [errors]
        });
    }

    /**
     * Send a not found response
     * @param {Response} res - Express response object
     * @param {string} message - Not found message
     */
    static notFound(res, message = 'Resource not found') {
        return res.status(404).json({
            success: false,
            message
        });
    }

    /**
     * Send an unauthorized response
     * @param {Response} res - Express response object
     * @param {string} message - Unauthorized message
     */
    static unauthorized(res, message = 'Unauthorized') {
        return res.status(401).json({
            success: false,
            message
        });
    }
}

module.exports = ResponseHandler;
