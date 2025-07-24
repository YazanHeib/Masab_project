const Receipt = require('../models/Receipt');
const fs = require('fs');

exports.getReceiptStream = async (req, res) => {
  const { id } = req.params;
  const receipt = await Receipt.findById(id);
  if (!receipt) return res.status(404).json({ message: 'Receipt not found' });
  
  const fileStream = fs.createReadStream(receipt.pdfPath);
  res.setHeader('Content-Type', 'application/pdf');
  fileStream.pipe(res);
};