const express = require('express');
const router = express.Router();
const Dealer = require('../models/Dealer');
const Product = require('../models/Product');

// Get all dealers
router.get('/', async (req, res) => {
  try {
    const dealers = await Dealer.find();
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a dealer (main or sub)
router.post('/create', async (req, res) => {
  try {
    const { name, parentDealerId } = req.body;
    const newDealer = new Dealer({
      name,
      parentDealer: parentDealerId || null
    });
    await newDealer.save();
    res.json(newDealer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get dealer stock
router.get('/:dealerId/stock', async (req, res) => {
  try {
    const products = await Product.find({
      assigned: true,
      assignedTo: req.params.dealerId
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update dealer name
router.put('/:id', async (req, res) => {
  try {
    const dealer = await Dealer.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(dealer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update dealer' });
  }
});


// Delete dealer
router.delete('/:id', async (req, res) => {
  try {
    await Dealer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Dealer deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete dealer' });
  }
});


// POST create sub-dealer under a dealer
router.post('/:dealerId/subdealers', async (req, res) => {
  const { name } = req.body;
  const { dealerId } = req.params;

  try {
    const mainDealer = await Dealer.findById(dealerId);
    if (!mainDealer) return res.status(404).json({ message: 'Main dealer not found' });

    const subDealer = new Dealer({
      name,
      parentDealer: dealerId
    });

    await subDealer.save();
    res.status(201).json(subDealer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create sub-dealer' });
  }
});


// GET stock for a specific sub-dealer under a main dealer
router.get('/:dealerId/subdealers/:subDealerId/stock', async (req, res) => {
  const { dealerId, subDealerId } = req.params;
  console.log('DealerId:', dealerId);
  console.log('SubDealerId:', subDealerId);

  try {
    const subDealer = await Dealer.findOne({ _id: subDealerId, parentDealer: dealerId });
    console.log('Subdealer result:', subDealer);
    if (!subDealer) return res.status(404).json({ message: 'Sub-dealer not found or not under this dealer' });

    const stock = await Product.find({ assignedTo: subDealerId });
    res.json(stock);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch sub-dealer stock' });
  }
});

router.get('/stock-count', async (req, res) => {
  try {
    const total = await Product.countDocuments({ assignedToType: 'dealer' });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dealer stock count' });
  }
});

module.exports = router;
