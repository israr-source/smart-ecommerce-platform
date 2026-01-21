const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');

// Create a review
router.post('/', async (req, res) => {
    // TODO: Add auth middleware when ready
    // const userId = req.user.uid; 
    const { userId, productId, rating, comment } = req.body;

    // Basic validation
    if (!userId || !productId || !rating) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const review = new Review({
            userId,
            productId,
            rating,
            comment
        });

        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get reviews for a product
router.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'name');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
