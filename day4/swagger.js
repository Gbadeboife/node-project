const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Email Queue API',
            version: '1.0.0',
            description: 'API documentation for the Email Queue system'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'User ID'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address'
                        },
                        name: {
                            type: 'string',
                            description: 'User full name'
                        },
                        status: {
                            type: 'string',
                            enum: ['active', 'inactive'],
                            description: 'User status'
                        }
                    }
                },
                Email: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Email template ID'
                        },
                        slug: {
                            type: 'string',
                            description: 'Unique identifier for the email template'
                        },
                        subject: {
                            type: 'string',
                            description: 'Email subject line'
                        },
                        body: {
                            type: 'string',
                            description: 'Email body template with variables {{{NAME}}} and {{{EMAIL}}}'
                        },
                        status: {
                            type: 'string',
                            enum: ['active', 'inactive'],
                            description: 'Email template status'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js'] // Path to the API routes
};

module.exports = swaggerJsdoc(options);
