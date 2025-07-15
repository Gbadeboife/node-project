var express = require('express');
var router = express.Router();
const db = require('../models');
const { Variable } = db;

// GET /api/v1/variables (get all)
router.get('/', async (req, res) => {
  try {
    const allVariables = await Variable.findAll();
    res.json(allVariables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/variables/:id (get one)
router.get('/:id', async (req, res) => {
  try {
    const variable = await Variable.findByPk(req.params.id);
    if (!variable) return res.status(404).json({ error: 'Variable not found' });
    res.json(variable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/variables/:id (add one)
router.post('/:id', async (req, res) => {
  try {
    const { name, type } = req.body;
    const newVariable = await Variable.create({
      id: req.params.id,
      name,
      type,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(201).json(newVariable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/v1/variables/:id (update one)
router.put('/:id', async (req, res) => {
  try {
    const { name, type } = req.body;
    const [updated] = await Variable.update(
      { name, type, updated_at: new Date() },
      { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ error: 'Variable not found' });
    const updatedVariable = await Variable.findByPk(req.params.id);
    res.json(updatedVariable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/v1/variables/:id (delete one)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Variable.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Variable not found' });
    res.json({ message: 'Variable deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 