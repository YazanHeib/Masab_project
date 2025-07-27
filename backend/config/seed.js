const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();

async function seedUser() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        const username = 'admin';
        const email = 'admin@gmail.com';
        const plainPassword = 'admin123';

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists. Skipping seed.');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();

        console.log('User seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding user:', err);
        process.exit(1);
    }
}

seedUser();
