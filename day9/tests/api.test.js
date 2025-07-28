const request = require('supertest');
const app = require('../app');

describe('API Endpoints', () => {
  describe('Authentication Middleware', () => {
    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile')
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No token provided');
    });
  });

  describe('Maintenance Mode', () => {
    it('should return 503 when maintenance mode is enabled', async () => {
      // This test assumes maintenance mode is enabled
      process.env.MAINTENANCE_MODE = 'true';
      
      const response = await request(app)
        .get('/api/v1/users/profile')
        .expect(503);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Service temporarily unavailable');
    });
  });
});
