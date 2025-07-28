const ValidationService = require('../services/validationService');

describe('ValidationService', () => {
    describe('validateTransaction', () => {
        const validTransaction = {
            order_id: 'ORD123',
            user_id: 'USR456',
            shipping_dock_id: 'DOCK789',
            amount: 100,
            discount: 10,
            tax: 5,
            total: 95, // amount - discount + tax
            notes: 'Test transaction',
            status: 1
        };

        test('should validate a correct transaction', () => {
            const { error } = ValidationService.validateTransaction(validTransaction);
            expect(error).toBeUndefined();
        });

        test('should fail when required fields are missing', () => {
            const invalidTransaction = { ...validTransaction };
            delete invalidTransaction.order_id;

            const { error } = ValidationService.validateTransaction(invalidTransaction);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('required');
        });

        test('should fail when total does not match calculation', () => {
            const invalidTransaction = {
                ...validTransaction,
                total: 1000 // Incorrect total
            };

            const { error } = ValidationService.validateTransaction(invalidTransaction);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('must equal amount - discount + tax');
        });

        test('should fail with negative values', () => {
            const invalidTransaction = {
                ...validTransaction,
                amount: -100
            };

            const { error } = ValidationService.validateTransaction(invalidTransaction);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('must be positive');
        });

        test('should fail with invalid status', () => {
            const invalidTransaction = {
                ...validTransaction,
                status: 2 // Only 0 and 1 are valid
            };

            const { error } = ValidationService.validateTransaction(invalidTransaction);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('must be either 0 (not paid) or 1 (paid)');
        });
    });

    describe('validateFileFormat', () => {
        const validFile = {
            mimetype: 'text/csv',
            size: 1024 * 1024 // 1MB
        };

        test('should validate a correct CSV file', () => {
            const { error } = ValidationService.validateFileFormat(validFile);
            expect(error).toBeUndefined();
        });

        test('should fail with invalid file type', () => {
            const invalidFile = {
                ...validFile,
                mimetype: 'application/pdf'
            };

            const { error } = ValidationService.validateFileFormat(invalidFile);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('must be a CSV file');
        });

        test('should fail with file too large', () => {
            const invalidFile = {
                ...validFile,
                size: 6 * 1024 * 1024 // 6MB
            };

            const { error } = ValidationService.validateFileFormat(invalidFile);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('cannot exceed 5MB');
        });
    });
});
