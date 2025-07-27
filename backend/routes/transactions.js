const express = require('express');
const OrgAccount = require('../models/OrgAccount');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const {
            type,
            category,
            payeeId,
            customerId,
            amount,
            description,
        } = req.body;

        // Validate required fields
        if (!type || !category || typeof amount !== 'number') {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check amount is positive
        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }

        // Get org account (assuming single account)
        const org = await OrgAccount.findOne();
        if (!org) {
            return res.status(500).json({ message: 'Org account not found' });
        }

        // Handle balance change
        if (type === 'PAYMENT') {
            if (org.balance < amount) {
                return res.status(400).json({ message: 'Insufficient balance for payment' });
            }
            org.balance -= amount;
        } else if (type === 'CHARGE') {
            org.balance += amount;
        }

        // Create and save the transaction
        const transaction = new Transaction({
            type,
            category,
            payeeId: payeeId || undefined,
            customerId: customerId || undefined,
            amount,
            description,
            status: 'DONE',
        });

        await transaction.save();
        await org.save();

        return res.status(201).json({
            message: 'Transaction completed and saved',
            transaction,
            newBalance: org.balance,
        });
    } catch (error) {
        console.error('Transaction creation error:', error);
        return res.status(500).json({ message: 'Server error occurred while saving transaction.' });
    }
});

module.exports = router;
