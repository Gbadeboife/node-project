const { validationResult } = require('express-validator');
const moment = require('moment-timezone');

exports.validateBookingData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.validateTimezone = (req, res, next) => {
  const { timezone } = req.body;
  if (!timezone || !moment.tz.zone(timezone)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid timezone'
    });
  }
  next();
};
