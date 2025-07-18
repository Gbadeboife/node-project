var express = require('express');
var router = express.Router();
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf-node');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET /code - show QR code page
router.get('/code', async function(req, res, next) {
  // Generate a random code
  const code = Math.random().toString(36).substring(2, 10);
  const amount = 385;
  const service = 'Software service';
  const qrUrl = `${req.protocol}://${req.get('host')}/api/v1/code/${code}?amount=${amount}&service=${encodeURIComponent(service)}`;
  // Generate QR code data URL
  const qrDataUrl = await QRCode.toDataURL(qrUrl);
  res.render('code', { qrDataUrl, qrUrl });
});

const invoiceTemplatePath = path.join(__dirname, '../services/invoice-template.html');

// GET /api/v1/code/:code - generate and download PDF invoice
router.get('/api/v1/code/:code', async function(req, res, next) {
  const { code } = req.params;
  const { amount = 1, service = 'Software service' } = req.query;
  // Read the invoice template
  let invoiceHtml = fs.readFileSync(invoiceTemplatePath, 'utf8');
  // Replace placeholders or static values with dynamic ones
  invoiceHtml = invoiceHtml
    .replace('Created: January 1, 2023', `Created: ${new Date().toLocaleDateString()}`)
    .replace('Due: February 1, 2023', `Due: ${new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString()}`)
    .replace('Website design', service)
    .replace('Total: $385.00', `Total: $${amount}`);
  const file = { content: invoiceHtml };
  const pdfBuffer = await pdf.generatePdf(file, { format: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${code}.pdf`);
  res.send(pdfBuffer);
});

module.exports = router;
