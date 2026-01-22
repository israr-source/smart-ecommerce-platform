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



// GET /api/users/:id/wishlist - Get User Wishlist
router.get('/:id/wishlist', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('wishlist');
        if (user) {
            res.json(user.wishlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT /api/users/:id/wishlist - Toggle Wishlist Item
router.put('/:id/wishlist', async (req, res) => {
    const { productId } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            const index = user.wishlist.indexOf(productId);
            if (index === -1) {
                user.wishlist.push(productId); // Add
            } else {
                user.wishlist.splice(index, 1); // Remove
            }
            await user.save();
            res.json(user.wishlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
