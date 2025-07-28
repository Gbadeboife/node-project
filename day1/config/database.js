require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root', // Change this to your MySQL root password
    database: process.env.DB_NAME || 'internship_day1',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: process.env.TEST_DB_USER || 'root',
    password: process.env.TEST_DB_PASS || 'root', // Change this to your MySQL root password
    database: process.env.TEST_DB_NAME || 'internship_day1_test',
    host: process.env.TEST_DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
}; 