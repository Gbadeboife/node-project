const express = require('express');
const router = express.Router();
const axios = require('axios');
const { shopifyUrl } = require('../services/shopifyService');

// GET /products
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 12;
  const url = `${shopifyUrl}/admin/api/2022-01/products.json?limit=${limit}&page=${page}`;
  try {
    const response = await axios.get(url);
    const products = response.data.products || [];
    res.render('products', { products, page });
  } catch (err) {
    res.status(500).send('Error fetching products: ' + err.message);
  }
});

module.exports = router; 