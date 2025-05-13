const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Receive product (add to DB)
router.post('/receive', async (req, res) => {
  const { barcode } = req.body;
  try {
    const product = new Product({ barcode });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error receiving product' });
  }
});

// Get pending products
router.get('/pending', async (req, res) => {
  try {
    const products = await Product.find({ status: 'pending' });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pending products' });
  }
});

// Test a product (mark as good or bad)
router.post('/test/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error updating product' });
  }
});

module.exports = router;
