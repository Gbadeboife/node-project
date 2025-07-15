const express = require('express');
const router = express.Router();
const db = require('../models');
const Order = db.Order;
const { Op } = require('sequelize');

// GET /api/v1/order/odd (Return all odd order_id rows)
router.get('/odd', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        id: { [Op.mod]: [2, 1] }
      }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/order (pagination only)
router.get('/', async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const { count, rows } = await Order.findAndCountAll({
      limit,
      offset
    });
    res.json({
      total: count,
      page,
      list: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/order/sort (pagination + sorting)
router.get('/sort', async (req, res) => {
  try {
    let { page, limit, sort, direction } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    direction = direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const offset = (page - 1) * limit;
    const { count, rows } = await Order.findAndCountAll({
      order: [[sort, direction]],
      limit,
      offset
    });
    res.json({
      total: count,
      page,
      list: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/order/cursor (cursor-based pagination)
router.get('/cursor', async (req, res) => {
  try {
    let { id, limit } = req.query;
    id = parseInt(id);
    limit = parseInt(limit);
    const orders = await Order.findAll({
      where: {
        id: { [Op.gt]: id }
      },
      order: [['id', 'ASC']],
      limit
    });
    res.json({
      id,
      list: orders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 