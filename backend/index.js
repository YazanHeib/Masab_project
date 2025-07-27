const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config({ path: ['.env.local', '.env'] });

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const payeesRoutes = require('./routes/payees');
const customersRoutes = require('./routes/customers');
const orgAccountRoutes = require('./routes/orgAccounts');
const transactionRoutes = require('./routes/transactions');

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(cors({
  credentials: true,
  origin: ['http://localhost:5170'],
}));

// Connect to DB
connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('MASAB API Server is running!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payees', payeesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/orgAccounts', orgAccountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
