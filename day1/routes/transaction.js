const express = require('express');
const router = express.Router();
const db = require('../models');
const Transaction = db.Transaction;
const { validateInput, handleValidationErrorForAPI } = require('../services/ValidationService');
const ResponseHandler = require('../utils/responseHandler');

// Validation rules
const transactionValidationRules = {
  orderId: 'required|integer',
  amount: 'required|numeric|min:0',
  type: 'required|string|in:payment,refund,adjustment',
  status: 'required|string|in:pending,completed,failed',
  description: 'string|max:255'
};

// Custom validation messages
const validationMessages = {
  'orderId.required': 'Order ID is required',
  'orderId.integer': 'Order ID must be a number',
  'amount.required': 'Amount is required',
  'amount.numeric': 'Amount must be a number',
  'amount.min': 'Amount must be greater than or equal to 0',
  'type.required': 'Transaction type is required',
  'type.in': 'Transaction type must be one of: payment, refund, adjustment',
  'status.required': 'Status is required',
  'status.in': 'Status must be one of: pending, completed, failed',
  'description.max': 'Description cannot exceed 255 characters'
};

/**
 * @swagger
 * /api/v1/transaction:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: List of transactions
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
 *                     $ref: '#/components/schemas/Transaction'
 */
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      order: [['createdAt', 'DESC']],
      include: ['order'] // Assuming there's an association with Order
    });
    return ResponseHandler.success(res, transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    return ResponseHandler.error(res, err);
  }
});

/**
 * @swagger
 * /api/v1/transaction/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: ['order']
    });
    if (!transaction) return ResponseHandler.notFound(res, 'Transaction not found');
    return ResponseHandler.success(res, transaction);
  } catch (err) {
    console.error(`Error fetching transaction ${req.params.id}:`, err);
    return ResponseHandler.error(res, err);
  }
});

/**
 * @swagger
 * /api/v1/transaction:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/',
  validateInput(transactionValidationRules, validationMessages),
  handleValidationErrorForAPI,
  async (req, res) => {
    const transaction = await db.sequelize.transaction();
    
    try {
      // Verify order exists
      const order = await db.Order.findByPk(req.body.orderId, { transaction });
      if (!order) {
        await transaction.rollback();
        return ResponseHandler.notFound(res, 'Referenced order not found');
      }

      const newTransaction = await Transaction.create(req.body, { transaction });
      
      // Update order status or perform other related operations here
      
      await transaction.commit();
      return ResponseHandler.success(res, newTransaction, 'Transaction created successfully', 201);
    } catch (err) {
      await transaction.rollback();
      console.error('Error creating transaction:', err);
      return ResponseHandler.error(res, err);
    }
});

/**
 * @swagger
 * /api/v1/transaction/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put('/:id',
  validateInput(transactionValidationRules, validationMessages),
  handleValidationErrorForAPI,
  async (req, res) => {
    const dbTransaction = await db.sequelize.transaction();
    
    try {
      const transaction = await Transaction.findByPk(req.params.id);
      if (!transaction) {
        await dbTransaction.rollback();
        return ResponseHandler.notFound(res, 'Transaction not found');
      }

      // Verify order exists if orderId is being updated
      if (req.body.orderId) {
        const order = await db.Order.findByPk(req.body.orderId, { transaction: dbTransaction });
        if (!order) {
          await dbTransaction.rollback();
          return ResponseHandler.notFound(res, 'Referenced order not found');
        }
      }

      const updated = await transaction.update(req.body, { transaction: dbTransaction });
      await dbTransaction.commit();
      return ResponseHandler.success(res, updated, 'Transaction updated successfully');
    } catch (err) {
      await dbTransaction.rollback();
      console.error(`Error updating transaction ${req.params.id}:`, err);
      return ResponseHandler.error(res, err);
    }
});

/**
 * @swagger
 * /api/v1/transaction/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/:id', async (req, res) => {
  const dbTransaction = await db.sequelize.transaction();
  
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      await dbTransaction.rollback();
      return ResponseHandler.notFound(res, 'Transaction not found');
    }

    await transaction.destroy({ transaction: dbTransaction });
    await dbTransaction.commit();
    return ResponseHandler.success(res, null, 'Transaction deleted successfully');
  } catch (err) {
    await dbTransaction.rollback();
    console.error(`Error deleting transaction ${req.params.id}:`, err);
    return ResponseHandler.error(res, err);
  }
});

module.exports = router; 