const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

/**
 * ControllerBuilder class responsible for generating controller files
 * with CRUD operations and Swagger documentation.
 * 
 * @class ControllerBuilder
 */
class ControllerBuilder {
  /**
   * Creates an instance of ControllerBuilder.
   * @param {Object} config - Configuration object containing model definitions
   */
  constructor(config) {
    this.config = config;
    this.outputDir = path.join(__dirname, '../../release/controllers');
  }

  /**
   * Generates Swagger documentation for a model.
   * 
   * @param {string} modelName - Name of the model
   * @param {Object} modelConfig - Configuration for the model
   * @returns {string} Generated Swagger documentation
   */
  generateSwaggerDocs(modelName, modelConfig) {
    // Generate Swagger schema documentation
    return `/**
 * @swagger
 * components:
 *   schemas:
 *     ${modelName}:
 *       type: object
 *       properties:
 *         ${modelConfig.field.map(([name, type]) => `${name}:
 *           type: ${type === 'integer' ? 'number' : type}`).join('\n *         ')}
 *       required:
 *         ${modelConfig.field.filter(([,,, ...rules]) => rules.includes('required')).map(([name]) => `- ${name}`).join('\n *         ')}
 */

/**
 * @swagger
 * /api/${modelName.toLowerCase()}:
 *   get:
 *     summary: Get all ${modelName}s
 *     tags: [${modelName}]
 *     responses:
 *       200:
 *         description: List of ${modelName}s
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
 *                     $ref: '#/components/schemas/${modelName}'
 */

/**
 * @swagger
 * /api/${modelName.toLowerCase()}/{id}:
 *   get:
 *     summary: Get ${modelName} by ID
 *     tags: [${modelName}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: ${modelName} found
 *       404:
 *         description: ${modelName} not found
 */

/**
 * @swagger
 * /api/${modelName.toLowerCase()}:
 *   post:
 *     summary: Create a new ${modelName}
 *     tags: [${modelName}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/${modelName}'
 *     responses:
 *       201:
 *         description: ${modelName} created successfully
 *       400:
 *         description: Invalid input
 */`;
  }

  /**
   * Generates the content for a controller file.
   * 
   * @param {Object} modelConfig - Configuration for a specific model
   * @returns {string} Generated controller file content
   */
  generateControllerContent(modelConfig) {
    const modelName = modelConfig.name.charAt(0).toUpperCase() + modelConfig.name.slice(1);
    const swaggerDocs = this.generateSwaggerDocs(modelName, modelConfig);
    
    // Generate the complete controller file content with CRUD operations
    return `${swaggerDocs}

const { Transaction } = require('sequelize');
const ${modelName} = require('../models/${modelConfig.name}');
const Validator = require('../utils/validator');
const logger = require('../utils/logger');

/**
 * Controller class for ${modelName} model
 * Implements CRUD operations with validation and error handling
 */
class ${modelName}Controller {
  /**
   * Retrieves all records
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static async getAll(req, res) {
    try {
      const items = await ${modelName}.findAll();
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

  /**
   * Retrieves a single record by ID
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static async getById(req, res) {
    try {
      const item = await ${modelName}.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          error: '${modelName} not found'
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

  /**
   * Creates a new record
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static async create(req, res) {
    const transaction = await sequelize.transaction();
    try {
      // Validate input data
      const validation = Validator.validateModel(req.body, ${JSON.stringify(modelConfig)});
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      const item = await ${modelName}.create(req.body, { transaction });
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

  /**
   * Updates an existing record
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static async update(req, res) {
    const transaction = await sequelize.transaction();
    try {
      // Validate input data
      const validation = Validator.validateModel(req.body, ${JSON.stringify(modelConfig)});
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      const item = await ${modelName}.findByPk(req.params.id);
      if (!item) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: '${modelName} not found'
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

  /**
   * Deletes a record
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static async delete(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const item = await ${modelName}.findByPk(req.params.id);
      if (!item) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: '${modelName} not found'
        });
      }

      await item.destroy({ transaction });
      await transaction.commit();
      
      return res.json({
        success: true,
        message: '${modelName} deleted successfully'
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

module.exports = ${modelName}Controller;`;
  }

  /**
   * Builds all controller files based on the configuration.
   * Creates the output directory if it doesn't exist.
   * 
   * @returns {Promise<void>}
   * @throws {Error} If file generation fails
   */
  async build() {
    try {
      // Create output directory if it doesn't exist
      await fs.mkdir(this.outputDir, { recursive: true });

      // Generate a controller file for each model configuration
      for (const modelConfig of this.config.model) {
        const controllerContent = this.generateControllerContent(modelConfig);
        const filePath = path.join(this.outputDir, `${modelConfig.name}Controller.js`);
        
        // Check if file already exists to avoid overwriting
        try {
          await fs.access(filePath);
          logger.info(`Controller file already exists: ${filePath}`);
          continue;
        } catch {
          // File doesn't exist, proceed with creation
          await fs.writeFile(filePath, controllerContent);
          logger.info(`Generated controller file: ${filePath}`);
        }
      }

      logger.info('Controller generation completed successfully');
    } catch (error) {
      logger.error('Error generating controllers:', error);
      throw error;
    }
  }
}

module.exports = ControllerBuilder; 