const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Model-Controller Builder API',
      version: '1.0.0',
      description: 'API documentation for the dynamically generated endpoints',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./release/controllers/*.js'], // Path to the API controllers
};

const specs = swaggerJsdoc(options);

module.exports = specs; 