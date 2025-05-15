const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Dealer = require('../models/Dealer');
const Product = require('../models/Product');

// Get all dealers
router.get('/', async (req, res) => {
  try {
    const dealers = await Dealer.find();
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dealers' });
  }
});

//Get dealers stock
router.get('/:id/stock', async (req, res) => {
  const dealerId = req.params.id;

  try {
    const products = await Product.find({
      assigned: true,
      'assignment.type': 'Dealer',
      'assignment.id': new mongoose.Types.ObjectId(dealerId),
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


//Create a dealer
router.post('/create', async (req, res) => {
    const { name } = req.body;
    try {
      const dealer = new Dealer({ name });
      await dealer.save();
      res.json(dealer);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create dealer' });
    }
});
  
// GET /api/dealers/stock-count
router.get('/stock-count', async (req, res) => {
  try {
    const count = await Product.countDocuments({ 'assignment.type': 'Dealer' });
    res.json({ total: count });
  } catch (err) {
    console.error('Dealer stock count failed', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
