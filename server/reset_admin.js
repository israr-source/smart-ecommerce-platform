const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const resetAdmin = async () => {
    try {
        await connectDB();

        const email = 'admin@shoply.com';
        const password = 'admin';

        // Delete existing admin to be sure or just update
        // Let's update or findOne
        let user = await User.findOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {
            console.log('Admin user found. Updating password...');
            user.password = hashedPassword;
            user.role = 'admin'; // Ensure role is admin
            await user.save();
        } else {
            console.log('Admin user not found. Creating...');
            user = await User.create({
                name: 'System Admin',
                email: email,
                password: hashedPassword,
                role: 'admin',
                firebaseUid: 'admin_sys_' + Date.now()
            });
        }

        console.log('Admin credentials reset successfully.');
        console.log('Email:', email);
        console.log('Password:', password);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetAdmin();
