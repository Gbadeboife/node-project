module.exports = {
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'routes/**/*.js',
    'services/**/*.js',
    'models/**/*.js',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
