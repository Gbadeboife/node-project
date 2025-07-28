const scheduleService = require('../services/scheduleService');
const logger = require('../config/logger');

class ScheduleController {
  async createSchedule(req, res) {
    try {
      const schedule = await scheduleService.createSchedule(req.body);
      res.status(201).json({
        error: false,
        message: 'Schedule created successfully',
        data: schedule
      });
    } catch (error) {
      logger.error('Error in createSchedule controller:', error);
      res.status(400).json({
        error: true,
        message: error.message || 'Failed to create schedule'
      });
    }
  }

  async getAvailableTimes(req, res) {
    try {
      const date = req.query.date || new Date();
      const availableTimes = await scheduleService.getAvailableTimes(date);
      res.status(200).json({
        error: false,
        message: 'Available times retrieved successfully',
        data: availableTimes
      });
    } catch (error) {
      logger.error('Error in getAvailableTimes controller:', error);
      res.status(400).json({
        error: true,
        message: error.message || 'Failed to get available times'
      });
    }
  }
}

module.exports = new ScheduleController();
