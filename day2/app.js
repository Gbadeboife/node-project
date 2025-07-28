const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const orderRouter = require('./routes/order');
const reportRouter = require('./routes/report');

// Database
const db = require('./models');

const app = express();

// Set up database
app.set('db', db);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(requestLogger);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/report', reportRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use(errorHandler);

// Sync database on startup
db.sync()
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((err) => {
    console.error('Database sync failed:', err);
  });

module.exports = app;
