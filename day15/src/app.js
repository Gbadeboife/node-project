const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const { errorHandler } = require('./middleware/errorHandler');
const treeRoutes = require('./routes/tree');
const logger = require('./utils/logger');

// Load environment variables from .env file
require('dotenv').config();

const app = express();

/**
 * Security Middleware Configuration
 * - helmet: Helps secure Express apps with various HTTP headers
 * - cors: Enables Cross-Origin Resource Sharing
 */
app.use(helmet());
app.use(cors());

/**
 * Rate Limiting Configuration
 * Protects against brute force attacks by limiting request frequency
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100 // limit each IP to 100 requests per window
});
app.use('/api', limiter);

/**
 * Request Parsing Middleware
 * Parses incoming requests with JSON payloads and URL-encoded bodies
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Development Logging
 * Uses Morgan to log HTTP requests in development environment
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * API Documentation Setup
 * Serves Swagger UI for API documentation
 */
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * API Routes
 * All tree-related routes are prefixed with /api/v1
 */
app.use('/api/v1', treeRoutes);

/**
 * 404 Handler
 * Catches requests to undefined routes
 */
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handling middleware
app.use(errorHandler);

/**
 * Graceful Shutdown Handler
 * Ensures proper cleanup when receiving SIGTERM signal
 */
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Closing HTTP server...');
  app.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app; 