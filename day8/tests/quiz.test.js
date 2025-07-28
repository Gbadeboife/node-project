const request = require('supertest');
const app = require('../app');
const db = require('../models');

beforeAll(async () => {
  // Sync database before tests
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection after tests
  await db.sequelize.close();
});

describe('Quiz API', () => {
  describe('GET /api/quiz', () => {
    it('should return all quizzes', async () => {
      const res = await request(app)
        .get('/api/quiz')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });
});
