const { sequelize } = require('../models');

beforeAll(async () => {
  // Ensure database connection is established
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
});

afterAll(async () => {
  // Close database connection
  await sequelize.close();
});

// Global test timeout
jest.setTimeout(10000); // 10 seconds
