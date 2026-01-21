const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth'); // Placeholder auth

// GET /api/products - List all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST /api/products - Create product (Admin only - protect later)
router.post('/', async (req, res) => {
    res.status(201).json({
        message: 'Product created successfully',
        product: req.body,
    });
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
    res.json({
        message: `Product ${req.params.id} updated`,
        updatedData: req.body,
    });
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res) => {
    res.json({ message: `Product ${req.params.id} deleted` });
});

module.exports = router;
