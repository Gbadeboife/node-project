/**
 * @swagger
 * components:
 *   schemas:
 *     Email:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         email:
 *           type: string
 *         status:
 *           type: number
 *       required:
 *         - id
 *         - email
 *         - status
 */

/**
 * @swagger
 * /api/email:
 *   get:
 *     summary: Get all Emails
 *     tags: [Email]
 *     responses:
 *       200:
 *         description: List of Emails
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
 *                     $ref: '#/components/schemas/Email'
 */

/**
 * @swagger
 * /api/email/{id}:
 *   get:
 *     summary: Get Email by ID
 *     tags: [Email]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Email found
 *       404:
 *         description: Email not found
 */

/**
 * @swagger
 * /api/email:
 *   post:
 *     summary: Create a new Email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Email'
 *     responses:
 *       201:
 *         description: Email created successfully
 *       400:
 *         description: Invalid input
 */

const { Transaction } = require('sequelize');
const Email = require('../models/email');
const Validator = require('../utils/validator');
const logger = require('../utils/logger');

class EmailController {
  static async getAll(req, res) {
    try {
      const items = await Email.findAll();
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
      const item = await Email.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'Email not found'
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
      const validation = Validator.validateModel(req.body, {"name":"email","field":[["id","integer","ID","required"],["email","string","Email","required"],["status","integer","Status","required"]]});
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      const item = await Email.create(req.body, { transaction });
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
      const validation = Validator.validateModel(req.body, {"name":"email","field":[["id","integer","ID","required"],["email","string","Email","required"],["status","integer","Status","required"]]});
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      const item = await Email.findByPk(req.params.id);
      if (!item) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Email not found'
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
      const item = await Email.findByPk(req.params.id);
      if (!item) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Email not found'
        });
      }

      await item.destroy({ transaction });
      await transaction.commit();
      
      return res.json({
        success: true,
        message: 'Email deleted successfully'
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

module.exports = EmailController;