class BaseController {
    static sendSuccess(res, data = null, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static sendError(res, message = 'Error occurred', statusCode = 400, errors = []) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors
        });
    }
}

module.exports = BaseController;
