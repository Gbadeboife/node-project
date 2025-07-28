const request = require('supertest');
const app = require('../app');
const { Product, Order, sequelize } = require('../models');
const StripeService = require('../services/StripeService');

// Mock Stripe service
jest.mock('../services/StripeService');

describe('Order Processing', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    // Clear database and mock data before each test
    await Product.destroy({ truncate: true, cascade: true });
    await Order.destroy({ truncate: true, cascade: true });
    jest.clearAllMocks();
  });

  describe('POST /create-checkout-session', () => {
    it('should create a checkout session for valid product', async () => {
      // Create test product
      const product = await Product.create({
        title: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        image: 'test.jpg'
      });

      // Mock Stripe session
      const mockSession = { id: 'test_session_id' };
      StripeService.createCheckoutSession.mockResolvedValue(mockSession);

      // Test the endpoint
      const response = await request(app)
        .post('/create-checkout-session')
        .send({ productId: product.id });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 'test_session_id');
      expect(StripeService.createCheckoutSession).toHaveBeenCalledWith(
        expect.objectContaining({ id: product.id }),
        expect.any(String)
      );
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .post('/create-checkout-session')
        .send({ productId: 999 });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should validate product ID', async () => {
      const response = await request(app)
        .post('/create-checkout-session')
        .send({ productId: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });

  describe('GET /order-success', () => {
    it('should process successful order', async () => {
      // Create test product
      const product = await Product.create({
        title: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        image: 'test.jpg'
      });

      // Mock successful payment processing
      const mockOrder = {
        id: 1,
        product_id: product.id,
        total: 99.99,
        status: 'paid'
      };
      const mockSession = { 
        payment_status: 'paid',
        amount_total: 9999
      };
      StripeService.processPayment.mockResolvedValue({ order: mockOrder, session: mockSession });

      // Test the endpoint
      const response = await request(app)
        .get('/order-success')
        .query({
          session_id: 'test_session_id',
          product_id: product.id
        });

      expect(response.status).toBe(200);
      expect(StripeService.processPayment).toHaveBeenCalledWith(
        'test_session_id',
        product.id.toString()
      );
    });

    it('should validate session ID and product ID', async () => {
      const response = await request(app)
        .get('/order-success')
        .query({
          session_id: '',
          product_id: 'invalid'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });
});
