require('dotenv').config();

module.exports = {
  // Development environment database configuration
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'movie_db',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: console.log // Enable SQL query logging in development
  },

  // Test environment database configuration
  test: {
    username: process.env.TEST_DB_USER || 'root',
    password: process.env.TEST_DB_PASSWORD || 'root',
    database: process.env.TEST_DB_NAME || 'movie_db_test',
    host: process.env.TEST_DB_HOST || 'localhost',
    port: process.env.TEST_DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false // Disable logging in test environment
  },

  // Production environment database configuration
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false // Disable logging in production for better performance
  }
}; 