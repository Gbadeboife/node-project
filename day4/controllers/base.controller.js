const logger = require('../utils/logger');

class BaseController {
    static sendSuccess(res, data = null, message = 'Success', status = 200) {
        return res.status(status).json({
            success: true,
            message,
            data
        });
    }

    static sendError(res, error) {
        logger.error(error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Internal Server Error',
            errors: error.errors || []
        });
    }
}

module.exports = BaseController;
