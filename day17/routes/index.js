const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');

// GET home page - Timezone selector
router.get('/', function(req, res, next) {
  const timezones = [
    {
      name: "USA/CANADA",
      zones: [
        { label: "Pacific Time", value: "America/Los_Angeles" },
        { label: "Mountain Time", value: "America/Denver" },
        { label: "Eastern Time", value: "America/New_York" },
        { label: "Atlantic Time", value: "America/Halifax" }
      ]
    },
    {
      name: "EUROPE",
      zones: [
        { label: "Berlin Time", value: "Europe/Berlin" },
        { label: "Helsinki Time", value: "Europe/Helsinki" },
        { label: "Dublin Time", value: "Europe/Dublin" },
        { label: "Samara Time", value: "Europe/Samara" }
      ]
    },
    // Add other regions similarly
  ];
  
  res.render('index', { timezones });
});

// GET calendar page
router.get('/calendar', function(req, res, next) {
  const moment = require('moment-timezone');
  const selectedTimezone = req.query.timezone || req.query.tz || undefined;

  // Get the next 7 days in the selected timezone
  const days = [];
  const now = selectedTimezone ? moment().tz(selectedTimezone) : moment();
  for (let i = 0; i < 7; i++) {
    const date = now.clone().add(i, 'days');
    days.push({
      date: date.format('YYYY-MM-DD'),
      displayDate: date.format('D'),
      weekday: date.format('ddd')
    });
  }

  // Generate time slots for each day (9:00 to 17:00) in the selected timezone
  const timeSlots = [];
  for (let hour = 9; hour < 17; hour++) {
    const row = [];
    for (let i = 0; i < 7; i++) {
      const slotTime = now.clone().add(i, 'days').hour(hour).minute(0).second(0);
      row.push({
        label: slotTime.format('h:mm A'),
        value: days[i].date + '-' + slotTime.format('HH:mm')
      });
    }
    timeSlots.push(row);
  }

  res.render('calendar', { days, timeSlots, selectedTimezone });
});

// GET form page
router.get('/form', function(req, res, next) {
  const scheduleId = req.query.scheduleId;
  res.render('form', { scheduleId });
});

// POST form submission
router.post('/submit', function(req, res, next) {
  // Handle form submission (you would typically save this to a database)
  const formData = req.body;
  // TODO: Save appointment data to database
  
  res.redirect('/confirmation');
});

// GET confirmation page
router.get('/confirmation', function(req, res, next) {
  res.render('confirmation');
});

module.exports = router;
