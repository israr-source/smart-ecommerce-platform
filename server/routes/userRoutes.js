const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users/sync - Sync Firebase User with MongoDB
router.post('/sync', async (req, res) => {
    const { uid, email, displayName, photoURL } = req.body;

    if (!uid || !email) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Find user by firebaseUid or create new
        // upsert: true, new: true, setDefaultsOnInsert: true
        const user = await User.findOneAndUpdate(
            { firebaseUid: uid },
            {
                email,
                name: displayName || 'User',
                // Don't overwrite role if it exists, but default is 'user' via schema
                // We typically don't update role here to prevent admin takeover exploit if we had that logic
                $setOnInsert: { role: 'user', firebaseUid: uid },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(user);
    } catch (error) {
        console.error('User Sync Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
