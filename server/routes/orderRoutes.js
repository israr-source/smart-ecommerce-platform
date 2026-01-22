const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, protectAdmin } = require('../middleware/auth');

// DELETE /api/orders/cancelled - Delete all cancelled orders (Admin only)
router.delete('/cancelled', protectAdmin, async (req, res) => {
    try {
        const result = await Order.deleteMany({ status: 'cancelled' });
        res.json({ message: 'Cancelled orders removed', count: result.deletedCount });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET /api/orders/all - Get all orders (Admin only)
router.get('/all', protectAdmin, async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }).populate('products.productId', 'title imageUrl').populate('userId', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// POST /api/orders - Create new order
router.post('/', protect, async (req, res) => {
    try {
        const { products, totalAmount, userId, shippingAddress, shippingCost, estimatedDelivery } = req.body;

        if (products && products.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!shippingAddress) {
            return res.status(400).json({ message: 'Shipping address is required' });
        }

        const order = new Order({
            userId,
            products: products.map(p => ({
                productId: p.productId,
                quantity: p.quantity
            })),
            totalAmount,
            shippingAddress,
            shippingCost: shippingCost || 0,
            estimatedDelivery: estimatedDelivery || '',
            status: 'pending'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET /api/orders/myorders - Get logged in user's orders
router.get('/myorders', protect, async (req, res) => {
    try {
        // Authenticated user
        // Ideally we filter by req.user.uid, but since we are mocking and the frontend passes userId of the mongo user,
        // we will trust the query param IF the user is authenticated (which protect ensures).

        const userId = req.headers['userid'] || req.query.userId;
        let query = {};

        if (userId) {
            query.userId = userId;
        }

        const orders = await Order.find(query).sort({ createdAt: -1 }).populate('products.productId', 'title imageUrl');
        res.json(orders);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put('/:id/status', protectAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT /api/orders/:id - Update order (Address/Legacy) by User
router.put('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            order.shippingAddress = req.body.shippingAddress || order.shippingAddress;

            // Fix for legacy orders without address
            // Mongoose validation will fail on save() if this required field is missing
            if (!order.shippingAddress) {
                order.shippingAddress = "Not Provided (Legacy)";
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// DELETE /api/orders/:id - Delete order
router.delete('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: 'Order removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
