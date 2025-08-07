const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const OrgAccount = require('../models/OrgAccount'); // Import OrgAccount model
require('dotenv').config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        /** ✅ Seed Admin User **/
        const username = 'masab support';
        const email = 'support@masab.com';
        const plainPassword = 'support123';

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(plainPassword, salt);

            const user = new User({
                username,
                email,
                password: hashedPassword,
            });

            await user.save();
            console.log('✅ Admin user seeded successfully!');
        } else {
            console.log('⚠️ Admin user already exists. Skipping...');
        }

        /** ✅ Seed Organization Account **/
        const orgBankName = 'Bank of Finance';
        const branchNumber = '001';
        const accountNumber = '1234567890';
        const initialBalance = 1000000; // Example: 1,000,000

        const existingOrgAccount = await OrgAccount.findOne({ accountNumber });
        if (!existingOrgAccount) {
            const orgAccount = new OrgAccount({
                bankName: orgBankName,
                branchNumber,
                accountNumber,
                balance: initialBalance
            });

            await orgAccount.save();
            console.log('✅ Organization account seeded successfully!');
        } else {
            console.log('⚠️ Organization account already exists. Skipping...');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding data:', err);
        process.exit(1);
    }
}

seed();
