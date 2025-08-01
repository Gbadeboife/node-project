const express = require('express');
const router = express.Router();
const db = require('../models');
const Order = db.Order;
const { validateInput, handleValidationErrorForAPI } = require('../services/ValidationService');
const ResponseHandler = require('../utils/responseHandler');

// Validation rules
const orderValidationRules = {
  customerName: 'required|string',
  orderDate: 'required|date',
  items: 'required|array',
  'items.*.productId': 'required|integer',
  'items.*.quantity': 'required|integer|min:1'
};

// Custom validation messages
const validationMessages = {
  'customerName.required': 'Customer name is required',
  'orderDate.required': 'Order date is required',
  'orderDate.date': 'Invalid order date format',
  'items.required': 'Items are required',
  'items.array': 'Items must be an array',
  'items.*.productId.required': 'Product ID is required for each item',
  'items.*.productId.integer': 'Product ID must be a number',
  'items.*.quantity.required': 'Quantity is required for each item',
  'items.*.quantity.integer': 'Quantity must be a number',
  'items.*.quantity.min': 'Quantity must be at least 1'
};

/**
 * @swagger
 * /api/v1/order:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
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
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: ['items'],
      order: [['createdAt', 'DESC']]
    });
    return ResponseHandler.success(res, orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    return ResponseHandler.error(res, err);
  }
});

/**
 * @swagger
 * /api/v1/order/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: ['items']
    });
    if (!order) return ResponseHandler.notFound(res, 'Order not found');
    return ResponseHandler.success(res, order);
  } catch (err) {
    console.error(`Error fetching order ${req.params.id}:`, err);
    return ResponseHandler.error(res, err);
  }
});

/**
 * @swagger
 * /api/v1/order:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id', 
  validateInput(orderValidationRules, validationMessages),
  handleValidationErrorForAPI,
  async (req, res) => {
    const transaction = await db.sequelize.transaction();
    
    try {
      const order = await Order.create({ ...req.body, id: req.params.id }, {
        include: ['items'],
        transaction
      });

      await transaction.commit();
      return ResponseHandler.success(res, order, 'Order created successfully', 201);
    } catch (err) {
      await transaction.rollback();
      console.error('Error creating order:', err);
      return ResponseHandler.error(res, err);
    }
});

/**
 * @swagger
 * /api/v1/order/{id}:
 *   put:
 *     summary: Update an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 */
router.put('/:id',
  validateInput(orderValidationRules, validationMessages),
  handleValidationErrorForAPI,
  async (req, res) => {
    const transaction = await db.sequelize.transaction();
    
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        await transaction.rollback();
        return ResponseHandler.notFound(res, 'Order not found');
      }

      const updated = await order.update(req.body, { transaction });
      
      if (req.body.items) {
        await order.setItems([], { transaction });
        await order.addItems(req.body.items, { transaction });
      }

      await transaction.commit();
      return ResponseHandler.success(res, updated, 'Order updated successfully');
    } catch (err) {
      await transaction.rollback();
      console.error(`Error updating order ${req.params.id}:`, err);
      return ResponseHandler.error(res, err);
    }
});

/**
 * @swagger
 * /api/v1/order/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order deleted successfully
 */
router.delete('/:id', async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      await transaction.rollback();
      return ResponseHandler.notFound(res, 'Order not found');
    }

    await order.destroy({ transaction });
    await transaction.commit();
    return ResponseHandler.success(res, null, 'Order deleted successfully');
  } catch (err) {
    await transaction.rollback();
    console.error(`Error deleting order ${req.params.id}:`, err);
    return ResponseHandler.error(res, err);
  }
});

module.exports = router; 