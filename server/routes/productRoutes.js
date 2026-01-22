const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, protectAdmin } = require('../middleware/auth');

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

// POST /api/products - Create product (Admin only)
router.post('/', protectAdmin, async (req, res) => {
    try {
        const { title, description, price, imageUrl, category, stock, type } = req.body;

        const product = new Product({
            title,
            description,
            price,
            imageUrl,
            category,
            stock,
            type
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: 'Invalid product data', error: error.message });
    }
});

// PUT /api/products/:id - Update product
router.put('/:id', protectAdmin, async (req, res) => {
    try {
        const { title, description, price, imageUrl, category, stock, type } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.title = title || product.title;
            product.description = description || product.description;
            product.price = price || product.price;
            product.imageUrl = imageUrl || product.imageUrl;
            product.category = category || product.category;
            product.stock = stock !== undefined ? stock : product.stock; // Handle 0
            product.type = type || product.type;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', protectAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
