const express = require('express');
const router = express.Router();
const { param, body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { Product, Order } = require('../models');
const StripeService = require('../services/StripeService');
const logger = require('../utils/logger');

// GET / - Display all products
// Renders the home page with a list of all available products
router.get('/', async function(req, res, next) {
  try {
    logger.info('Fetching all products');
    // Select only necessary fields to optimize query
    const products = await Product.findAll({
      attributes: ['id', 'title', 'description', 'image', 'price']
    });
    res.render('index', { 
      title: 'Products',
      products: products
    });
  } catch (error) {
    logger.error('Error fetching products:', error);
    next(error);
  }
});

// GET /product/:id - Display single product details
// Shows product information and checkout button
router.get('/product/:id', 
  // Validate that the ID parameter is a valid integer
  validate([
    param('id').isInt().withMessage('Invalid product ID')
  ]),
  async function(req, res, next) {
    try {
      logger.info('Fetching product details', { productId: req.params.id });
      // Eager load orders related to this product
      const product = await Product.findByPk(req.params.id, {
        include: [{
          model: Order,
          as: 'orders',
          attributes: ['id', 'total', 'status', 'createdAt']
        }]
      });
      
      if (!product) {
        logger.warn('Product not found', { productId: req.params.id });
        const error = new Error('Product not found');
        error.status = 404;
        throw error;
      }

      res.render('product', { 
        title: product.title,
        product: product,
        stripePublicKey: process.env.STRIPE_PUBLIC_KEY
      });
    } catch (error) {
      logger.error('Error fetching product details:', error);
      next(error);
    }
  }
);

// POST /create-checkout-session - Create Stripe checkout session
// Initiates the payment process for a product
router.post('/create-checkout-session',
  // Validate that the product ID is a valid integer
  validate([
    body('productId').isInt().withMessage('Invalid product ID')
  ]),
  async function(req, res, next) {
    try {
      logger.info('Creating checkout session', { productId: req.body.productId });
      const product = await Product.findByPk(req.body.productId);
      
      if (!product) {
        logger.warn('Product not found for checkout', { productId: req.body.productId });
        const error = new Error('Product not found');
        error.status = 404;
        throw error;
      }

      // Create Stripe checkout session with product details
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const session = await StripeService.createCheckoutSession(product, baseUrl);
      res.json({ id: session.id });
    } catch (error) {
      logger.error('Error creating checkout session:', error);
      next(error);
    }
  }
);

// GET /order-success - Handle successful payment
// Creates order record and shows thank you page
router.get('/order-success',
  // Validate query parameters
  validate([
    param('session_id').notEmpty().withMessage('Session ID is required'),
    param('product_id').isInt().withMessage('Invalid product ID')
  ]),
  async function(req, res, next) {
    try {
      logger.info('Processing successful order', {
        sessionId: req.query.session_id,
        productId: req.query.product_id
      });

      // Process the payment and create order record
      const { order, session } = await StripeService.processPayment(
        req.query.session_id,
        req.query.product_id
      );

      // Get product details for the thank you page
      const product = await Product.findByPk(order.product_id, {
        attributes: ['id', 'title', 'price', 'image']
      });

      res.render('order-success', {
        title: 'Thank you for your purchase',
        order: order,
        product: product
      });
    } catch (error) {
      logger.error('Error processing successful order:', error);
      next(error);
    }
  }
);

module.exports = router;
