const express = require('express');
const router = express.Router();
const db = require('../models');
const Transaction = db.Transaction;
const { Op, fn, col, literal } = require('sequelize');

// GET /api/v1/report/sale?month=1&year
router.get('/sale', async (req, res) => {
  try {
    const { month, year, from_date, to_date } = req.query;
    let where = {};
    if (month && year) {
      where = literal(`MONTH(created_at) = ${parseInt(month)} AND YEAR(created_at) = ${parseInt(year)}`);
    } else if (from_date && to_date) {
      let from = new Date(from_date);
      let to = new Date(to_date);
      if (from > to) [from, to] = [to, from];
      where = { created_at: { [Op.between]: [from, to] } };
    } else {
      return res.status(400).json({ error: 'Invalid parameters' });
    }
    const total = await Transaction.sum('amount', { where });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/report/sale/range?from_date=2022-01-01&to_date=2022-02-02
router.get('/sale/range', async (req, res) => {
  try {
    const { from_date, to_date } = req.query;
    if (!from_date || !to_date) return res.status(400).json({ error: 'from_date and to_date required' });
    let from = new Date(from_date);
    let to = new Date(to_date);
    if (from > to) [from, to] = [to, from];
    const total = await Transaction.sum('amount', { where: { created_at: { [Op.between]: [from, to] } } });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/report/monthly?year=2022
router.get('/monthly', async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ error: 'Year required' });
    const results = await Transaction.findAll({
      attributes: [
        [fn('MONTH', col('created_at')), 'month'],
        [fn('SUM', col('amount')), 'total']
      ],
      where: literal(`YEAR(created_at) = ${parseInt(year)}`),
      group: [fn('MONTH', col('created_at'))],
      raw: true
    });
    const filtered = results.filter(r => parseFloat(r.total) > 0);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/report/user?year=2022&user_id=1
router.get('/user', async (req, res) => {
  try {
    const { year, user_id } = req.query;
    if (!year || !user_id) return res.status(400).json({ error: 'Year and user_id required' });
    const results = await Transaction.findAll({
      attributes: [
        [fn('MONTH', col('created_at')), 'month'],
        [fn('SUM', col('amount')), 'total']
      ],
      where: literal(`YEAR(created_at) = ${parseInt(year)} AND user_id = ${parseInt(user_id)}`),
      group: [fn('MONTH', col('created_at'))],
      raw: true
    });
    const filtered = results.filter(r => parseFloat(r.total) > 0);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/report/shipping_dock?year=2022&shipping_dock_id=1
router.get('/shipping_dock', async (req, res) => {
  try {
    const { year, shipping_dock_id } = req.query;
    if (!year || !shipping_dock_id) return res.status(400).json({ error: 'Year and shipping_dock_id required' });
    const results = await Transaction.findAll({
      attributes: [
        [fn('MONTH', col('created_at')), 'month'],
        [fn('SUM', col('amount')), 'total']
      ],
      where: literal(`YEAR(created_at) = ${parseInt(year)} AND shipping_dock_id = ${parseInt(shipping_dock_id)}`),
      group: [fn('MONTH', col('created_at'))],
      raw: true
    });
    const filtered = results.filter(r => parseFloat(r.total) > 0);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/report/user/count?year=2022&user_id=1
router.get('/user/count', async (req, res) => {
  try {
    const { year, user_id } = req.query;
    if (!year || !user_id) return res.status(400).json({ error: 'Year and user_id required' });
    // Get all months (1-12)
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    // Get counts per month
    const results = await Transaction.findAll({
      attributes: [
        [fn('MONTH', col('created_at')), 'month'],
        [fn('COUNT', col('id')), 'order_count']
      ],
      where: literal(`YEAR(created_at) = ${parseInt(year)} AND user_id = ${parseInt(user_id)}`),
      group: [fn('MONTH', col('created_at'))],
      raw: true
    });
    // Map results to month:count
    const countMap = results.reduce((acc, r) => {
      acc[r.month] = parseInt(r.order_count);
      return acc;
    }, {});
    // Fill in 0 for months with no orders
    const output = months.map(m => ({ month: m, order_count: countMap[m] || 0 }));
    res.json(output);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 