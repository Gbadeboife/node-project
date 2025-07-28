const request = require('supertest');
const app = require('../app');
const ShopifyService = require('../services/ShopifyService');
const Customer = require('../models/Customer');

jest.mock('../services/ShopifyService');

describe('Products Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return products page with paginated results', async () => {
        const mockProducts = [
            {
                id: 1,
                title: 'Test Product',
                variants: [{ price: '10.00' }],
                image: { src: 'test.jpg' }
            }
        ];

        ShopifyService.fetchProducts.mockResolvedValue(mockProducts);

        const response = await request(app)
            .get('/products')
            .query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.text).toContain('Test Product');
    });

    it('should handle invalid pagination parameters', async () => {
        const response = await request(app)
            .get('/products')
            .query({ page: -1, limit: 1000 });

        expect(response.status).toBe(200);
        expect(response.text).toContain('error');
    });
});

describe('Customer Sync', () => {
    it('should sync customers from Shopify to database', async () => {
        const mockCustomers = [
            {
                id: '1',
                email: 'test@example.com'
            }
        ];

        ShopifyService.fetchCustomers.mockResolvedValue(mockCustomers);

        await ShopifyService.syncCustomers();

        const customer = await Customer.findOne({
            where: { shopify_customer_id: '1' }
        });

        expect(customer).not.toBeNull();
        expect(customer.shopify_customer_email).toBe('test@example.com');
    });
});
