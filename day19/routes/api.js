const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const validate = require('../middleware/validate');

const scheduleValidation = [
  body('startTime')
    .isISO8601()
    .withMessage('Start time must be a valid date'),
  body('endTime')
    .isISO8601()
    .withMessage('End time must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startTime)) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),
  body('clientName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Client name must be at least 2 characters long')
];

router.post('/schedule', scheduleValidation, validate, scheduleController.createSchedule);
router.get('/booked', scheduleController.getAvailableTimes);

module.exports = router;
