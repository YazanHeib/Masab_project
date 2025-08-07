const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

dotenv.config({ path: ['.env.local', '.env'] });

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const payeesRoutes = require('./routes/payees');
const customersRoutes = require('./routes/customers');
const transactionRoutes = require('./routes/transactions');
const orgAccountRoutes = require('./routes/orgAccounts');

// Models
const User = require('./models/User');
const OrgAccount = require('./models/OrgAccount');

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
connectDB().then(() => {
  // Run seeding after DB connection
  runSeed();
});

// Test route
app.get('/', (req, res) => {
  res.send('MASAB API Server is running!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payees', payeesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orgAccounts', orgAccountRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

/** ✅ Seed Function **/
async function runSeed() {
  try {
    console.log('🌱 Running seed...');
    
    // Admin User
    const email = 'support@masab.com';
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('support123', 10);
      await User.create({
        username: 'masab support',
        email,
        password: hashedPassword,
      });
      console.log('✅ Admin user seeded successfully!');
    } else {
      console.log('⚠️ Admin user already exists.');
    }

    // Organization Account
    const accountNumber = '1234567890';
    const existingOrgAccount = await OrgAccount.findOne({ accountNumber });

    if (!existingOrgAccount) {
      await OrgAccount.create({
        bankName: 'Bank of Finance',
        branchNumber: '001',
        accountNumber,
        balance: 1000000,
      });
      console.log('✅ Organization account seeded successfully!');
    } else {
      console.log('⚠️ Organization account already exists.');
    }

  } catch (err) {
    console.error('❌ Error during seeding:', err);
  }
}
