module.exports = {
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/config/', '/public/'],
  setupFilesAfterEnv: ['./tests/setup.js']
};
