const request = require('supertest');
const app = require('../app');
const { clearDatabase, createTestEmailQueue } = require('./helpers');
const { EmailQueue } = require('../models');

describe('Email Queue', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    describe('Cronjob: email_queue.js', () => {
        it('should create email queue entries correctly', async () => {
            // This would test the email queue creation logic
            const EmailQueueCronJob = require('../cronjobs/email_queue');
            
            // Run the cron job
            await EmailQueueCronJob.run();

            // Verify queue entries were created
            const queueEntries = await EmailQueue.findAll();
            expect(queueEntries.length).toBeGreaterThan(0);
        });
    });

    describe('Cronjob: email_sending.js', () => {
        it('should process queued emails correctly', async () => {
            // Create a test queue entry
            const queueEntry = await createTestEmailQueue({
                send_at: new Date()
            });

            const EmailSendingCronJob = require('../cronjobs/email_sending');
            
            // Mock the email sending function
            const mockSendMail = jest.fn().mockResolvedValue(true);
            EmailSendingCronJob.getTransporter = jest.fn().mockReturnValue({
                sendMail: mockSendMail
            });

            // Run the cron job
            await EmailSendingCronJob.run();

            // Verify email was "sent"
            expect(mockSendMail).toHaveBeenCalled();

            // Verify queue entry was updated
            const updatedEntry = await EmailQueue.findByPk(queueEntry.id);
            expect(updatedEntry.status).toBe('sent');
        });

        it('should handle email sending errors gracefully', async () => {
            // Create a test queue entry
            const queueEntry = await createTestEmailQueue({
                send_at: new Date()
            });

            const EmailSendingCronJob = require('../cronjobs/email_sending');
            
            // Mock the email sending function to fail
            const mockSendMail = jest.fn().mockRejectedValue(new Error('Send failed'));
            EmailSendingCronJob.getTransporter = jest.fn().mockReturnValue({
                sendMail: mockSendMail
            });

            // Run the cron job
            await EmailSendingCronJob.run();

            // Verify queue entry status didn't change
            const updatedEntry = await EmailQueue.findByPk(queueEntry.id);
            expect(updatedEntry.status).toBe('not sent');
        });
    });
});
