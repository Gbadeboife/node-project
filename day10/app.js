require('dotenv').config(); // Load environment variables
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import custom modules
const logger = require('./config/logger');
const db = require('./models');
const { securityMiddleware, responseFormatter } = require('./middleware');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Day 10 API Documentation',
      version: '1.0.0',
      description: 'API documentation for Day 10 project'
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`
      }
    ]
  },
  apis: ['./routes/*.js'] // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Initialize express app
const app = express();
app.set('db', db);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// Apply security middleware
app.use(cors());
securityMiddleware.forEach(middleware => app.use(middleware));

// Apply basic middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Apply custom middleware
app.use(responseFormatter);

// API Documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

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
