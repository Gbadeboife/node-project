const Node = require('../models/Node');
const { AppError } = require('../middleware/errorHandler');
const sequelize = require('../config/database');
const logger = require('../utils/logger');

/**
 * TreeService - Handles all tree-related business logic
 * Implements the core functionality of TreeQL specification
 */
class TreeService {
  /**
   * Creates a new node in the tree
   * @param {Object} data - Node data including name, parentId, and optional data
   * @returns {Promise<Node>} Created node
   * @throws {AppError} If parent node doesn't exist
   */
  static async createNode(data) {
    const transaction = await sequelize.transaction();
    try {
      // Verify parent exists if parentId is provided
      if (data.parentId) {
        const parentExists = await Node.findByPk(data.parentId, { transaction });
        if (!parentExists) {
          throw new AppError('Parent node not found', 404);
        }
      }

      const node = await Node.create(data, { transaction });
      await transaction.commit();
      return node;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating node:', error);
      throw error;
    }
  }

  /**
   * Retrieves a node and all its descendants
   * @param {number} id - Node ID
   * @returns {Promise<Node>} Node with nested children
   * @throws {AppError} If node doesn't exist
   */
  static async getNodeWithChildren(id) {
    try {
      // Use eager loading to get the entire subtree
      const node = await Node.findByPk(id, {
        include: [{
          model: Node,
          as: 'children',
          include: { all: true, nested: true }
        }]
      });

      if (!node) {
        throw new AppError('Node not found', 404);
      }

      return node;
    } catch (error) {
      logger.error('Error fetching node:', error);
      throw error;
    }
  }

  /**
   * Updates a node's properties
   * @param {number} id - Node ID
   * @param {Object} data - Updated node data
   * @returns {Promise<Node>} Updated node
   * @throws {AppError} If node doesn't exist or operation is invalid
   */
  static async updateNode(id, data) {
    const transaction = await sequelize.transaction();
    try {
      const node = await Node.findByPk(id, { transaction });
      if (!node) {
        throw new AppError('Node not found', 404);
      }

      // Validate parent change if requested
      if (data.parentId) {
        const parentExists = await Node.findByPk(data.parentId, { transaction });
        if (!parentExists) {
          throw new AppError('Parent node not found', 404);
        }
        // Prevent circular references
        if (data.parentId === id) {
          throw new AppError('Node cannot be its own parent', 400);
        }
      }

      await node.update(data, { transaction });
      await transaction.commit();
      return node;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error updating node:', error);
      throw error;
    }
  }

  /**
   * Deletes a node if it has no children
   * @param {number} id - Node ID
   * @throws {AppError} If node doesn't exist or has children
   */
  static async deleteNode(id) {
    const transaction = await sequelize.transaction();
    try {
      // Check if node has children before deletion
      const node = await Node.findByPk(id, {
        include: [{
          model: Node,
          as: 'children'
        }],
        transaction
      });

      if (!node) {
        throw new AppError('Node not found', 404);
      }

      // Prevent deletion of nodes with children
      if (node.children.length > 0) {
        throw new AppError('Cannot delete node with children', 400);
      }

      await node.destroy({ transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      logger.error('Error deleting node:', error);
      throw error;
    }
  }

  /**
   * Moves a node to a new parent
   * @param {number} id - Node ID
   * @param {number|null} newParentId - New parent ID or null for root
   * @returns {Promise<Node>} Moved node
   * @throws {AppError} If node or new parent doesn't exist
   */
  static async moveNode(id, newParentId) {
    const transaction = await sequelize.transaction();
    try {
      const node = await Node.findByPk(id, { transaction });
      if (!node) {
        throw new AppError('Node not found', 404);
      }

      // Validate new parent if provided
      if (newParentId) {
        const newParent = await Node.findByPk(newParentId, { transaction });
        if (!newParent) {
          throw new AppError('New parent node not found', 404);
        }
      }

      await node.update({ parentId: newParentId }, { transaction });
      await transaction.commit();
      return node;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error moving node:', error);
      throw error;
    }
  }
}

module.exports = TreeService; 