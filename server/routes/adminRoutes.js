const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protectAdmin } = require('../middleware/auth');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_dev_key', {
        expiresIn: '30d',
    });
};

// POST /api/admin/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && user.password && (await bcrypt.compare(password, user.password))) {
            if (user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized as admin' });
            }
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT /api/admin/password - Change Password
router.put('/password', protectAdmin, async (req, res) => {
    const { newPassword } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();
            res.json({ message: 'Password updated' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT /api/admin/email - Update Admin Email
router.put('/email', protectAdmin, async (req, res) => {
    const { newEmail } = req.body;
    try {
        // Check if email already exists
        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists && emailExists._id.toString() !== req.user._id.toString()) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const user = await User.findById(req.user._id);
        if (user) {
            user.email = newEmail;
            await user.save();
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id), // Optional: Refresh token if needed
                message: 'Email updated successfully'
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
