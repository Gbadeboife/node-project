'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];
const db = {};

let sequelize;
try {
  if (env === 'test') {
    // For test environment, use a separate configuration
    sequelize = new Sequelize({
      dialect: 'mysql',
      host: process.env.TEST_DB_HOST || 'localhost',
      username: process.env.TEST_DB_USER || 'root',
      password: process.env.TEST_DB_PASS || '',  // Try empty password first
      database: process.env.TEST_DB_NAME || 'internship_day1_test',
      logging: false,
      define: {
        timestamps: true,
        underscored: true,
      }
    });
  } else {
    // For development and production
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        ...config,
        define: {
          timestamps: true,
          underscored: true,
        }
      }
    );
  }
} catch (err) {
  console.error('Unable to connect to the database:', err);
}

// Load models
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;