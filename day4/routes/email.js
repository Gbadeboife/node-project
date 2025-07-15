const express = require('express');
const router = express.Router();
const db = require('../models');
const Email = db.email;

// GET /api/v1/email (get all)
router.get('/', async (req, res) => {
  try {
    const emails = await Email.findAll();
    res.json(emails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/email/:id (get one)
router.get('/:id', async (req, res) => {
  try {
    const email = await Email.findByPk(req.params.id);
    if (!email) return res.status(404).json({ error: 'Email not found' });
    res.json(email);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/email (add one)
router.post('/', async (req, res) => {
  try {
    const email = await Email.create(req.body);
    res.status(201).json(email);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/v1/email/:id (update one)
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Email.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Email not found' });
    const email = await Email.findByPk(req.params.id);
    res.json(email);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/v1/email/:id (delete one)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Email.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Email not found' });
    res.json({ message: 'Email deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 