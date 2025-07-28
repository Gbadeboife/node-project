const ValidationService = require('../services/validationService');

// Middleware to validate transaction data
const validateTransaction = (req, res, next) => {
    // First validate the file if it exists
    if (req.file) {
        const { error: fileError } = ValidationService.validateFileFormat(req.file);
        if (fileError) {
            return res.status(400).json({
                success: false,
                message: 'File validation error',
                error: fileError.details[0].message
            });
        }
    }

    // Then validate the transaction data
    const data = req.body;
    const { error: dataError } = ValidationService.validateTransaction(data);
    
    if (dataError) {
        return res.status(400).json({
            success: false,
            message: 'Data validation error',
            error: dataError.details[0].message
        });
    }
    next();
};

module.exports = {
    validateTransaction
};
