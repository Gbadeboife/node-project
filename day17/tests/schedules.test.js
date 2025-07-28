const request = require('supertest');
const app = require('../app');
const { clearDatabase, createTestSchedule } = require('./helpers');
const moment = require('moment-timezone');

describe('Schedule API', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('GET /schedules', () => {
    it('should return empty list when no schedules exist', async () => {
      const response = await request(app).get('/schedules');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return only future available schedules', async () => {
      // Create a past schedule
      await createTestSchedule({
        date: moment().subtract(1, 'day').format('YYYY-MM-DD')
      });

      // Create a future schedule
      const futureSchedule = await createTestSchedule({
        date: moment().add(1, 'day').format('YYYY-MM-DD')
      });

      const response = await request(app).get('/schedules');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].id).toBe(futureSchedule.id);
    });
  });

  describe('POST /schedules', () => {
    it('should create a new schedule', async () => {
      const scheduleData = {
        date: '2025-07-25',
        startTime: '10:00:00',
        endTime: '11:00:00',
        timezone: 'America/New_York'
      };

      const response = await request(app)
        .post('/schedules')
        .send(scheduleData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.date).toBe(scheduleData.date);
      expect(response.body.data.isAvailable).toBe(true);
    });

    it('should not create schedule in the past', async () => {
      const response = await request(app)
        .post('/schedules')
        .send({
          date: moment().subtract(1, 'day').format('YYYY-MM-DD'),
          startTime: '10:00:00',
          endTime: '11:00:00',
          timezone: 'America/New_York'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/schedules')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PATCH /schedules/:id/availability', () => {
    it('should update schedule availability', async () => {
      const schedule = await createTestSchedule();

      const response = await request(app)
        .patch(`/schedules/${schedule.id}/availability`)
        .send({ isAvailable: false });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isAvailable).toBe(false);
    });

    it('should return 404 for non-existent schedule', async () => {
      const response = await request(app)
        .patch('/schedules/999999/availability')
        .send({ isAvailable: false });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
