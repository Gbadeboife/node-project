const request = require('supertest');
const app = require('../app');
const { clearDatabase, createTestEmail } = require('./helpers');
const { Email } = require('../models');

describe('Email Controller', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    describe('GET /api/v1/email', () => {
        it('should return all emails', async () => {
            // Arrange
            const email = await createTestEmail();

            // Act
            const response = await request(app)
                .get('/api/v1/email')
                .expect(200);

            // Assert
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].id).toBe(email.id);
        });
    });

    describe('GET /api/v1/email/:id', () => {
        it('should return a single email', async () => {
            // Arrange
            const email = await createTestEmail();

            // Act
            const response = await request(app)
                .get(`/api/v1/email/${email.id}`)
                .expect(200);

            // Assert
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(email.id);
        });

        it('should return 404 for non-existent email', async () => {
            // Act
            const response = await request(app)
                .get('/api/v1/email/999999')
                .expect(404);

            // Assert
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Email not found');
        });
    });

    describe('POST /api/v1/email', () => {
        it('should create a new email', async () => {
            // Arrange
            const emailData = {
                slug: 'new-email',
                subject: 'New Subject',
                body: 'New Body with {{{NAME}}} and {{{EMAIL}}}',
                status: 'active'
            };

            // Act
            const response = await request(app)
                .post('/api/v1/email')
                .send(emailData)
                .expect(201);

            // Assert
            expect(response.body.success).toBe(true);
            expect(response.body.data.slug).toBe(emailData.slug);

            // Verify database
            const email = await Email.findByPk(response.body.data.id);
            expect(email).not.toBeNull();
            expect(email.slug).toBe(emailData.slug);
        });

        it('should validate required fields', async () => {
            // Act
            const response = await request(app)
                .post('/api/v1/email')
                .send({})
                .expect(400);

            // Assert
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Slug is required');
        });
    });

    describe('PUT /api/v1/email/:id', () => {
        it('should update an existing email', async () => {
            // Arrange
            const email = await createTestEmail();
            const updateData = {
                subject: 'Updated Subject'
            };

            // Act
            const response = await request(app)
                .put(`/api/v1/email/${email.id}`)
                .send(updateData)
                .expect(200);

            // Assert
            expect(response.body.success).toBe(true);
            expect(response.body.data.subject).toBe(updateData.subject);

            // Verify database
            const updatedEmail = await Email.findByPk(email.id);
            expect(updatedEmail.subject).toBe(updateData.subject);
        });
    });

    describe('DELETE /api/v1/email/:id', () => {
        it('should delete an email', async () => {
            // Arrange
            const email = await createTestEmail();

            // Act
            const response = await request(app)
                .delete(`/api/v1/email/${email.id}`)
                .expect(200);

            // Assert
            expect(response.body.success).toBe(true);

            // Verify database
            const deletedEmail = await Email.findByPk(email.id);
            expect(deletedEmail).toBeNull();
        });
    });
});
