const { Sequelize } = require('sequelize');
const config = require('./config/database')[process.env.NODE_ENV || 'development'];
const logger = require('./config/logger');

async function initializeDatabase() {
  // First try to connect to postgres to create the database if it doesn't exist
  const rootSequelize = new Sequelize('postgres', config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false
  });

  try {
    // Try to create the database if it doesn't exist
    await rootSequelize.query(`CREATE DATABASE "${config.database}";`);
    logger.info(`Database ${config.database} created successfully`);
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError' && error.parent.code === '42P04') {
      logger.info(`Database ${config.database} already exists`);
    } else {
      logger.error('Error creating database:', error);
      throw error;
    }
  } finally {
    await rootSequelize.close();
  }

  // Now connect to the actual database
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false
  });

  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    
    // Import models
    const Schedule = require('./models/schedule');
    const Availability = require('./models/availability');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    logger.info('Database tables synced successfully');

    // Create default availability if none exists
    const availabilityCount = await Availability.count();
    if (availabilityCount === 0) {
      // Create default availability for Monday-Friday, 9 AM to 5 PM
      const defaultAvailability = [];
      for (let day = 1; day <= 5; day++) {
        defaultAvailability.push({
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00'
        });
      }
      await Availability.bulkCreate(defaultAvailability);
      logger.info('Created default availability');
    }

    return sequelize;
  } catch (error) {
    logger.error('Database initialization error:', error);
    throw error;
  }
}

module.exports = initializeDatabase;
