const request = require('supertest');
const app = require('../../app');
const db = require('../../models');

describe('Report API Integration Tests', () => {
  beforeAll(async () => {
    // Sync database and create test data
    await db.sequelize.sync({ force: true });
    await createTestData();
  });

  afterAll(async () => {
    // Close database connection
    await db.sequelize.close();
  });

  describe('GET /api/v1/report/sale', () => {
    it('should return total sales for valid month and year', async () => {
      const response = await request(app)
        .get('/api/v1/report/sale')
        .query({ month: 1, year: 2022 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
    });

    it('should return validation error for invalid month', async () => {
      const response = await request(app)
        .get('/api/v1/report/sale')
        .query({ month: 13, year: 2022 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('GET /api/v1/report/monthly', () => {
    it('should return monthly sales for valid year', async () => {
      const response = await request(app)
        .get('/api/v1/report/monthly')
        .query({ year: 2022 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/report/user/count', () => {
    it('should return order count per month for valid user and year', async () => {
      const response = await request(app)
        .get('/api/v1/report/user/count')
        .query({ year: 2022, user_id: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(12); // All months
    });
  });
});

async function createTestData() {
  // Create test transactions
  await db.Transaction.bulkCreate([
    {
      order_id: 1,
      user_id: 1,
      shipping_dock_id: 1,
      amount: 100,
      created_at: '2022-01-01'
    },
    {
      order_id: 2,
      user_id: 1,
      shipping_dock_id: 1,
      amount: 200,
      created_at: '2022-02-01'
    }
  ]);

  // Create test orders
  await db.Order.bulkCreate([
    {
      user_id: 1,
      amount: 100,
      tax: 10,
      status: 1,
      created_at: '2022-01-01'
    },
    {
      user_id: 1,
      amount: 200,
      tax: 20,
      status: 1,
      created_at: '2022-02-01'
    }
  ]);
} 