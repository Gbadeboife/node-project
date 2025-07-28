const TransactionService = require('../services/transactionService');

class TransactionController {
    /**
     * Render import page
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static renderImportPage(req, res) {
        res.render('import');
    }

    /**
     * Handle CSV file import
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    static async importTransactions(req, res, next) {
        try {
            // Check if file exists
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            // Process the import
            const result = await TransactionService.importFromCSV(req.file.path);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Some rows failed to import',
                    errors: result.errors
                });
            }

            res.json({
                success: true,
                message: 'Import successful',
                data: result.data
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Handle CSV file export
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    static async exportTransactions(req, res, next) {
        try {
            const csv = await TransactionService.exportToCSV();
            
            res.header('Content-Type', 'text/csv');
            res.attachment('transactions.csv');
            res.send(csv);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = TransactionController;
