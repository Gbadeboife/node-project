var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerUi = require('swagger-ui-express');
var swaggerSpec = require('./swagger');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const db = require("./models");
var cors = require("cors");

var app = express();
app.set("db", db);

// Load environment variables
require('dotenv').config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add request ID middleware
app.use((req, res, next) => {
  res.locals.requestId = require('crypto').randomBytes(16).toString('hex');
  next();
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/shipping_dock', require('./routes/shipping_dock'));
app.use('/api/v1/order', require('./routes/order'));
app.use('/api/v1/transaction', require('./routes/transaction'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Log error
  console.error(`[Error] ${err.stack}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
