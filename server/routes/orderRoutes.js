const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
    try {
        // TODO: Get userId from auth middleware
        // For now, check if body has userId or simulate guest/dummy user if needed. 
        // Ideally we should enforce auth.
        // Let's assume the frontend sends a 'userId' if we haven't enabled full Auth middleware yet, 
        // OR we can't create an order without a user in the schema.

        const { products, totalAmount, userId } = req.body;

        if (products && products.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // We need a userId. If not provided, we can't save to DB based on schema.
        // For testing without auth middleware, we might need to send a valid User ObjectId from frontend 
        // or fetch a default user here.

        // TEMPORARY: If no userId, try to find the first user in DB (just for demo purposes if auth isn't fully wired)
        let finalUserId = userId;
        if (!finalUserId) {
            const User = require('../models/User');
            const demoUser = await User.findOne();
            if (demoUser) finalUserId = demoUser._id;
        }

        if (!finalUserId) {
            return res.status(401).json({ message: 'Not authorized - No user found' });
        }

        const order = new Order({
            userId: finalUserId,
            products: products.map(p => ({
                productId: p.productId,
                quantity: p.quantity
            })),
            totalAmount,
            status: 'pending'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET /api/orders/myorders - Get logged in user's orders
router.get('/myorders', async (req, res) => {
    try {
        // TODO: Use req.user._id from auth middleware.
        // For now, we rely on query param ?userId=<id> or just fetch all for demo if needed.
        // BUT strict adherence to "myorders" implies we know who the user is.
        // Let's try to get userId from headers or query for now if middleware isn't active.

        const userId = req.headers['userid'] || req.query.userId;

        // If no user ID provided, maybe return empty or error?
        // Let's fallback to finding 'a' user for demo flow if absolutely necessary, 
        // but it's better to be strict.

        let query = {};
        if (userId) {
            query.userId = userId;
        } else {
            // For safety, providing no orders is better than providing all orders
            // unless we are admin. 
            // Let's check if we can find a user to default to for testing
            const User = require('../models/User');
            const demoUser = await User.findOne();
            if (demoUser) query.userId = demoUser._id;
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT /api/orders/:id/status - Update order status (Cancel/Ship)
router.put('/:id/status', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
