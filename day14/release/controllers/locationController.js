/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         status:
 *           type: number
 *       required:
 *         - id
 *         - name
 *         - status
 */

/**
 * @swagger
 * /api/location:
 *   get:
 *     summary: Get all Locations
 *     tags: [Location]
 *     responses:
 *       200:
 *         description: List of Locations
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
 *                     $ref: '#/components/schemas/Location'
 */

/**
 * @swagger
 * /api/location/{id}:
 *   get:
 *     summary: Get Location by ID
 *     tags: [Location]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Location found
 *       404:
 *         description: Location not found
 */

/**
 * @swagger
 * /api/location:
 *   post:
 *     summary: Create a new Location
 *     tags: [Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       201:
 *         description: Location created successfully
 *       400:
 *         description: Invalid input
 */

const { Transaction } = require('sequelize');
const Location = require('../models/location');
const Validator = require('../utils/validator');
const logger = require('../utils/logger');

class LocationController {
  static async getAll(req, res) {
    try {
      const items = await Location.findAll();
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
      const item = await Location.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'Location not found'
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
      const validation = Validator.validateModel(req.body, {"name":"location","field":[["id","integer","ID","required"],["name","string","Name","required"],["status","integer","Status","required"]]});
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      const item = await Location.create(req.body, { transaction });
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
      const validation = Validator.validateModel(req.body, {"name":"location","field":[["id","integer","ID","required"],["name","string","Name","required"],["status","integer","Status","required"]]});
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      const item = await Location.findByPk(req.params.id);
      if (!item) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Location not found'
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
      const item = await Location.findByPk(req.params.id);
      if (!item) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Location not found'
        });
      }

      await item.destroy({ transaction });
      await transaction.commit();
      
      return res.json({
        success: true,
        message: 'Location deleted successfully'
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

module.exports = LocationController;