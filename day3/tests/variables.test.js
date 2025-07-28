const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('Variables API', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('GET /api/v1/variables', () => {
    it('should return all variables', async () => {
      const res = await request(app).get('/api/v1/variables');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/v1/variables/:id', () => {
    it('should create a new variable', async () => {
      const res = await request(app)
        .post('/api/v1/variables/1')
        .send({
          name: 'testVar',
          type: 'INTEGER'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('testVar');
      expect(res.body.data.type).toBe('INTEGER');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/v1/variables/2')
        .send({
          name: 'testVar'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should validate type field values', async () => {
      const res = await request(app)
        .post('/api/v1/variables/3')
        .send({
          name: 'testVar',
          type: 'INVALID_TYPE'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/variables/:id', () => {
    it('should get a variable by id', async () => {
      // Create a test variable first
      await request(app)
        .post('/api/v1/variables/1')
        .send({
          name: 'testVar',
          type: 'INTEGER'
        });

      const res = await request(app).get('/api/v1/variables/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('testVar');
    });

    it('should return 404 for non-existent variable', async () => {
      const res = await request(app).get('/api/v1/variables/999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/v1/variables/:id', () => {
    it('should update an existing variable', async () => {
      // Create a test variable first
      await request(app)
        .post('/api/v1/variables/1')
        .send({
          name: 'testVar',
          type: 'INTEGER'
        });

      const res = await request(app)
        .put('/api/v1/variables/1')
        .send({
          name: 'updatedVar',
          type: 'STRING'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('updatedVar');
      expect(res.body.data.type).toBe('STRING');
    });

    it('should validate update data', async () => {
      const res = await request(app)
        .put('/api/v1/variables/1')
        .send({
          name: 'updatedVar',
          type: 'INVALID_TYPE'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/variables/:id', () => {
    it('should delete a variable', async () => {
      // Create a test variable first
      await request(app)
        .post('/api/v1/variables/1')
        .send({
          name: 'testVar',
          type: 'INTEGER'
        });

      const res = await request(app).delete('/api/v1/variables/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Variable deleted successfully');

      // Verify deletion
      const getRes = await request(app).get('/api/v1/variables/1');
      expect(getRes.statusCode).toBe(404);
    });

    it('should return 404 for non-existent variable', async () => {
      const res = await request(app).delete('/api/v1/variables/999');
      expect(res.statusCode).toBe(404);
    });
  });
});
