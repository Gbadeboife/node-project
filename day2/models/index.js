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
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];
const logger = require('../services/LoggerService');

let db = {};

// Create Sequelize instance with config
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Load all models
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set up model associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add sync function
db.sync = async (force = false) => {
  try {
    logger.info('Syncing database...');
    await sequelize.sync({ force });
    logger.info('Database sync completed');
  } catch (error) {
    logger.error('Database sync failed:', error);
    throw error;
  }
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;