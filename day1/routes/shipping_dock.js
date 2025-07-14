const express = require('express');
const router = express.Router();
const db = require('../models');
const ShippingDock = db.ShippingDock;

// GET all
router.get('/', async (req, res) => {
  try {
    const docks = await ShippingDock.findAll();
    res.json(docks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one
router.get('/:id', async (req, res) => {
  try {
    const dock = await ShippingDock.findByPk(req.params.id);
    if (!dock) return res.status(404).json({ error: 'Not found' });
    res.json(dock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST (add one)
router.post('/', async (req, res) => {
  try {
    const dock = await ShippingDock.create(req.body);
    res.status(201).json(dock);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT (update one)
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await ShippingDock.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    const dock = await ShippingDock.findByPk(req.params.id);
    res.json(dock);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE (delete one)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ShippingDock.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 