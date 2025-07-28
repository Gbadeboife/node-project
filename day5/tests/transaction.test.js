const request = require('supertest');
const app = require('../app');
const Transaction = require('../models/transaction');
const path = require('path');
const fs = require('fs');

describe('Transaction API Endpoints', () => {
    beforeAll(async () => {
        // Clear the database before tests
        await Transaction.destroy({ where: {}, force: true });
    });

    describe('POST /api/v1/import', () => {
        const testCsvPath = path.join(__dirname, 'fixtures', 'test.csv');
        
        beforeAll(() => {
            // Create test CSV file
            const csvContent = 'order_id,user_id,shipping_dock_id,amount,discount,tax,total,notes,status\n' +
                             'ORD123,USR456,DOCK789,100,10,5,95,Test transaction,1';
            
            if (!fs.existsSync(path.join(__dirname, 'fixtures'))) {
                fs.mkdirSync(path.join(__dirname, 'fixtures'));
            }
            fs.writeFileSync(testCsvPath, csvContent);
        });

        afterAll(() => {
            // Clean up test CSV file
            if (fs.existsSync(testCsvPath)) {
                fs.unlinkSync(testCsvPath);
            }
        });

        test('should import valid CSV file', async () => {
            const response = await request(app)
                .post('/api/v1/import')
                .attach('file', testCsvPath);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message', 'Import successful');
            expect(response.body.data).toHaveProperty('count', 1);

            // Verify database record
            const transaction = await Transaction.findOne({ where: { order_id: 'ORD123' }});
            expect(transaction).toBeTruthy();
        });

        test('should reject non-CSV file', async () => {
            const response = await request(app)
                .post('/api/v1/import')
                .attach('file', Buffer.from('fake pdf'), 'test.pdf');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('success', false);
            expect(response.body.message).toContain('Only CSV files are allowed');
        });

        test('should handle missing file', async () => {
            const response = await request(app)
                .post('/api/v1/import');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('success', false);
            expect(response.body.message).toContain('No file uploaded');
        });
    });

    describe('GET /api/v1/export', () => {
        beforeEach(async () => {
            // Add test data
            await Transaction.create({
                order_id: 'ORD123',
                user_id: 'USR456',
                shipping_dock_id: 'DOCK789',
                amount: 100,
                discount: 10,
                tax: 5,
                total: 95,
                notes: 'Test transaction',
                status: 1
            });
        });

        test('should export transactions as CSV', async () => {
            const response = await request(app)
                .get('/api/v1/export');

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toBe('text/csv');
            expect(response.headers['content-disposition']).toContain('transactions.csv');
            
            // Verify CSV content
            const csvLines = response.text.split('\n');
            expect(csvLines[0]).toContain('order_id,user_id,shipping_dock_id');
            expect(csvLines[1]).toContain('ORD123,USR456,DOCK789');
        });

        test('should handle empty database', async () => {
            await Transaction.destroy({ where: {}, force: true });
            
            const response = await request(app)
                .get('/api/v1/export');

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toBe('text/csv');
            // Should only contain headers
            const csvLines = response.text.split('\n').filter(line => line.trim());
            expect(csvLines.length).toBe(1);
        });
    });
});
