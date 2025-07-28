const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Internship Day 1 API',
      version: '1.0.0',
      description: 'API documentation for the Internship Day 1 project',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Order ID',
            },
            customerName: {
              type: 'string',
              description: 'Name of the customer',
            },
            orderDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date when the order was placed',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: {
                    type: 'integer',
                    description: 'ID of the product',
                  },
                  quantity: {
                    type: 'integer',
                    description: 'Quantity ordered',
                    minimum: 1,
                  },
                },
              },
            },
          },
        },
        ShippingDock: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Shipping Dock ID',
            },
            name: {
              type: 'string',
              description: 'Name of the shipping dock',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'maintenance'],
              description: 'Current status of the shipping dock',
            },
            capacity: {
              type: 'integer',
              description: 'Maximum capacity of the shipping dock',
              minimum: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Transaction ID'
            },
            orderId: {
              type: 'integer',
              description: 'Associated order ID'
            },
            amount: {
              type: 'number',
              description: 'Transaction amount',
              minimum: 0
            },
            type: {
              type: 'string',
              enum: ['payment', 'refund', 'adjustment'],
              description: 'Type of transaction'
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'failed'],
              description: 'Current status of the transaction'
            },
            description: {
              type: 'string',
              maxLength: 255,
              description: 'Optional transaction description'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          },
          required: ['orderId', 'amount', 'type', 'status']
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            requestId: {
              type: 'string',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
                stack: {
                  type: 'string',
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            requestId: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

module.exports = swaggerJsdoc(options); 