const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { validateInput } = require('../services/ValidationService');

// Validation rules for schedule creation
const scheduleValidation = {
  startTime: 'required|date',
  endTime: 'required|date|after:startTime',
  clientName: 'required|string|minLength:2'
};

// Custom validation messages
const validationMessages = {
  'startTime.required': 'Start time is required',
  'startTime.date': 'Start time must be a valid date',
  'endTime.required': 'End time is required',
  'endTime.date': 'End time must be a valid date',
  'endTime.after': 'End time must be after start time',
  'clientName.required': 'Client name is required',
  'clientName.string': 'Client name must be a string',
  'clientName.minLength': 'Client name must be at least 2 characters long'
};

router.post('/schedule', 
  validateInput(scheduleValidation, validationMessages),
  scheduleController.handleValidationError,
  scheduleController.createSchedule);
router.get('/booked', scheduleController.getAvailableTimes);

module.exports = router;
