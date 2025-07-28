const request = require('supertest');
const app = require('../app');
const db = require('../models');
const { clearDatabase, createTestSchedule, createTestBooking } = require('./helpers');

describe('Booking API', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /bookings', () => {
    it('should create a new booking', async () => {
      const bookingData = {
        scheduleId: schedule.id,
        fullName: 'John Doe',
        email: 'john@example.com',
        company: 'Test Co',
        phone: '1234567890',
        notes: 'Test booking'
      };

      const response = await request(app)
        .post('/bookings')
        .send(bookingData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.fullName).toBe(bookingData.fullName);

      // Verify schedule is no longer available
      const updatedSchedule = await db.Schedule.findByPk(schedule.id);
      expect(updatedSchedule.isAvailable).toBe(false);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/bookings')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /bookings/:id', () => {
    it('should return a booking by id', async () => {
      const booking = await db.Booking.create({
        scheduleId: schedule.id,
        fullName: 'John Doe',
        email: 'john@example.com',
        company: 'Test Co',
        phone: '1234567890'
      });

      const response = await request(app)
        .get(`/bookings/${booking.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(booking.id);
    });

    it('should return 404 for non-existent booking', async () => {
      const response = await request(app)
        .get('/bookings/999999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
