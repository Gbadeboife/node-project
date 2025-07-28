const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const db = require('../models');
const { validateInput, handleValidationErrorForAPI } = require('../services/ValidationService');
const { errorHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Validation rules for creating a schedule
const scheduleValidation = validateInput({
  date: 'required|date',
  startTime: 'required|string',
  endTime: 'required|string',
  timezone: 'required|string'
}, {
  'date.required': 'Date is required',
  'startTime.required': 'Start time is required',
  'endTime.required': 'End time is required',
  'timezone.required': 'Timezone is required'
});

// Get all available schedules
router.get('/', async (req, res) => {
  try {
    const { timezone } = req.query;
    const today = moment().startOf('day');
    
    const schedules = await db.Schedule.findAll({
      where: {
        date: {
          [db.Sequelize.Op.gte]: today.toDate()
        },
        isAvailable: true
      },
      order: [
        ['date', 'ASC'],
        ['startTime', 'ASC']
      ]
    });

    res.json({
      success: true,
      data: schedules
    });
  } catch (error) {
    logger.error('Error fetching schedules:', error);
    errorHandler(error, req, res);
  }
});

// Create new schedule
router.post('/', scheduleValidation, handleValidationErrorForAPI, async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { date, startTime, endTime, timezone } = req.body;

    // Validate date is not in the past
    const scheduleDate = moment(date);
    if (scheduleDate.isBefore(moment().startOf('day'))) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot create schedule for past dates'
      });
    }

    const schedule = await db.Schedule.create({
      date,
      startTime,
      endTime,
      timezone,
      isAvailable: true
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error creating schedule:', error);
    errorHandler(error, req, res);
  }
});

// Get schedule by ID
router.get('/:id', async (req, res) => {
  try {
    const schedule = await db.Schedule.findByPk(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    logger.error('Error fetching schedule:', error);
    errorHandler(error, req, res);
  }
});

// Update schedule availability
router.patch('/:id/availability', async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { isAvailable } = req.body;
    const schedule = await db.Schedule.findByPk(req.params.id, { transaction });

    if (!schedule) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    await schedule.update({ isAvailable }, { transaction });
    await transaction.commit();

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error updating schedule availability:', error);
    errorHandler(error, req, res);
  }
});

module.exports = router;
