/**
 * @swagger
 * components:
 *   schemas:
 *     Sms:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         phone:
 *           type: string
 *         status:
 *           type: number
 *       required:
 *         - id
 *         - phone
 *         - status
 */

/**
 * @swagger
 * /api/sms:
 *   get:
 *     summary: Get all Smss
 *     tags: [Sms]
 *     responses:
 *       200:
 *         description: List of Smss
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
 *                     $ref: '#/components/schemas/Sms'
 */

/**
 * @swagger
 * /api/sms/{id}:
 *   get:
 *     summary: Get Sms by ID
 *     tags: [Sms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sms found
 *       404:
 *         description: Sms not found
 */

/**
 * @swagger
 * /api/sms:
 *   post:
 *     summary: Create a new Sms
 *     tags: [Sms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sms'
 *     responses:
 *       201:
 *         description: Sms created successfully
 *       400:
 *         description: Invalid input
 */

const { Transaction } = require('sequelize');
const Sms = require('../models/sms');
const Validator = require('../utils/validator');
const logger = require('../utils/logger');

class SmsController {
  static async getAll(req, res) {
    try {
      const items = await Sms.findAll();
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
      const item = await Sms.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'Sms not found'
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
      const validation = Validator.validateModel(req.body, {"name":"sms","field":[["id","integer","ID","required"],["phone","string","Phone","required"],["status","integer","Status","required"]]});
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      const item = await Sms.create(req.body, { transaction });
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
      const validation = Validator.validateModel(req.body, {"name":"sms","field":[["id","integer","ID","required"],["phone","string","Phone","required"],["status","integer","Status","required"]]});
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      const item = await Sms.findByPk(req.params.id);
      if (!item) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Sms not found'
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
      const item = await Sms.findByPk(req.params.id);
      if (!item) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Sms not found'
        });
      }

      await item.destroy({ transaction });
      await transaction.commit();
      
      return res.json({
        success: true,
        message: 'Sms deleted successfully'
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

module.exports = SmsController;