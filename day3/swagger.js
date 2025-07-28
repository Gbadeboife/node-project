const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rules and Variables API',
      version: '1.0.0',
      description: 'API for managing rules and variables with condition evaluation'
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1'
      }
    ]
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
