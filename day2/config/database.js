require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'day_2',
    host: process.env.DB_HOSTNAME || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_ADAPTER || 'mysql',
    logging: console.log,
    timezone: '-04:00',
    pool: {
      maxConnections: 1,
      minConnections: 0,
      maxIdleTime: 100,
    },
    define: {
      timestamps: false,
      underscoredAll: true,
      underscored: true,
    }
  },
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.TEST_DB_NAME || 'day_2_test',
    host: process.env.DB_HOSTNAME || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_ADAPTER || 'mysql',
    logging: false,
    pool: {
      maxConnections: 1,
      minConnections: 0,
      maxIdleTime: 100,
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'day_2',
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: process.env.DB_ADAPTER,
    logging: false,
    timezone: '-04:00',
    pool: {
      maxConnections: 5,
      minConnections: 1,
      maxIdleTime: 100,
    },
    define: {
      timestamps: false,
      underscoredAll: true,
      underscored: true,
    }
  }
}; 