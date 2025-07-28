const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('Users API', () => {
  beforeAll(async () => {
    await db.sequelize.authenticate();
  });

  beforeEach(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('GET /users', () => {
    it('should return users page', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toBe(200);
      expect(response.type).toMatch(/html/);
    });
  });
}); 