const winston = require('winston');
const config = require('../config/config');

// Configure winston logger
const logger = winston.createLogger({
    level: config.logging.level,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Write to console
        new winston.transports.Console(),
        // Write to file
        new winston.transports.File({ 
            filename: config.logging.file,
            level: 'error'
        })
    ]
});

module.exports = logger;
