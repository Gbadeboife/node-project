// Suppress logger output during tests
const logger = require('./src/utils/logger');
logger.transports.forEach((t) => (t.silent = true));
