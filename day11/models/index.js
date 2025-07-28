'use strict';
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2020*/
/**
 * Sequelize File
 * @copyright 2020 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];
const logger = require('../core/logger');

let db = {};

// Initialize Sequelize with database configuration
let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    pool: {
      max: 5,      // Maximum number of connection in pool
      min: 0,      // Minimum number of connection in pool
      acquire: 30000, // Maximum time (ms) that pool will try to get connection before throwing error
      idle: 10000  // Maximum time (ms) that a connection can be idle before being released
    }
  }
);

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    logger.info('Database connection established successfully.');
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
  });

// Import all model files from current directory
fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach(file => {
    // Initialize model with Sequelize instance
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Set up model associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach sequelize instance and class to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;