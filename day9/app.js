require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./config/logger');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const standardResponse = require('./middleware/responseHandler');

const db = require("./models");
var cors = require("cors");
// Import maintenance and authentication middlewares
const Maintenance = require('./services/Maintenance');
const AuthMiddleware = require('./services/AuthMiddleware');

var app = express();
app.set("db", db);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// Apply maintenance middleware to all API routes
app.use('/api', Maintenance);
// Apply authentication middleware to all API routes
app.use('/api', AuthMiddleware);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // Log error for monitoring
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // If API request, return JSON error
  if (req.originalUrl.startsWith('/api')) {
    const statusCode = err.status || 500;
    const message = statusCode === 500 && process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message;
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'An error occurred',
      error: req.app.get('env') === 'development' ? err : undefined
    });
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
