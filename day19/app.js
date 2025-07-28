const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const db = require('./models');

// Import routes
const apiRouter = require('./routes/api');

const app = express();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/v1', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Initialize database
db.sequelize.sync()
  .then(() => {
    console.log('Database synced successfully');
    
    // Create default availability if none exists
    return db.Availability.count();
  })
  .then(count => {
    if (count === 0) {
      // Create default availability for Monday-Friday, 9 AM to 5 PM
      const defaultAvailability = [];
      for (let day = 1; day <= 5; day++) {
        defaultAvailability.push({
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00'
        });
      }
      return db.Availability.bulkCreate(defaultAvailability);
    }
  })
  .then(() => {
    console.log('Default availability created (if needed)');
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

module.exports = app;
