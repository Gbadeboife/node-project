const express = require('express');
const router = express.Router();
const axios = require('axios');
const { shopifyUrl } = require('../services/shopifyService');
const logger = require('../services/LoggerService');
const { validateInput, handleValidationErrorForViews } = require('../services/ValidationService');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Display paginated list of products
 *     description: Retrieves products from Shopify API and displays them in a paginated grid
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 12
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Products page rendered successfully
 *       400:
 *         description: Invalid pagination parameters
 *       500:
 *         description: Server error while fetching products
 */
router.get('/', [
  // Validate input parameters
  validateInput({
    page: 'integer|min:1',
    limit: 'integer|min:1|max:50'
  }),

  async (req, res) => {
    // Handle validation errors
    const viewModel = {
      products: [],
      page: 1,
      limit: 12,
      error: null
    };

    if (req.validationError) {
      logger.warn('Invalid pagination parameters:', req.validationError);
      viewModel.error = 'Invalid pagination parameters';
      return res.status(400).render('products', viewModel);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const url = `${shopifyUrl}/admin/api/2022-01/products.json?limit=${limit}&page=${page}`;

    try {
      logger.info(`Fetching products page ${page} with limit ${limit}`);
      const response = await axios.get(url);
      viewModel.products = response.data.products || [];
      viewModel.page = page;
      viewModel.limit = limit;
      
      logger.info(`Successfully fetched ${viewModel.products.length} products`);
      res.render('products', viewModel);
    } catch (err) {
      logger.error('Error fetching products:', err);
      viewModel.error = 'Error fetching products. Please try again later.';
      res.status(500).render('products', viewModel);
    }
  }
]);

module.exports = router; 