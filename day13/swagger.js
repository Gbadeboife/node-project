const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API Documentation',
      version: '1.0.0',
      description: 'API documentation for the e-commerce application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the product
 *         title:
 *           type: string
 *           description: The product title
 *         description:
 *           type: string
 *           description: The product description
 *         image:
 *           type: string
 *           description: URL to the product image
 *         price:
 *           type: number
 *           description: The product price
 *     Order:
 *       type: object
 *       required:
 *         - product_id
 *         - total
 *         - stripe_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the order
 *         product_id:
 *           type: integer
 *           description: The id of the purchased product
 *         total:
 *           type: number
 *           description: The total amount paid
 *         stripe_id:
 *           type: string
 *           description: The Stripe session ID
 *         status:
 *           type: string
 *           enum: [paid, failed]
 *           description: The payment status
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /create-checkout-session:
 *   post:
 *     summary: Create a Stripe checkout session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID of the product to purchase
 *     responses:
 *       200:
 *         description: Checkout session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Stripe session ID
 *       404:
 *         description: Product not found
 */

const specs = swaggerJsdoc(options);
module.exports = specs; 