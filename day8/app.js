// Import required dependencies
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const winston = require('winston');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Import database connection
const db = require("./models");
const cors = require("cors");

// Configure winston logger
const log = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quiz API',
      version: '1.0.0',
      description: 'API for managing quizzes and questions'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./routes/*.js']
};

// Initialize Express app
const app = express();
app.set("db", db);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Initialize Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware setup
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Request logging middleware
app.use((req, res, next) => {
  log.info({
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body
  });
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404 handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Global error handler
app.use(function (err, req, res, next) {
  // Log error
  log.error({
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // API error response
  if (req.xhr || req.path.startsWith('/api')) {
    return res.status(err.status || 500).json({
      success: false,
      error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Web error response
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
