require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'internship_day1',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: process.env.TEST_DB_USER || 'root',
    password: process.env.TEST_DB_PASS || 'root',
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
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key',
    expiresIn: '24h'
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY
  }
}; 