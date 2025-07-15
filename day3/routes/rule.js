var express = require('express');
var router = express.Router();
const db = require('../models');
const { Rule } = db;
const { Variable } = db;
const atob = (str) => Buffer.from(str, 'base64').toString('utf-8');

// GET /api/v1/rules (get all)
router.get('/', async (req, res) => {
  try {
    const allRules = await Rule.findAll();
    res.json(allRules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/rules/:id (get one)
router.get('/:id', async (req, res) => {
  try {
    const rule = await Rule.findByPk(req.params.id);
    if (!rule) return res.status(404).json({ error: 'Rule not found' });
    res.json(rule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/rules/:id (add one)
router.post('/:id', async (req, res) => {
  try {
    const { name, condition, action } = req.body;
    const newRule = await Rule.create({
      id: req.params.id,
      name,
      condition,
      action,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(201).json(newRule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/v1/rules/:id (update one)
router.put('/:id', async (req, res) => {
  try {
    const { name, condition, action } = req.body;
    const [updated] = await Rule.update(
      { name, condition, action, updated_at: new Date() },
      { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ error: 'Rule not found' });
    const updatedRule = await Rule.findByPk(req.params.id);
    res.json(updatedRule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/v1/rules/:id (delete one)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Rule.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Rule not found' });
    res.json({ message: 'Rule deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/evaluation?variable=base64
router.get('/../evaluation', async (req, res) => {
  try {
    const base64 = req.query.variable;
    if (!base64) return res.status(400).json({ error: 'Missing variable parameter' });
    let payload;
    try {
      payload = JSON.parse(atob(base64));
    } catch (e) {
      return res.status(400).json({ error: 'Invalid base64 or JSON' });
    }

    // Get all variables from DB
    const dbVariables = await Variable.findAll();
    const variableMap = {};
    dbVariables.forEach(v => {
      variableMap[v.name] = v.type;
    });

    // Cast payload values to match DB types
    const castedVars = {};
    for (const key in payload) {
      if (!variableMap[key]) continue; // Ignore if not in DB
      const type = variableMap[key];
      let value = payload[key];
      if (type === 'INTEGER') value = parseInt(value);
      else if (type === 'FLOAT') value = parseFloat(value);
      else if (type === 'STRING') value = String(value);
      castedVars[key] = value;
    }

    // Get all rules
    const allRules = await Rule.findAll();
    const results = [];
    for (const rule of allRules) {
      let condition = rule.condition;
      // Substitute variables in the condition string
      for (const key in castedVars) {
        // Replace all occurrences of the variable name with its value
        const re = new RegExp(`\\b${key}\\b`, 'g');
        condition = condition.replace(re, JSON.stringify(castedVars[key]));
      }
      let satisfied = false;
      try {
        // eslint-disable-next-line no-eval
        satisfied = eval(condition);
      } catch (e) {
        satisfied = false;
      }
      if (satisfied) {
        results.push({ rule_id: rule.id, result: rule.action });
      }
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 