const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scheduler API',
      version: '1.0.0',
      description: 'API documentation for the scheduling system',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Schedule: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Schedule unique identifier',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Date of the schedule',
            },
            startTime: {
              type: 'string',
              format: 'time',
              description: 'Start time of the slot',
            },
            endTime: {
              type: 'string',
              format: 'time',
              description: 'End time of the slot',
            },
            timezone: {
              type: 'string',
              description: 'Timezone of the schedule',
            },
            isAvailable: {
              type: 'boolean',
              description: 'Whether the slot is available',
            },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Booking unique identifier',
            },
            scheduleId: {
              type: 'integer',
              description: 'ID of the associated schedule',
            },
            fullName: {
              type: 'string',
              description: 'Full name of the person booking',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
            },
            company: {
              type: 'string',
              description: 'Company name',
            },
            phone: {
              type: 'string',
              description: 'Phone number',
            },
            notes: {
              type: 'string',
              description: 'Additional notes',
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'cancelled'],
              description: 'Booking status',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

module.exports = swaggerJsdoc(options);
