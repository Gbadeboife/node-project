const QRCode = require('qrcode');

/**
 * Generates a QR code data URL for the given URL string.
 * @param {string} url - The URL to encode in the QR code.
 * @returns {Promise<string>} - The QR code as a data URL.
 */
async function generateQRCodeDataUrl(url) {
  return QRCode.toDataURL(url);
}

module.exports = { generateQRCodeDataUrl }; 