const db = require('../models');
const logger = require('./LoggerService');

class TransactionService {
  /**
   * Create a new transaction with proper error handling and rollback
   * @param {Object} data Transaction data
   * @returns {Promise<Object>} Created transaction
   */
  async createTransaction(data) {
    const dbTransaction = await db.sequelize.transaction();
    
    try {
      // Create transaction record
      const transaction = await db.Transaction.create(data, {
        transaction: dbTransaction
      });

      // Update related order if needed
      if (data.order_id) {
        await db.Order.update(
          { status: 1 }, // Mark as paid
          { 
            where: { id: data.order_id },
            transaction: dbTransaction
          }
        );
      }

      // Commit transaction
      await dbTransaction.commit();
      logger.info('Transaction created successfully', { id: transaction.id });
      
      return transaction;
    } catch (error) {
      // Rollback transaction on error
      await dbTransaction.rollback();
      logger.error('Transaction creation failed', error);
      throw error;
    }
  }

  /**
   * Get transactions with parameterized query
   * @param {Object} filters Filter conditions
   * @returns {Promise<Array>} List of transactions
   */
  async getTransactions(filters) {
    const whereClause = {};
    
    if (filters.year) {
      whereClause[db.Sequelize.Op.and] = [
        db.Sequelize.literal('YEAR(created_at) = :year'),
        { year: filters.year }
      ];
    }

    if (filters.user_id) {
      whereClause.user_id = filters.user_id;
    }

    return db.Transaction.findAll({
      where: whereClause,
      replacements: filters, // Use parameterized values
      raw: true
    });
  }

  /**
   * Calculate monthly sales with safe query
   * @param {number} year Year to calculate sales for
   * @returns {Promise<Array>} Monthly sales data
   */
  async getMonthlySales(year) {
    return db.Transaction.findAll({
      attributes: [
        [db.Sequelize.fn('MONTH', db.Sequelize.col('created_at')), 'month'],
        [db.Sequelize.fn('SUM', db.Sequelize.col('amount')), 'total']
      ],
      where: {
        [db.Sequelize.Op.and]: [
          db.Sequelize.literal('YEAR(created_at) = :year')
        ]
      },
      replacements: { year }, // Parameterized value
      group: [db.Sequelize.fn('MONTH', db.Sequelize.col('created_at'))],
      raw: true
    });
  }
}

module.exports = new TransactionService(); 