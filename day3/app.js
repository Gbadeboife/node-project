const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Import routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const rulesRouter = require('./routes/rule');
const variablesRouter = require('./routes/variable');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import database
const db = require('./models');

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Add request ID to each request
app.use((req, res, next) => {
  req.requestId = require('crypto').randomBytes(16).toString('hex');
  next();
});

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/rules', rulesRouter);
app.use('/api/v1/variables', variablesRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
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
