const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scheduling API',
      version: '1.0.0',
      description: 'API for managing schedules and appointments',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'], // files containing annotations
};

module.exports = swaggerJsdoc(options);
