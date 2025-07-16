var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Transaction = require('../models/transaction');
const { Parser } = require('json2csv');
const csvParser = require('csv-parser');
const upload = multer({ dest: 'uploads/' });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET /import page
router.get('/import', (req, res) => {
  res.render('import');
});

// POST /api/v1/import
router.post('/api/v1/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const results = [];
  const errors = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const row of results) {
          try {
            await Transaction.create(row);
          } catch (err) {
            errors.push({ row, error: err.message });
          }
        }
        fs.unlinkSync(req.file.path);
        if (errors.length > 0) {
          return res.status(400).json({ message: 'Some rows failed to import', errors });
        }
        res.json({ message: 'Import successful', count: results.length });
      } catch (err) {
        res.status(500).json({ message: 'Import failed', error: err.message });
      }
    });
});

// GET /api/v1/export
router.get('/api/v1/export', async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    const parser = new Parser();
    const csv = parser.parse(transactions.map(t => t.toJSON()));
    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Export failed', error: err.message });
  }
});

module.exports = router;
