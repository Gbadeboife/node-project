const request = require('supertest');
const app = require('../app');
const { Schedule, Availability } = require('../models');

describe('Scheduling API', () => {
  beforeEach(async () => {
    await Schedule.destroy({ where: {} });
    await Availability.destroy({ where: {} });
    
    // Create test availability
    await Availability.create({
      dayOfWeek: 1, // Monday
      startTime: '09:00',
      endTime: '17:00'
    });
  });

  describe('POST /api/v1/schedule', () => {
    it('should create a new schedule', async () => {
      const response = await request(app)
        .post('/api/v1/schedule')
        .send({
          startTime: '2025-07-28T10:00:00Z', // A Monday
          endTime: '2025-07-28T11:00:00Z',
          clientName: 'Test Client'
        });

      expect(response.status).toBe(201);
      expect(response.body.error).toBe(false);
      expect(response.body.data).toHaveProperty('id');
    });

    it('should reject invalid schedule times', async () => {
      const response = await request(app)
        .post('/api/v1/schedule')
        .send({
          startTime: '2025-07-28T11:00:00Z',
          endTime: '2025-07-28T10:00:00Z', // End time before start time
          clientName: 'Test Client'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(true);
    });
  });

  describe('GET /api/v1/booked', () => {
    it('should return available time slots', async () => {
      const response = await request(app)
        .get('/api/v1/booked')
        .query({ date: '2025-07-28' }); // A Monday

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
