const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('Rules API', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('GET /api/v1/rules', () => {
    it('should return all rules', async () => {
      const res = await request(app).get('/api/v1/rules');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/v1/rules/:id', () => {
    it('should create a new rule', async () => {
      const res = await request(app)
        .post('/api/v1/rules/1')
        .send({
          name: 'Test Rule',
          condition: 'a > 0',
          action: 'approved'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Rule');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/v1/rules/2')
        .send({
          name: 'Test Rule'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/evaluation', () => {
    it('should evaluate rules with given variables', async () => {
      // Create a test rule first
      await request(app)
        .post('/api/v1/rules/1')
        .send({
          name: 'Test Rule',
          condition: 'a > 0',
          action: 'approved'
        });

      const variables = {
        a: 1,
        b: 2
      };

      const base64Variables = Buffer.from(JSON.stringify(variables)).toString('base64');
      
      const res = await request(app)
        .get(`/api/v1/evaluation?variable=${base64Variables}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].result).toBe('approved');
    });
  });
});
