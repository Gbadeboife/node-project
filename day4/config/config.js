require('dotenv').config();

module.exports = {
    development: {
        database: {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            name: process.env.DB_NAME || 'day4_dev',
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres'
        },
        mailtrap: {
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS
            }
        },
        logging: {
            level: process.env.LOG_LEVEL || 'info',
            file: process.env.LOG_FILE || 'logs/app.log'
        }
    }
};
