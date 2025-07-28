/**
 * Service layer for handling rule-related business logic
 */
const db = require('../models');
const { Rules, Variable } = db;
const logger = require('../utils/logger');
const { evaluateCondition } = require('../utils/conditionEvaluator');
const { sequelize } = db;

class RuleService {
  /**
   * Get all rules
   */
  static async getAllRules() {
    return await Rules.findAll();
  }

  /**
   * Get rule by ID
   */
  static async getRuleById(id) {
    const rule = await Rules.findByPk(id);
    if (!rule) {
      const error = new Error('Rule not found');
      error.status = 404;
      throw error;
    }
    return rule;
  }

  /**
   * Create a new rule
   */
  static async createRule(data) {
    const transaction = await sequelize.transaction();
    try {
      const rule = await Rules.create({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      }, { transaction });
      
      await transaction.commit();
      return rule;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Update an existing rule
   */
  static async updateRule(id, data) {
    const transaction = await sequelize.transaction();
    try {
      const [updated] = await Rules.update(
        { ...data, updated_at: new Date() },
        { where: { id }, transaction }
      );
      
      if (!updated) {
        const error = new Error('Rule not found');
        error.status = 404;
        throw error;
      }

      const rule = await Rules.findByPk(id, { transaction });
      await transaction.commit();
      return rule;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Delete a rule
   */
  static async deleteRule(id) {
    const transaction = await sequelize.transaction();
    try {
      const deleted = await Rules.destroy({
        where: { id },
        transaction
      });

      if (!deleted) {
        const error = new Error('Rule not found');
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

  /**
   * Evaluate rules based on provided variables
   */
  static async evaluateRules(variables) {
    // Get all variables from DB in a single query
    const dbVariables = await Variable.findAll({
      attributes: ['name', 'type']
    });

    // Create map for O(1) lookup
    const variableMap = new Map(
      dbVariables.map(v => [v.name, v.type])
    );

    // Cast variables according to DB types
    const castedVars = {};
    for (const [key, value] of Object.entries(variables)) {
      if (!variableMap.has(key)) continue;
      
      const type = variableMap.get(key);
      try {
        switch (type) {
          case 'INTEGER':
            castedVars[key] = parseInt(value);
            break;
          case 'FLOAT':
            castedVars[key] = parseFloat(value);
            break;
          case 'STRING':
            castedVars[key] = String(value);
            break;
        }
      } catch (error) {
        logger.warn(`Failed to cast variable ${key} to type ${type}`);
      }
    }

    // Get all rules
    const rules = await Rules.findAll();
    
    // Evaluate each rule
    return rules
      .map(rule => {
        try {
          const satisfied = evaluateCondition(rule.condition, castedVars);
          if (satisfied) {
            return {
              rule_id: rule.id,
              result: rule.action
            };
          }
        } catch (error) {
          logger.error(`Error evaluating rule ${rule.id}: ${error.message}`);
        }
        return null;
      })
      .filter(result => result !== null);
  }
}

module.exports = RuleService;
