const express = require('express');
const router = express.Router();
const TreeService = require('../services/TreeService');
const { validate, schemas } = require('../middleware/validator');
const { AppError } = require('../middleware/errorHandler');

// Create a new node
router.post('/nodes', validate(schemas.createNode), async (req, res, next) => {
  try {
    const node = await TreeService.createNode(req.body);
    res.status(201).json({
      status: 'success',
      data: { node }
    });
  } catch (error) {
    next(error);
  }
});

// Get a node and its children
router.get('/nodes/:id', async (req, res, next) => {
  try {
    const node = await TreeService.getNodeWithChildren(req.params.id);
    res.json({
      status: 'success',
      data: { node }
    });
  } catch (error) {
    next(error);
  }
});

// Update a node
router.put('/nodes/:id', validate(schemas.updateNode), async (req, res, next) => {
  try {
    const node = await TreeService.updateNode(req.params.id, req.body);
    res.json({
      status: 'success',
      data: { node }
    });
  } catch (error) {
    next(error);
  }
});

// Delete a node
router.delete('/nodes/:id', async (req, res, next) => {
  try {
    await TreeService.deleteNode(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Move a node
router.post('/nodes/:id/move', validate(schemas.moveNode), async (req, res, next) => {
  try {
    const node = await TreeService.moveNode(req.params.id, req.body.newParentId);
    res.json({
      status: 'success',
      data: { node }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 