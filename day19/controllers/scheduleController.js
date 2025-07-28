const scheduleService = require('../services/scheduleService');
const logger = require('../config/logger');
const { handleValidationErrorForAPI } = require('../services/ValidationService');

class ScheduleController {
  /**
   * Middleware to handle validation errors
   */
  handleValidationError(req, res, next) {
    return handleValidationErrorForAPI(req, res, next);
  }

  /**
   * Create a new schedule
   * @route POST /api/v1/schedule
   * @param {object} req.body - Schedule data
   * @param {string} req.body.startTime - Start time of the schedule
   * @param {string} req.body.endTime - End time of the schedule
   * @param {string} req.body.clientName - Name of the client
   */
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
      res.status(error.status || 500).json({
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
