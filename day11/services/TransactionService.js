const { sequelize } = require('../models');

/**
 * Transaction Service for managing database transactions
 */
class TransactionService {
  /**
   * Execute a function within a transaction
   * @param {Function} callback - Function to execute within transaction
   * @param {Object} options - Transaction options
   * @returns {Promise} Result of the callback function
   */
  static async executeTransaction(callback, options = {}) {
    const transaction = await sequelize.transaction(options);
    
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Create a new transaction
   * @param {Object} options - Transaction options
   * @returns {Promise<Transaction>} Sequelize transaction object
   */
  static async beginTransaction(options = {}) {
    return await sequelize.transaction(options);
  }
}

module.exports = TransactionService;
