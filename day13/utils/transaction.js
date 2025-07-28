const { sequelize } = require('../models');
const logger = require('./logger');

/**
 * Utility for handling database transactions
 */
class TransactionUtil {
  /**
   * Execute a function within a transaction
   * @param {Function} callback - Function to execute within transaction
   * @param {Object} options - Additional options
   * @returns {Promise} Result of the callback function
   */
  static async withTransaction(callback, options = {}) {
    const transaction = await sequelize.transaction();
    
    try {
      logger.info('Starting database transaction');
      const result = await callback(transaction);
      await transaction.commit();
      logger.info('Transaction committed successfully');
      return result;
    } catch (error) {
      logger.error('Transaction failed, rolling back:', error);
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = TransactionUtil;
