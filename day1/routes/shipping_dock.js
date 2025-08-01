const express = require('express');
const router = express.Router();
const db = require('../models');
const ShippingDock = db.ShippingDock;
const { validateInput, handleValidationErrorForAPI } = require('../services/ValidationService');
const ResponseHandler = require('../utils/responseHandler');

// Validation rules
const dockValidationRules = {
  name: 'required|string',
  status: 'required|string|in:active,inactive,maintenance',
  capacity: 'required|integer|min:1'
};

// Custom validation messages
const validationMessages = {
  'name.required': 'Dock name is required',
  'name.string': 'Dock name must be a string',
  'status.required': 'Status is required',
  'status.in': 'Status must be one of: active, inactive, maintenance',
  'capacity.required': 'Capacity is required',
  'capacity.integer': 'Capacity must be a number',
  'capacity.min': 'Capacity must be at least 1'
};

/**
 * @swagger
 * /api/v1/shipping_dock:
 *   get:
 *     summary: Get all shipping docks
 *     tags: [Shipping Docks]
 *     responses:
 *       200:
 *         description: List of shipping docks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ShippingDock'
 */
router.get('/', async (req, res) => {
  try {
    const docks = await ShippingDock.findAll({
      order: [['name', 'ASC']]
    });
    return ResponseHandler.success(res, docks);
  } catch (err) {
    console.error('Error fetching shipping docks:', err);
    return ResponseHandler.error(res, err);
  }
});

/**
 * @swagger
 * /api/v1/shipping_dock/{id}:
 *   get:
 *     summary: Get a shipping dock by ID
 *     tags: [Shipping Docks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Shipping Dock ID
 *     responses:
 *       200:
 *         description: Shipping dock details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/:id', async (req, res) => {
  try {
    const dock = await ShippingDock.findByPk(req.params.id);
    if (!dock) return ResponseHandler.notFound(res, 'Shipping dock not found');
    return ResponseHandler.success(res, dock);
  } catch (err) {
    console.error(`Error fetching shipping dock ${req.params.id}:`, err);
    return ResponseHandler.error(res, err);
  }
});

/**
 * @swagger
 * /api/v1/shipping_dock:
 *   post:
 *     summary: Create a new shipping dock
 *     tags: [Shipping Docks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShippingDock'
 *     responses:
 *       201:
 *         description: Shipping dock created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/:id',
  validateInput(dockValidationRules, validationMessages),
  handleValidationErrorForAPI,
  async (req, res) => {
    const transaction = await db.sequelize.transaction();
    
    try {
      const dock = await ShippingDock.create({ ...req.body, id: req.params.id }, { transaction });
      await transaction.commit();
      return ResponseHandler.success(res, dock, 'Shipping dock created successfully', 201);
    } catch (err) {
      await transaction.rollback();
      console.error('Error creating shipping dock:', err);
      return ResponseHandler.error(res, err);
    }
});

/**
 * @swagger
 * /api/v1/shipping_dock/{id}:
 *   put:
 *     summary: Update a shipping dock
 *     tags: [Shipping Docks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Shipping Dock ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShippingDock'
 *     responses:
 *       200:
 *         description: Shipping dock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put('/:id',
  validateInput(dockValidationRules, validationMessages),
  handleValidationErrorForAPI,
  async (req, res) => {
    const transaction = await db.sequelize.transaction();
    
    try {
      const dock = await ShippingDock.findByPk(req.params.id);
      if (!dock) {
        await transaction.rollback();
        return ResponseHandler.notFound(res, 'Shipping dock not found');
      }

      const updated = await dock.update(req.body, { transaction });
      await transaction.commit();
      return ResponseHandler.success(res, updated, 'Shipping dock updated successfully');
    } catch (err) {
      await transaction.rollback();
      console.error(`Error updating shipping dock ${req.params.id}:`, err);
      return ResponseHandler.error(res, err);
    }
});

/**
 * @swagger
 * /api/v1/shipping_dock/{id}:
 *   delete:
 *     summary: Delete a shipping dock
 *     tags: [Shipping Docks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Shipping Dock ID
 *     responses:
 *       200:
 *         description: Shipping dock deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/:id', async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const dock = await ShippingDock.findByPk(req.params.id);
    if (!dock) {
      await transaction.rollback();
      return ResponseHandler.notFound(res, 'Shipping dock not found');
    }

    await dock.destroy({ transaction });
    await transaction.commit();
    return ResponseHandler.success(res, null, 'Shipping dock deleted successfully');
  } catch (err) {
    await transaction.rollback();
    console.error(`Error deleting shipping dock ${req.params.id}:`, err);
    return ResponseHandler.error(res, err);
  }
});

module.exports = router; 