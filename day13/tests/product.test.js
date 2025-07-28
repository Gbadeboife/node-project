const request = require('supertest');
const app = require('../app');
const { Product, Order, sequelize } = require('../models');

describe('Product API', () => {
  beforeAll(async () => {
    // Clear database and run migrations
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    // Clear all tables before each test
    await Product.destroy({ truncate: true, cascade: true });
    await Order.destroy({ truncate: true, cascade: true });
  });

  describe('GET /', () => {
    it('should return all products', async () => {
      // Create test products
      await Product.bulkCreate([
        {
          title: 'Test Product 1',
          description: 'Description 1',
          price: 99.99,
          image: 'image1.jpg'
        },
        {
          title: 'Test Product 2',
          description: 'Description 2',
          price: 149.99,
          image: 'image2.jpg'
        }
      ]);

      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Test Product 1');
      expect(response.text).toContain('Test Product 2');
    });
  });

  describe('GET /product/:id', () => {
    it('should return product details', async () => {
      const product = await Product.create({
        title: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        image: 'test.jpg'
      });

      const response = await request(app).get(`/product/${product.id}`);
      expect(response.status).toBe(200);
      expect(response.text).toContain('Test Product');
      expect(response.text).toContain('99.99');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app).get('/product/999');
      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid product ID', async () => {
      const response = await request(app).get('/product/invalid');
      expect(response.status).toBe(400);
    });
  });

  describe('POST /create-checkout-session', () => {
    it('should create a Stripe checkout session', async () => {
      const product = await Product.create({
        title: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        image: 'test.jpg'
      });

      const response = await request(app)
        .post('/create-checkout-session')
        .send({ productId: product.id });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .post('/create-checkout-session')
        .send({ productId: 999 });

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid product ID', async () => {
      const response = await request(app)
        .post('/create-checkout-session')
        .send({ productId: 'invalid' });

      expect(response.status).toBe(400);
    });
  });
}); 