# Day 1 - Order Management API

This project implements a RESTful API for managing orders, shipping docks, and transactions.

## Features

- Order management (CRUD operations)
- Shipping dock management
- Transaction processing
- Input validation
- Database transactions
- Swagger API documentation
- Comprehensive test suite

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment files:

`.env` for development:
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=internship_day1
```

`.env.test` for testing:
```
NODE_ENV=test
PORT=3001
TEST_DB_HOST=localhost
TEST_DB_USER=root
TEST_DB_PASS=
TEST_DB_NAME=internship_day1_test
```

3. Create databases:
```sql
CREATE DATABASE internship_day1;
CREATE DATABASE internship_day1_test;
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Testing

Run tests:
```bash
npm test
```

Run tests with watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## API Documentation

Access Swagger documentation at:
```
http://localhost:3000/api-docs
```

### Available Endpoints

#### Orders

- `GET /api/v1/order` - Get all orders
- `GET /api/v1/order/:id` - Get order by ID
- `POST /api/v1/order` - Create new order
- `PUT /api/v1/order/:id` - Update order
- `DELETE /api/v1/order/:id` - Delete order

#### Shipping Docks

- `GET /api/v1/shipping_dock` - Get all shipping docks
- `GET /api/v1/shipping_dock/:id` - Get shipping dock by ID
- `POST /api/v1/shipping_dock` - Create new shipping dock
- `PUT /api/v1/shipping_dock/:id` - Update shipping dock
- `DELETE /api/v1/shipping_dock/:id` - Delete shipping dock

#### Transactions

- `GET /api/v1/transaction` - Get all transactions
- `GET /api/v1/transaction/:id` - Get transaction by ID
- `POST /api/v1/transaction` - Create new transaction
- `PUT /api/v1/transaction/:id` - Update transaction
- `DELETE /api/v1/transaction/:id` - Delete transaction

## Project Structure

```
.
├── app.js              # Application entry point
├── bin/
│   └── www            # Server startup script
├── config/
│   └── database.js    # Database configuration
├── models/            # Database models
├── routes/            # API routes
├── services/          # Business logic
├── tests/             # Test files
├── utils/             # Utility functions
└── views/             # View templates
```

## Best Practices Implemented

1. **Modular Code Structure**
   - Separate routes, models, and services
   - Clear separation of concerns

2. **Input Validation**
   - Comprehensive validation rules
   - Custom validation messages
   - Consistent error responses

3. **Database Transactions**
   - Atomic operations
   - Data consistency
   - Proper error handling and rollback

4. **API Response Structure**
   - Consistent response format
   - Proper error handling
   - Request ID tracking

5. **Security**
   - Environment-based configuration
   - Secure credential management
   - Input sanitization

6. **Testing**
   - Unit tests
   - Integration tests
   - High test coverage

7. **Documentation**
   - Swagger API documentation
   - Clear README
   - Code comments

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

This project is proprietary software. All rights reserved.
