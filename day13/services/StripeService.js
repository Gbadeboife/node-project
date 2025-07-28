const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order, Product } = require('../models');
const logger = require('../utils/logger');
const TransactionUtil = require('../utils/transaction');
const ApiResponse = require('../utils/response');

/**
 * Service for handling Stripe payment operations
 */
class StripeService {
  /**
   * Create a Stripe checkout session for a product
   * @param {Object} product - The product to create checkout for
   * @param {string} baseUrl - Base URL for success/cancel redirects
   * @returns {Promise<Object>} Stripe checkout session
   */
  static async createCheckoutSession(product, baseUrl) {
    try {
      logger.info('Creating Stripe checkout session', { productId: product.id });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              description: product.description,
              images: [product.image],
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}&product_id=${product.id}`,
        cancel_url: `${baseUrl}/product/${product.id}`,
      });
      logger.info('Stripe checkout session created', { sessionId: session.id });
      return session;
    } catch (error) {
      logger.error('Stripe session creation failed:', error);
      throw new Error('Failed to create payment session');
    }
  }

  /**
   * Process payment after successful checkout
   * @param {string} sessionId - Stripe checkout session ID
   * @param {string} productId - ID of the product being purchased
   * @returns {Promise<Object>} Order and session details
   */
  static async processPayment(sessionId, productId) {
    return await TransactionUtil.withTransaction(async (transaction) => {
      logger.info('Processing payment', { sessionId, productId });
      
      // Verify the product exists
      const product = await Product.findByPk(productId, { transaction });
      if (!product) {
        throw new Error('Product not found');
      }

      // Retrieve session and payment details from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items']
      });
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

      // Create order record within transaction
      const order = await Order.create({
        product_id: productId,
        total: session.amount_total / 100, // Convert from cents
        stripe_id: sessionId,
        status: paymentIntent.status === 'succeeded' ? 'paid' : 'failed'
      }, { transaction });

      logger.info('Payment processed successfully', { 
        orderId: order.id,
        productId: product.id,
        amount: session.amount_total / 100
      });

      return { order, session };
    });
      throw new Error('Failed to process payment');
    }
  }
}

module.exports = StripeService; 