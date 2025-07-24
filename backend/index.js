const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const payeesRoutes = require('./routes/payees');
const customersRoutes = require('./routes/customers');
const transactionsRoutes = require('./routes/transactions');
const receiptsRoutes = require('./routes/receipts');

const { verifyJWT } = require('./controllers/middleware');

const app = express();

app.use(cors());
app.use(express.json()); // JSON body parser

// Connect to MongoDB
mongoose.connect('', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Public routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/account', verifyJWT, accountRoutes);
app.use('/payees', verifyJWT, payeesRoutes);
app.use('/customers', verifyJWT, customersRoutes);
app.use('/transactions', verifyJWT, transactionsRoutes);
app.use('/receipts', verifyJWT, receiptsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));