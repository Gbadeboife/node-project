const { sequelize } = require('../models');

const testHelpers = {
    // Clear all test data before each test
    async clearDatabase() {
        const tables = Object.keys(sequelize.models);
        for (const table of tables) {
            await sequelize.models[table].destroy({ truncate: true, cascade: true });
        }
    },

    // Create test data
    async createTestUser(overrides = {}) {
        const { User } = require('../models');
        return User.create({
            email: 'test@example.com',
            name: 'Test User',
            status: 'active',
            ...overrides
        });
    },

    async createTestEmail(overrides = {}) {
        const { Email } = require('../models');
        return Email.create({
            slug: 'test-email',
            subject: 'Test Subject',
            body: 'Test Body with {{{NAME}}} and {{{EMAIL}}}',
            status: 'active',
            ...overrides
        });
    },

    async createTestEmailQueue(overrides = {}) {
        const { EmailQueue } = require('../models');
        const user = await this.createTestUser();
        const email = await this.createTestEmail();
        return EmailQueue.create({
            email_id: email.id,
            user_id: user.id,
            status: 'not sent',
            send_at: new Date(),
            ...overrides
        });
    }
};

module.exports = testHelpers;
