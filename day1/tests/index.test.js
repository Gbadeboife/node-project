const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('Index Routes', () => {
  beforeAll(async () => {
    await db.sequelize.authenticate();
  });

  beforeEach(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('GET /', () => {
    it('should return index page', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.type).toMatch(/html/);
    });
  });

  describe('GET /api-docs', () => {
    it('should return Swagger documentation', async () => {
      const response = await request(app).get('/api-docs/');
      expect(response.status).toBe(301); // Redirects to /api-docs/
    });
  });
}); 