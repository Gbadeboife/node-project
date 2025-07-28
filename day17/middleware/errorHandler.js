exports.errorHandler = (error, req, res) => {
  console.error('Error:', error);
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.errors.map(err => ({
        field: err.path,
        message: err.message
      }))
    });
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      message: 'Database error occurred'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
