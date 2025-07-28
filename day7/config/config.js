require('dotenv').config();

module.exports = {
  // Database configuration
  database: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false
  },

  // Web3 configuration
  web3: {
    providerUrl: process.env.WEB3_PROVIDER_URL,
    network: process.env.WEB3_NETWORK || 'testnet'
  },

  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  }
};
