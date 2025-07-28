const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('Transaction API', () => {
  let testOrder;

  beforeAll(async () => {
    await db.sequelize.authenticate();
  });

  beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    // Create a test order for transaction tests
    testOrder = await db.Order.create({
      customerName: 'Test Customer',
      orderDate: new Date()
    });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('GET /api/v1/transaction', () => {
    it('should return empty array when no transactions exist', async () => {
      const response = await request(app).get('/api/v1/transaction');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return all transactions', async () => {
      const testTransaction = await db.Transaction.create({
        orderId: testOrder.id,
        amount: 100.50,
        type: 'payment',
        status: 'completed'
      });

      const response = await request(app).get('/api/v1/transaction');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].amount).toBe(100.50);
    });
  });

  describe('POST /api/v1/transaction', () => {
    it('should create new transaction with valid data', async () => {
      const transactionData = {
        orderId: testOrder.id,
        amount: 150.75,
        type: 'payment',
        status: 'pending',
        description: 'Test payment'
      };

      const response = await request(app)
        .post('/api/v1/transaction')
        .send(transactionData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.amount).toBe(150.75);
      expect(response.body.data.type).toBe('payment');
    });

    it('should return validation error with invalid data', async () => {
      const invalidData = {
        orderId: 'not-a-number',
        amount: -50, // Negative amount
        type: 'invalid-type',
        status: 'invalid-status'
      };

      const response = await request(app)
        .post('/api/v1/transaction')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 404 when referenced order does not exist', async () => {
      const transactionData = {
        orderId: 999999,
        amount: 150.75,
        type: 'payment',
        status: 'pending'
      };

      const response = await request(app)
        .post('/api/v1/transaction')
        .send(transactionData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Referenced order not found');
    });
  });

  describe('PUT /api/v1/transaction/:id', () => {
    let testTransaction;

    beforeEach(async () => {
      testTransaction = await db.Transaction.create({
        orderId: testOrder.id,
        amount: 100.00,
        type: 'payment',
        status: 'pending'
      });
    });

    it('should update transaction with valid data', async () => {
      const updateData = {
        amount: 200.00,
        status: 'completed',
        description: 'Updated payment'
      };

      const response = await request(app)
        .put(`/api/v1/transaction/${testTransaction.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.amount).toBe(200.00);
      expect(response.body.data.status).toBe('completed');
    });

    it('should return validation error with invalid data', async () => {
      const invalidData = {
        amount: -100,
        status: 'invalid-status'
      };

      const response = await request(app)
        .put(`/api/v1/transaction/${testTransaction.id}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 404 for non-existent transaction', async () => {
      const response = await request(app)
        .put('/api/v1/transaction/999999')
        .send({ amount: 150.00, status: 'completed' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/transaction/:id', () => {
    let testTransaction;

    beforeEach(async () => {
      testTransaction = await db.Transaction.create({
        orderId: testOrder.id,
        amount: 100.00,
        type: 'payment',
        status: 'pending'
      });
    });

    it('should delete existing transaction', async () => {
      const response = await request(app)
        .delete(`/api/v1/transaction/${testTransaction.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify transaction is deleted
      const deletedTransaction = await db.Transaction.findByPk(testTransaction.id);
      expect(deletedTransaction).toBeNull();
    });

    it('should return 404 for non-existent transaction', async () => {
      const response = await request(app)
        .delete('/api/v1/transaction/999999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
}); 