require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'day3_db',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log
  },
  test: {
    username: process.env.DB_USER_TEST || 'root',
    password: process.env.DB_PASS_TEST,
    database: process.env.DB_NAME_TEST || 'day3_test',
    host: process.env.DB_HOST_TEST || 'localhost',
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
