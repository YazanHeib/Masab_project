const express = require('express');
const OrgAccount = require('../models/OrgAccount');
const Transaction = require('../models/Transaction');
const verifyJWT = require('../utils/middleware');
const PDFDocument = require('pdfkit');
const router = express.Router();

router.post('/create', verifyJWT, async (req, res) => {
    try {
        const { category, payeeId, customerId, amount, description } = req.body;

        // ✅ Validate required fields
        if (!category || !['SALARY', 'SUPPLIER', 'PENSION', 'CHARGE'].includes(category)) {
            return res.status(400).json({ message: 'Invalid or missing category' });
        }

        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }

        if (!payeeId && !customerId) {
            return res.status(400).json({ message: 'Either payeeId or customerId is required' });
        }

        // ✅ Get organization account
        const org = await OrgAccount.findOne();
        if (!org) {
            return res.status(500).json({ message: 'Organization account not found' });
        }

        // ✅ Check balance
        if (org.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance for payment' });
        }

        // ✅ Deduct amount
        org.balance -= amount;

        // ✅ Create transaction record
        const transaction = new Transaction({
            category,
            payeeId: payeeId || undefined,
            customerId: customerId || undefined,
            amount,
            description,
            status: 'DONE'
        });

        await transaction.save();
        await org.save();

        return res.status(201).json({
            message: '✅ Transaction completed successfully!',
            transaction,
            newBalance: org.balance
        });
    } catch (error) {
        console.error('❌ Transaction creation error:', error);
        return res.status(500).json({ message: 'Server error occurred while processing transaction.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('payeeId', 'firstName lastName email')
            .populate('customerId', 'firstName lastName email')
            .sort({ createdAt: -1 });

        return res.status(200).json({ transactions });
    } catch (error) {
        console.error('❌ Error fetching transactions:', error);
        return res.status(500).json({ message: 'Server error while fetching transactions.' });
    }
});

router.get('/getOne/:id', verifyJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id)
            .populate('payeeId', 'firstName lastName bank account email')
            .populate('customerId', 'firstName lastName bank account email');

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        return res.status(200).json(transaction);
    } catch (error) {
        console.error('❌ Error fetching transaction:', error);
        return res.status(500).json({ message: 'Server error while fetching transaction.' });
    }
});

router.patch('/updateStatus/:id', verifyJWT, async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['PENDING', 'DONE'].includes(status)) {
            return res.status(400).json({ message: 'Invalid or missing status' });
        }

        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        transaction.status = status;
        await transaction.save();

        return res.status(200).json({ message: '✅ Transaction status updated successfully!', transaction });
    } catch (error) {
        console.error('❌ Error updating transaction status:', error);
        return res.status(500).json({ message: 'Failed to update transaction status.' });
    }
});

router.get("/:id/receipt", async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate("payeeId")
            .populate("customerId");

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=receipt-${transaction._id}.pdf`);

        const doc = new PDFDocument({ size: "A4", margin: 50 });
        doc.pipe(res);

        const primaryColor = "#007bff";
        const successColor = "#28a745";

        /** HEADER **/
        doc.fontSize(20).fillColor(primaryColor).text("Transaction Invoice", 50, 50);
        doc.moveDown(0.3);
        doc.fontSize(10).fillColor("gray").text(`Invoice #${transaction._id}`);
        doc.moveUp(1.5);
        doc.fontSize(12).fillColor(transaction.status === "DONE" ? successColor : "#ffc107")
            .text(transaction.status, { align: "right" });
        doc.moveDown(1);

        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#ccc").stroke();
        doc.moveDown(1);

        /** FROM & TO Section **/
        const yStart = doc.y + 10;

        // Titles
        doc.fontSize(14).fillColor("#333").font("Helvetica-Bold")
            .text("FROM:", 50, yStart)
            .text("TO:", 350, yStart);

        // From Details
        doc.fontSize(12).fillColor("black").font("Helvetica")
            .text("Masab Organization", 50, yStart + 20)
            .text("Banking System", 50, yStart + 40)
            .text("Email: support@masab.com", 50, yStart + 60);

        // To Details
        const recipient = transaction.payeeId
            ? `${transaction.payeeId.firstName} ${transaction.payeeId.lastName}`
            : transaction.customerId
                ? `${transaction.customerId.firstName} ${transaction.customerId.lastName}`
                : "N/A";

        doc.text(recipient, 350, yStart + 20)
            .text(transaction.category, 350, yStart + 40);

        // Add spacing after this block
        doc.moveDown(4);
        /** TABLE **/
        const tableTop = doc.y;
        const col1X = 50, col2X = 280, col3X = 400;
        const rowHeight = 25;

        // Header row background
        doc.rect(col1X, tableTop, 500, rowHeight).fill(primaryColor).stroke();
        doc.fillColor("white").fontSize(12)
            .text("Description", col1X + 10, tableTop + 7)
            .text("Category", col2X + 10, tableTop + 7)
            .text("Amount", col3X + 10, tableTop + 7, { align: "right" });

        // Reset fill for data rows
        doc.fillColor("black");

        // Data row border
        const rowY = tableTop + rowHeight;
        doc.rect(col1X, rowY, 500, rowHeight).strokeColor("#ccc").stroke();

        // Row text
        doc.text(transaction.description || "N/A", col1X + 10, rowY + 7)
            .text(transaction.category, col2X + 10, rowY + 7)
            .text(`$${transaction.amount.toFixed(2)}`, col3X + 10, rowY + 7, { align: "right" });

        doc.moveDown(4);

        /** FOOTER **/
        doc.moveDown(2);
        doc.fontSize(10).fillColor("gray")
            .text(`Date: ${new Date(transaction.createdAt).toLocaleString()}`, { align: "right" });

        doc.end();
    } catch (error) {
        console.error("PDF generation error:", error);
        res.status(500).json({ message: "Error generating receipt" });
    }
});

module.exports = router;
