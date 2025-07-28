const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const TransactionService = require('../services/TransactionService');

describe('Authentication Service', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Login', () => {
    it('should successfully log in with valid credentials', async () => {
      // Create test user
      const testUser = await TransactionService.executeTransaction(async (t) => {
        const credential = await sequelize.models.credential.create({
          email: 'test@example.com',
          password: 'hashedPassword123',
          status: 1
        }, { transaction: t });

        return await sequelize.models.user.create({
          first_name: 'Test',
          last_name: 'User',
          credential_id: credential.id
        }, { transaction: t });
      });

      const response = await request(app)
        .post('/graphql')
        .send({
          query: `
            mutation {
              login(input: {
                email: "test@example.com"
                password: "password123"
              }) {
                success
                token
                user {
                  id
                  firstName
                  lastName
                }
              }
            }
          `
        });

      expect(response.status).toBe(200);
      expect(response.body.data.login.success).toBe(true);
      expect(response.body.data.login.token).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/graphql')
        .send({
          query: `
            mutation {
              login(input: {
                email: "wrong@example.com"
                password: "wrongpass"
              }) {
                success
                error {
                  code
                  message
                }
              }
            }
          `
        });

      expect(response.status).toBe(200);
      expect(response.body.data.login.success).toBe(false);
      expect(response.body.data.login.error.code).toBe('INVALID_CREDENTIALS');
    });
  });
});
