const cron = require('node-cron');
const ShopifyService = require('../services/ShopifyService');
const logger = require('../services/LoggerService');

// Schedule cron job to run every hour
cron.schedule('0 * * * *', async () => {
    logger.info('Starting customer sync cron job');
    
    try {
        await ShopifyService.syncCustomers();
        logger.info('Customer sync cron job completed successfully');
    } catch (error) {
        logger.error('Customer sync cron job failed:', error);
    }
});
