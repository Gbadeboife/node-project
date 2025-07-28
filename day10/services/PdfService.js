const pdf = require('html-pdf-node');

/**
 * Generates a PDF buffer from HTML content.
 * @param {string} html - The HTML content to convert to PDF.
 * @returns {Promise<Buffer>} - The generated PDF as a buffer.
 */
async function generatePdfBuffer(html) {
  const file = { content: html };
  return pdf.generatePdf(file, { format: 'A4' });
}

module.exports = { generatePdfBuffer }; 