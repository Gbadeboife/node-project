var express = require('express');
var router = express.Router();
// Import required modules
const QRCode = require('qrcode'); // For generating QR codes
const fs = require('fs'); // For file system operations
const path = require('path'); // For handling file paths
const pdf = require('html-pdf-node'); // For generating PDFs
// Import QRCodeService and PdfService
const { generateQRCodeDataUrl } = require('../services/QRCodeService');
const { generatePdfBuffer } = require('../services/PdfService');
const { validateInput, handleValidationErrorForAPI } = require('../services/ValidationService');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET /code - show QR code page
// This route generates a random code, creates a QR code that links to the invoice download endpoint, and renders a page displaying the QR code.
router.get('/code', async function(req, res, next) {
  try {
    // Generate a random code for the invoice
    const code = Math.random().toString(36).substring(2, 10);
    const amount = 1;
    const service = 'software service';
    // Construct the URL that the QR code will point to
    const qrUrl = `${req.protocol}://${req.get('host')}/api/v1/code/${code}?amount=${amount}&service=${encodeURIComponent(service)}`;
    // Generate QR code data URL using service
    const qrDataUrl = await generateQRCodeDataUrl(qrUrl);
    // Log QR code generation
    console.log(`[QR] Generated QR code for URL: ${qrUrl}`);
    // Render the code.jade view, passing the QR code image and URL
    res.render('code', { qrDataUrl, qrUrl });
  } catch (error) {
    console.error('[QR] Error generating QR code:', error);
    next(error);
  }
});

// Path to the invoice HTML template
const invoiceTemplatePath = path.join(__dirname, '../services/invoice-template.html');

// GET /api/v1/code/:code - generate and download PDF invoice
// This route reads the invoice template, injects dynamic values, generates a PDF, and sends it as a download.
router.get('/api/v1/code/:code',
  // Input validation middleware
  validateInput(
    { amount: 'required|numeric', service: 'required|string' },
    { 'amount.required': 'Amount is required', 'amount.numeric': 'Amount must be a number', 'service.required': 'Service is required', 'service.string': 'Service must be a string' }
  ),
  handleValidationErrorForAPI,
  async function(req, res, next) {
    try {
      const { code } = req.params;
      const { amount = 1, service = 'software service' } = req.query;
      // Read the invoice template from file
      let invoiceHtml = fs.readFileSync(invoiceTemplatePath, 'utf8');
      // Replace placeholders or static values with dynamic ones
      invoiceHtml = invoiceHtml
        .replace('Invoice #: 123', `Invoice #: ${code}`)
        .replace('Created: January 1, 2023', `Created: ${new Date().toLocaleDateString()}`)
        .replace('Due: February 1, 2023', `Due: ${new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString()}`)
        .replace('Website design', service)
        // Only replace the total, not the line items
        .replace('Total: $385.00', `Total: $${amount}`);
      // Generate PDF from the HTML using service
      const pdfBuffer = await generatePdfBuffer(invoiceHtml);
      // Log PDF generation
      console.log(`[PDF] Generated invoice PDF for code: ${code}, amount: ${amount}, service: ${service}`);
      // Set headers to prompt download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${code}.pdf`);
      // Send the PDF file
      res.send(pdfBuffer);
    } catch (error) {
      console.error('[PDF] Error generating PDF invoice:', error);
      next(error);
    }
  }
);

module.exports = router;
