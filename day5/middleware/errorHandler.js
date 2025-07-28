// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Handle multer errors
    if (err.name === 'MulterError') {
        return res.status(400).json({
            success: false,
            message: 'File upload error',
            error: err.message
        });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            error: err.message
        });
    }

    // Default error
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
};
