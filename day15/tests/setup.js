const { sequelize } = require('../src/models');

// Global setup - runs once before all tests
beforeAll(async () => {
  // Sync database
  await sequelize.sync({ force: true });
});

// Global teardown - runs once after all tests
afterAll(async () => {
  // Close database connection
  await sequelize.close();
});
