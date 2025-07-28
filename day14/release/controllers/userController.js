/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         status:
 *           type: number
 *       required:
 *         - id
 *         - name
 *         - email
 *         - status
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all Users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of Users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get User by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create a new User
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */

const { Transaction } = require('sequelize');
const User = require('../models/user');
const Validator = require('../utils/validator');
const logger = require('../utils/logger');

class UserController {
  static async getAll(req, res) {
    try {
      const items = await User.findAll();
      return res.json({
        success: true,
        data: items
      });
    } catch (error) {
      logger.error('Error in getAll:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getById(req, res) {
    try {
      const item = await User.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      return res.json({
        success: true,
        data: item
      });
    } catch (error) {
      logger.error('Error in getById:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async create(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const validation = Validator.validateModel(req.body, {"name":"user","field":[["id","integer","ID","required"],["name","string","Name","required"],["email","string","Email","required"],["status","integer","Status","required"]]});
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      const item = await User.create(req.body, { transaction });
      await transaction.commit();
      
      return res.status(201).json({
        success: true,
        data: item
      });
    } catch (error) {
      await transaction.rollback();
      logger.error('Error in create:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async update(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const validation = Validator.validateModel(req.body, {"name":"user","field":[["id","integer","ID","required"],["name","string","Name","required"],["email","string","Email","required"],["status","integer","Status","required"]]});
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      const item = await User.findByPk(req.params.id);
      if (!item) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      await item.update(req.body, { transaction });
      await transaction.commit();
      
      return res.json({
        success: true,
        data: item
      });
    } catch (error) {
      await transaction.rollback();
      logger.error('Error in update:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async delete(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const item = await User.findByPk(req.params.id);
      if (!item) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      await item.destroy({ transaction });
      await transaction.commit();
      
      return res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      await transaction.rollback();
      logger.error('Error in delete:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

module.exports = UserController;