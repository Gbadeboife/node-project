const { Parser } = require('json2csv');
const csvParser = require('csv-parser');
const fs = require('fs');
const { transactionSchema } = require('../middleware/validator');
const db = require('../models');
const Transaction = require('../models/transaction');

class TransactionService {
    /**
     * Import transactions from CSV file
     * @param {string} filePath - Path to the CSV file
     * @returns {Promise<{success: boolean, data?: any, errors?: any[]}>}
     */
    static async importFromCSV(filePath) {
        const results = [];
        const errors = [];
        
        // Create a database transaction
        const dbTransaction = await db.sequelize.transaction();

        try {
            // Read and parse CSV file
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csvParser())
                    .on('data', (data) => results.push(data))
                    .on('end', resolve)
                    .on('error', reject);
            });

            // Process each row within the transaction
            for (const [index, row] of results.entries()) {
                try {
                    // Validate row data
                    const { error } = transactionSchema.validate(row);
                    if (error) {
                        errors.push({ row: index + 1, error: error.details[0].message });
                        continue;
                    }

                    await Transaction.create(row, { transaction: dbTransaction });
                } catch (err) {
                    errors.push({ row: index + 1, error: err.message });
                }
            }

            // If there are any errors, rollback the transaction
            if (errors.length > 0) {
                await dbTransaction.rollback();
                return { success: false, errors };
            }

            // Commit the transaction if all is well
            await dbTransaction.commit();
            return { success: true, data: { count: results.length } };

        } catch (err) {
            await dbTransaction.rollback();
            throw err;
        } finally {
            // Clean up the uploaded file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    }

    /**
     * Export transactions to CSV
     * @returns {Promise<string>} CSV string
     */
    static async exportToCSV() {
        try {
            const transactions = await Transaction.findAll({
                order: [['createdAt', 'DESC']]
            });

            const parser = new Parser({
                fields: [
                    'id', 'order_id', 'user_id', 'shipping_dock_id',
                    'amount', 'discount', 'tax', 'total', 'notes',
                    'status', 'createdAt', 'updatedAt'
                ]
            });

            return parser.parse(transactions.map(t => t.toJSON()));
        } catch (err) {
            throw err;
        }
    }
}

module.exports = TransactionService;
