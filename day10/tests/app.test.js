const request = require('supertest');
const app = require('../app');

describe('Basic Application Tests', () => {
  test('GET / should return 200', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200);
  });

  // Add more test cases as needed
});
