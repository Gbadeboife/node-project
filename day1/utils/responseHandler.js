class ResponseHandler {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId
    });
  }

  static error(res, error = 'Internal Server Error', statusCode = 500) {
    console.error(`[Error] ${error}`);
    return res.status(statusCode).json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : error,
        ...(process.env.NODE_ENV === 'development' && { stack: error instanceof Error ? error.stack : undefined })
      },
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId
    });
  }

  static validationError(res, errors) {
    return this.error(res, {
      message: 'Validation Error',
      details: errors
    }, 400);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }
}

module.exports = ResponseHandler; 