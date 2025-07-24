const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateReceipt = (data, transactionId) => {
  return new Promise((resolve, reject) => {
    const pdfDir = path.join(__dirname, '..', 'receipts');
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);
    const filePath = path.join(pdfDir, `receipt_${transactionId}.pdf`);

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(16).text('Transaction Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Transaction ID: ${transactionId}`);
    doc.text(`Type: ${data.transaction.category}`);
    doc.text(`Direction: ${data.transaction.direction}`);
    doc.text(`Amount: ${data.transaction.amount}`);
    // Add more info as needed
    doc.end();

    writeStream.on('finish', () => {
      resolve(filePath);
    });
  });
};

module.exports = { generateReceipt };