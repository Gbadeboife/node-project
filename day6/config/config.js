// Configuration management for the application
require('dotenv').config();

module.exports = {
    // Database configuration
    database: {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    },
    
    // Shopify API configuration
    shopify: {
        apiKey: process.env.SHOPIFY_API_KEY,
        apiSecret: process.env.SHOPIFY_API_SECRET,
        shopName: process.env.SHOPIFY_SHOP_NAME,
        apiVersion: '2022-01'
    },

    // Logging configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || 'app.log'
    }
};
