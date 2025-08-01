const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./services/LoggerService');
const swagger = require('./config/swagger');
const config = require('./config/config');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const db = require("./models");
db.sequelize.sync()
  .then(() => {
    logger.info('Database & tables created successfully');
  })
  .catch(err => {
    logger.error('Error syncing database:', err);
  });
var cors = require("cors");

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

// API Documentation
app.use('/api-docs', swagger.serve, swagger.setup);

// Routes
app.use('/', indexRouter);
app.use('/api/v1/user', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
