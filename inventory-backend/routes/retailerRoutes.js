const express = require('express');
const mongoose = require('mongoose');
const Retailer = require('../models/Retailer');
const Product = require('../models/Product');
const router = express.Router();

// Create a retailer
router.post('/create', async (req, res) => {
  try {
    const retailer = await Retailer.create({ name: req.body.name });
    res.status(201).json(retailer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create retailer' });
  }
});

// Get all retailers
router.get('/', async (req, res) => {
  try {
    const retailers = await Retailer.find();
    res.json(retailers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch retailers' });
  }
});

router.get('/:id/stock', async (req, res) => {
    const retailerId = req.params.id;
  
    try {
      const products = await Product.find({
        assigned: true,
        'assignment.type': 'Retailer',
        'assignment.id': new mongoose.Types.ObjectId(retailerId),
      });
  
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
