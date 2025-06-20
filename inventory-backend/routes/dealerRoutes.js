const express = require('express');
const router = express.Router();
const Dealer = require('../models/Dealer');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');

// Get all dealers
router.get('/', async (req, res) => {
  try {
    const dealers = await Dealer.findAll();
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a dealer
router.post('/create', async (req, res) => {
  try {
    const { name, parentDealerId } = req.body;
    const newDealer = await Dealer.create({
      name,
      parentDealer: parentDealerId || null,
    });
    res.json(newDealer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get dealer stock
router.get('/:dealerId/stock', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        assigned: true,
        assignedTo: req.params.dealerId,
      }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get dealer invoices
router.get('/:dealerId/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: { customerId: req.params.dealerId },
      include: ['products'],
    });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Update dealer name
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Dealer.update(
      { name: req.body.name },
      { where: { id: req.params.id } }
    );
    if (updated) {
      const updatedDealer = await Dealer.findByPk(req.params.id);
      res.json(updatedDealer);
    } else {
      res.status(404).json({ error: 'Dealer not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update dealer' });
  }
});

// Delete dealer
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Dealer.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: 'Dealer deleted' });
    } else {
      res.status(404).json({ error: 'Dealer not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete dealer' });
  }
});

// Create sub-dealer
router.post('/:dealerId/subdealers', async (req, res) => {
  try {
    const { name } = req.body;
    const dealerId = req.params.dealerId;

    const mainDealer = await Dealer.findByPk(dealerId);
    if (!mainDealer) return res.status(404).json({ message: 'Main dealer not found' });

    const subDealer = await Dealer.create({
      name,
      parentDealer: dealerId
    });

    res.status(201).json(subDealer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create sub-dealer' });
  }
});

// Get stock for sub-dealer
router.get('/:dealerId/subdealers/:subDealerId/stock', async (req, res) => {
  const { dealerId, subDealerId } = req.params;

  try {
    const subDealer = await Dealer.findOne({
      where: {
        id: subDealerId,
        parentDealer: dealerId
      }
    });

    if (!subDealer) return res.status(404).json({ message: 'Sub-dealer not found or not under this dealer' });

    const stock = await Product.findAll({ where: { assignedTo: subDealerId } });
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sub-dealer stock' });
  }
});

// Count dealer stock
router.get('/stock-count', async (req, res) => {
  try {
    const total = await Product.count({ where: { assignedType: 'dealer' } });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dealer stock count' });
  }
});

module.exports = router;
