const db = require('../models');
const { Variable } = db;
const { sequelize } = db;
const logger = require('../utils/logger');

class VariableService {
  /**
   * Get all variables
   */
  static async getAllVariables() {
    return await Variable.findAll();
  }

  /**
   * Get variable by ID
   */
  static async getVariableById(id) {
    const variable = await Variable.findByPk(id);
    if (!variable) {
      const error = new Error('Variable not found');
      error.status = 404;
      throw error;
    }
    return variable;
  }

  /**
   * Create a new variable
   */
  static async createVariable(data) {
    const transaction = await sequelize.transaction();
    try {
      const variable = await Variable.create({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      }, { transaction });
      
      await transaction.commit();
      return variable;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Update an existing variable
   */
  static async updateVariable(id, data) {
    const transaction = await sequelize.transaction();
    try {
      const [updated] = await Variable.update(
        { ...data, updated_at: new Date() },
        { where: { id }, transaction }
      );
      
      if (!updated) {
        const error = new Error('Variable not found');
        error.status = 404;
        throw error;
      }

      const variable = await Variable.findByPk(id, { transaction });
      await transaction.commit();
      return variable;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Delete a variable
   */
  static async deleteVariable(id) {
    const transaction = await sequelize.transaction();
    try {
      const deleted = await Variable.destroy({
        where: { id },
        transaction
      });

      if (!deleted) {
        const error = new Error('Variable not found');
        error.status = 404;
        throw error;
      }

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = VariableService;
