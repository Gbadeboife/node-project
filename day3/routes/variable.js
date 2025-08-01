const express = require('express');
const router = express.Router();
const VariableService = require('../services/variableService');
const validateRequest = require('../middleware/validator');
const logger = require('../utils/logger');

/**
 * @swagger
 * /variables:
 *   get:
 *     summary: Get all variables
 *     responses:
 *       200:
 *         description: List of all variables
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res, next) => {
  try {
    const variables = await VariableService.getAllVariables();
    res.json({
      success: true,
      data: variables
    });
  } catch (error) {
    next(error);
  }
});

// Validation schema for variables
const variableSchema = {
  name: 'required|string',
  type: 'required|string|in:STRING,FLOAT,INTEGER'
};

/**
 * @swagger
 * /variables/{id}:
 *   get:
 *     summary: Get a variable by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:id', async (req, res, next) => {
  try {
    const variable = await VariableService.getVariableById(req.params.id);
    res.json({
      success: true,
      data: variable
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /variables/{id}:
 *   post:
 *     summary: Create a new variable
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 */
router.post('/:id', validateRequest(variableSchema), async (req, res, next) => {
  try {
    const allowedTypes = ['STRING', 'FLOAT', 'INTEGER'];
    if (!allowedTypes.includes(req.body.type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid variable type. Allowed types are: ${allowedTypes.join(', ')}`
      });
    }
    const variable = await VariableService.createVariable({
      id: req.params.id,
      ...req.body
    });
    logger.info(`Variable created with ID: ${variable.id}`);
    res.status(201).json({
      success: true,
      data: variable,
      message: 'Variable created successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /variables/{id}:
 *   put:
 *     summary: Update an existing variable
 */
router.put('/:id', validateRequest(variableSchema), async (req, res, next) => {
  try {
    const allowedTypes = ['STRING', 'FLOAT', 'INTEGER'];
    if (!allowedTypes.includes(req.body.type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid variable type. Allowed types are: ${allowedTypes.join(', ')}`
      });
    }
    const variable = await VariableService.updateVariable(req.params.id, req.body);
    logger.info(`Variable updated: ${req.params.id}`);
    res.json({
      success: true,
      data: variable,
      message: 'Variable updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /variables/{id}:
 *   delete:
 *     summary: Delete a variable
 */
router.delete('/:id', async (req, res, next) => {
  try {
    await VariableService.deleteVariable(req.params.id);
    logger.info(`Variable deleted: ${req.params.id}`);
    res.json({
      success: true,
      message: 'Variable deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 