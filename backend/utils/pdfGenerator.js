const fs = require('fs');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

const generatePDF = (transaction, savePath) => {
  const doc = new jsPDF();
  doc.text('Transaction Receipt', 10, 10);
  doc.autoTable({
    head: [['Field', 'Value']],
    body: [
      ['Direction', transaction.direction],
      ['Category', transaction.category],
      ['Amount', transaction.amount],
      ['Note', transaction.note],
      ['Status', transaction.status],
      ['Created At', transaction.createdAt.toString()]
    ]
  });
  doc.save(savePath);
};

module.exports = generatePDF;
