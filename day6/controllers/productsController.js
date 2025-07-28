const ShopifyService = require('../services/ShopifyService');
const logger = require('../services/LoggerService');
const { validateInput, handleValidationErrorForViews } = require('../services/ValidationService');

const productsController = {
    /**
     * Validation rules for products page
     */
    validationRules: {
        page: 'integer|min:1',
        limit: 'integer|min:1|max:50'
    },

    /**
     * Display products page with pagination
     */
    getProducts: [
        // Input validation middleware
        validateInput({
            page: 'integer|min:1',
            limit: 'integer|min:1|max:50'
        }),
        
        // Handle validation errors
        async (req, res, next) => {
            const viewModel = {
                title: 'Products',
                products: [],
                pagination: {},
                error: null
            };

            // Handle validation errors
            handleValidationErrorForViews(req, res, viewModel, 'products', 'query');

            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;

                const products = await ShopifyService.fetchProducts(page, limit);
                
                viewModel.products = products;
                viewModel.pagination = {
                    currentPage: page,
                    limit: limit
                };

                logger.info('Successfully rendered products page');
                res.render('products', viewModel);
            } catch (error) {
                logger.error('Error fetching products:', error);
                viewModel.error = 'Failed to fetch products. Please try again later.';
                res.render('products', viewModel);
            }
        }
    ]
};

module.exports = productsController;
