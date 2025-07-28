// Set test environment
process.env.NODE_ENV = 'test';

// Load environment variables
require('dotenv').config({ path: '.env.test' });

// Mock console.error to keep test output clean
global.console.error = jest.fn();

// Global setup
global.beforeAll(async () => {
  // Add any global setup here
});

// Global teardown
global.afterAll(async () => {
  // Add any global cleanup here
}); 