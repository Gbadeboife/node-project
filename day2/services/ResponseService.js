class ResponseService {
  success(res, data = null, message = 'Success') {
    return res.json({
      success: true,
      message,
      data,
      error: null
    });
  }

  error(res, error = 'An error occurred', statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message: null,
      data: null,
      error: error.message || error
    });
  }

  validationError(res, errors) {
    return res.status(400).json({
      success: false,
      message: null,
      data: null,
      error: 'Validation failed',
      validationErrors: errors
    });
  }
}

module.exports = new ResponseService(); 