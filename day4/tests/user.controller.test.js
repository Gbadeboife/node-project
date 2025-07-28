const request = require('supertest');
const app = require('../app');
const { clearDatabase, createTestUser } = require('./helpers');
const { User } = require('../models');

describe('User Controller', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    describe('GET /api/v1/user', () => {
        it('should return all users', async () => {
            // Arrange
            const user = await createTestUser();

            // Act
            const response = await request(app)
                .get('/api/v1/user')
                .expect(200);

            // Assert
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].id).toBe(user.id);
        });
    });

    describe('POST /api/v1/user', () => {
        it('should create a new user', async () => {
            // Arrange
            const userData = {
                email: 'new@example.com',
                name: 'New User',
                status: 'active'
            };

            // Act
            const response = await request(app)
                .post('/api/v1/user')
                .send(userData)
                .expect(201);

            // Assert
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe(userData.email);

            // Verify database
            const user = await User.findByPk(response.body.data.id);
            expect(user).not.toBeNull();
            expect(user.email).toBe(userData.email);
        });

        it('should validate email format', async () => {
            // Arrange
            const userData = {
                email: 'invalid-email',
                name: 'New User',
                status: 'active'
            };

            // Act
            const response = await request(app)
                .post('/api/v1/user')
                .send(userData)
                .expect(400);

            // Assert
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Invalid email format');
        });
    });

    // Add more test cases for other endpoints...
});
