const db = require('../models');

const clearDatabase = async () => {
  await db.Booking.destroy({ where: {} });
  await db.Schedule.destroy({ where: {} });
};

const createTestSchedule = async (data = {}) => {
  return await db.Schedule.create({
    date: '2025-07-25',
    startTime: '10:00:00',
    endTime: '11:00:00',
    timezone: 'America/New_York',
    isAvailable: true,
    ...data
  });
};

const createTestBooking = async (schedule, data = {}) => {
  return await db.Booking.create({
    scheduleId: schedule.id,
    fullName: 'Test User',
    email: 'test@example.com',
    company: 'Test Company',
    phone: '1234567890',
    status: 'pending',
    ...data
  });
};

module.exports = {
  clearDatabase,
  createTestSchedule,
  createTestBooking
};
