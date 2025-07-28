const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('Order API', () => {
  beforeAll(async () => {
    // Connect to test database
    await db.sequelize.authenticate();
  });

  beforeEach(async () => {
    // Clear database before each test
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close database connection
    await db.sequelize.close();
  });

  describe('GET /api/v1/order', () => {
    it('should return empty array when no orders exist', async () => {
      const response = await request(app).get('/api/v1/order');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return all orders', async () => {
      // Create test order
      const testOrder = await db.Order.create({
        customerName: 'Test Customer',
        orderDate: new Date(),
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 }
        ]
      }, {
        include: ['items']
      });

      const response = await request(app).get('/api/v1/order');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].customerName).toBe('Test Customer');
    });
  });

  describe('POST /api/v1/order', () => {
    it('should create new order with valid data', async () => {
      const orderData = {
        customerName: 'Test Customer',
        orderDate: new Date().toISOString(),
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 }
        ]
      };

      const response = await request(app)
        .post('/api/v1/order')
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.customerName).toBe(orderData.customerName);
      expect(response.body.data.items).toHaveLength(2);
    });

    it('should return validation error with invalid data', async () => {
      const invalidData = {
        customerName: '', // Empty name should fail validation
        orderDate: 'invalid-date',
        items: 'not-an-array'
      };

      const response = await request(app)
        .post('/api/v1/order')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /api/v1/order/:id', () => {
    let testOrder;

    beforeEach(async () => {
      testOrder = await db.Order.create({
        customerName: 'Original Name',
        orderDate: new Date(),
        items: [{ productId: 1, quantity: 1 }]
      }, {
        include: ['items']
      });
    });

    it('should update order with valid data', async () => {
      const updateData = {
        customerName: 'Updated Name',
        items: [
          { productId: 2, quantity: 3 }
        ]
      };

      const response = await request(app)
        .put(`/api/v1/order/${testOrder.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.customerName).toBe(updateData.customerName);
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .put('/api/v1/order/999999')
        .send({ customerName: 'New Name' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/order/:id', () => {
    let testOrder;

    beforeEach(async () => {
      testOrder = await db.Order.create({
        customerName: 'To Delete',
        orderDate: new Date()
      });
    });

    it('should delete existing order', async () => {
      const response = await request(app)
        .delete(`/api/v1/order/${testOrder.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify order is deleted
      const deletedOrder = await db.Order.findByPk(testOrder.id);
      expect(deletedOrder).toBeNull();
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .delete('/api/v1/order/999999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
}); 