const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const TransactionController = require('../controllers/transactionController');
const { validateTransaction } = require('../middleware/validator');

// Render home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Import/Export routes
router.get('/import', TransactionController.renderImportPage);
router.post('/api/v1/import', 
    upload.single('file'),
    validateTransaction,
    TransactionController.importTransactions
);
router.get('/api/v1/export', TransactionController.exportTransactions);

module.exports = router;
