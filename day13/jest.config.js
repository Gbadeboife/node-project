module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/tests/**/*.test.js"
  ],

  // An array of regexp pattern strings that are matched against all test paths
  testPathIgnorePatterns: [
    "/node_modules/"
  ],

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['./tests/setup.js'],

  // The maximum amount of workers used to run your tests
  maxWorkers: "50%"
};
