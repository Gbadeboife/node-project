const db = require('../models');
const logger = require('../services/LoggerService');

// Increase test timeout
jest.setTimeout(30000);

// Suppress logging during tests
logger.logger.silent = true;

// Global setup
beforeAll(async () => {
  try {
    // Connect to test database and sync
    await db.sync(true);
  } catch (error) {
    console.error('Test setup failed:', error);
    throw error;
  }
});

// Global teardown
afterAll(async () => {
  try {
    // Close database connection
    await db.sequelize.close();
  } catch (error) {
    console.error('Test teardown failed:', error);
    throw error;
  }
}); 