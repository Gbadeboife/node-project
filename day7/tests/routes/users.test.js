const request = require('supertest');
const app = require('../app');
const db = require('../models');
const User = db.User;
const Web3Service = require('../services/Web3Service');

describe('User Routes', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await User.destroy({ where: {} });
  });

  describe('GET /api/v1/user', () => {
    it('should return all users', async () => {
      // Create test users
      await User.bulkCreate([
        { id: '1', name: 'Test User 1', wallet_id: '0x1234' },
        { id: '2', name: 'Test User 2', wallet_id: '0x5678' }
      ]);

      const response = await request(app)
        .get('/api/v1/user')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('POST /api/v1/user/:id', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        wallet_id: '0x' + '1'.repeat(40)
      };

      const response = await request(app)
        .post('/api/v1/user/1')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(userData.name);
    });

    it('should validate input', async () => {
      const response = await request(app)
        .post('/api/v1/user/1')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/v1/user/wallet', () => {
    it('should create a wallet for user', async () => {
      const response = await request(app)
        .post('/api/v1/user/wallet')
        .send({ name: 'Test User' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.privateKey).toBeDefined();
    });
  });
});
