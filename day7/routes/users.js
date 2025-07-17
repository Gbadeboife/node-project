const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Web3Service = require('../services/Web3Service');

// GET /api/v1/user - get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/user/:id - get one user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/user - add one user
router.post('/', async (req, res) => {
  try {
    const { name, wallet_id } = req.body;
    const user = await User.create({ name, wallet_id });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/v1/user/wallet - create a wallet for user and save wallet id into user, return private key
router.post('/wallet', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const account = Web3Service.createWallet();
    const user = await User.create({ name, wallet_id: account.address });
    res.status(201).json({ user, privateKey: account.privateKey });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/v1/user/:id - update one user
router.put('/:id', async (req, res) => {
  try {
    const { name, wallet_id } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.update({ name, wallet_id });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/v1/user/:id - delete one user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/user/sign?private_key=... - sign user and return payload
router.get('/sign', async (req, res) => {
  try {
    const { private_key } = req.query;
    if (!private_key) return res.status(400).json({ error: 'private_key is required' });
    const payload = 'Sign this payload';
    const signed = Web3Service.signPayload(private_key, payload);
    res.json({ payload, signed });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/v1/user/account?private_key=... - return the balance of user wallet
router.get('/account', async (req, res) => {
  try {
    const { private_key } = req.query;
    if (!private_key) return res.status(400).json({ error: 'private_key is required' });
    const balance = await Web3Service.getBalance(private_key);
    res.json({ balance });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/v1/user/transfer?private_key=...&to_address=...&amount=... - Transfer x token from user to to_address user
router.get('/transfer', async (req, res) => {
  try {
    const { private_key, to_address, amount } = req.query;
    if (!private_key || !to_address || !amount) {
      return res.status(400).json({ error: 'private_key, to_address, and amount are required' });
    }
    const receipt = await Web3Service.transfer(private_key, to_address, amount);
    res.json({ receipt });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
