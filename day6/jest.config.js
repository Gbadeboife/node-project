module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'node',
  
  // The glob patterns Jest uses to detect test files
  testMatch: ['**/tests/**/*.test.js'],
  
  // Coverage reporting configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  
  // Setup files to run before each test
  setupFiles: ['./jest.setup.js']
};
