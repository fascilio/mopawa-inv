const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');

router.post('/receive', async (req, res) => {
  console.log('Received barcode:', req.body);
  const { barcode } = req.body;

  try {
    const existingProduct = await Product.findOne({ where: { barcode } });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product already scanned' });
    }

    const newProduct = await Product.create({ barcode });
    res.status(201).json({ message: 'Product registered successfully' });
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/delete-by-barcode/:barcode', async (req, res) => {
  const { barcode } = req.params;

  try {
    const deleted = await Product.destroy({ where: { barcode } });
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product by barcode:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/pending', async (req, res) => {
  try {
    const products = await Product.findAll({ where: { status: 'pending' } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pending products' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    const detailed = products.map(product => ({
      id: product.id,
      barcode: product.barcode,
      assignedTo: product.assignedTo || null,
      assignedType: product.assignedType || null,
      assignmentDate: product.createdAt,
      receivedAt: product.receivedAt || null,
      testedStatus: ['good', 'bad'].includes(product.status) ? product.status : null
    }));
    res.json(detailed);
  } catch (err) {
    console.error('Error fetching all products:', err);
    res.status(500).json({ error: 'Failed to fetch all products' });
  }
});

router.get('/tested', async (req, res) => {
  try {
    const tested = await Product.findAll({ where: { status: { [Op.in]: ['good', 'bad'] } } });
    res.json(tested);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tested products' });
  }
});

router.post('/test/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const product = await Product.update({ status }, {
      where: { id: req.params.id },
      returning: true
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error updating product' });
  }
});

router.post('/assign', async (req, res) => {
  const { barcode, destinationType, destinationId } = req.body;

  if (!barcode || !destinationType || !destinationId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const product = await Product.findOne({ where: { barcode } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const formattedType = destinationType.charAt(0).toUpperCase() + destinationType.slice(1).toLowerCase();

    await product.update({
      assigned: true,
      assignment: { type: formattedType, id: destinationId, date: new Date() },
      assignedTo: destinationId,
      assignedType: formattedType
    });

    const invoice = await Invoice.create({
      invoiceNumber: 'INV-' + Date.now(),
      customerType: formattedType,
      customerId: destinationId,
      products: [product.id],
      totalItems: 1
    });

    res.json({ message: 'Product assigned and invoice created', invoiceId: invoice.id });
  } catch (err) {
    console.error('Server error during assignment:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/assign-bulk', async (req, res) => {
  const { barcodes, destinationType, destinationId } = req.body;

  if (!barcodes || !Array.isArray(barcodes) || !destinationType || !destinationId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const assignedProducts = [];

    for (const barcode of barcodes) {
      const product = await Product.findOne({ where: { barcode } });
      if (product && !product.assigned) {
        await product.update({
          assigned: true,
          assignment: { type: destinationType, id: destinationId, date: new Date() },
          assignedTo: destinationId,
          assignedType: destinationType
        });
        assignedProducts.push(product.id);
      }
    }

    const invoice = await Invoice.create({
      invoiceNumber: 'INV-' + Date.now(),
      customerType: destinationType,
      customerId: destinationId,
      products: assignedProducts,
      totalItems: assignedProducts.length
    });

    res.json({ message: 'Assigned successfully', invoiceId: invoice.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during assignment' });
  }
});

router.get('/assigned', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        assigned: true,
        assignedType: { [Op.not]: null }
      }
    });

    // Split into dealer/retailer and others
    const dealerRetailer = products.filter(p =>
      ['Dealer', 'Retailer'].includes(p.assignedType)
    );
    const others = products.filter(p =>
      !['Dealer', 'Retailer'].includes(p.assignedType)
    );

    // Load related models for dealer/retailer
    const populated = await Promise.all(dealerRetailer.map(async (product) => {
      if (product.assignedType === 'Dealer') {
        const dealer = await Dealer.findByPk(product.assignedTo);
        return { ...product.toJSON(), assignedToDetails: dealer };
      } else if (product.assignedType === 'Retailer') {
        const retailer = await Retailer.findByPk(product.assignedTo);
        return { ...product.toJSON(), assignedToDetails: retailer };
      }
    }));

    const combined = [...populated, ...others.map(p => p.toJSON())];

    res.json(combined);
  } catch (err) {
    console.error('Error fetching assigned products:', err);
    res.status(500).json({ error: 'Failed to fetch assigned products' });
  }
});

router.get('/good', async (req, res) => {
  try {
    const products = await Product.findAll({ where: { status: 'good' } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching good products' });
  }
});

router.get('/bad', async (req, res) => {
  try {
    const products = await Product.findAll({ where: { status: 'bad' } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bad products' });
  }
});

router.put('/status/:barcode', async (req, res) => {
  const { barcode } = req.params;
  const { status } = req.body;

  try {
    const product = await Product.findOne({ where: { barcode } });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.update({ status });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/mark-good', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update({ status: 'good', wasUnderMaintenance: true, assigned: false });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/testing-count', async (req, res) => {
  try {
    const total = await Product.count({ where: { status: 'pending' } });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching testing count' });
  }
});

router.get('/maintenance-count', async (req, res) => {
  try {
    const total = await Product.count({ where: { status: 'bad' } });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching maintenance count' });
  }
});


router.get('/maintenance-out', async (req, res) => {
  try {
    const repaired = await Product.findAll({
      where: {
        wasUnderMaintenance: true,
        status: 'good'
      }
    });

    res.json(repaired);
  } catch (err) {
    console.error('Error fetching repaired products:', err);
    res.status(500).json({ error: 'Failed to fetch repaired products' });
  }
});

router.get('/good-count', async (req, res) => {
  try {
    const total = await Product.count({ where: { status: 'good', assigned: false } });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching good product count' });
  }
});

 router.post('/samples', async (req, res) => {
  const { barcode } = req.body;

  try {
    const product = await Product.findOne({
      where: { barcode, assigned: false }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update({
      assigned: true,
      status: 'assigned',
      assignedType: 'Sample',
      assignedAt: new Date()
    });

    res.json({ message: 'Product assigned to sample successfully' });
  } catch (err) {
    console.error('Error assigning sample:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/samples', async (req, res) => {
  try {
    const sampleProducts = await Product.findAll({
      where: {
        assigned: true,
        assignedType: 'Sample'
      }
    });
    res.json(sampleProducts);
  } catch (err) {
    console.error('Error fetching sample products:', err);
    res.status(500).json({ error: 'Failed to fetch sample products' });
  }
});


router.get('/samples/:sampleId/stock', async (req, res) => {
  const { sampleId } = req.params;

  try {
    const products = await Product.findAll({
      where: {
        assignedType: 'Sample',
        assignedTo: sampleId
      }
    });
    res.json(products);
  } catch (err) {
    console.error('Error fetching sample stock:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/gifts', async (req, res) => {
  const { barcode } = req.body;

  try {
    const product = await Product.findOne({
      where: { barcode, assigned: false }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found or already assigned' });
    }

    await product.update({
      assigned: true,
      assignedType: 'Gift'
    });

    res.json({ message: 'Product gifted successfully' });
  } catch (err) {
    console.error('Error gifting product:', err);
    res.status(500).json({ error: 'Failed to gift product' });
  }
});


router.get('/gifts', async (req, res) => {
  try {
    const gifts = await Product.findAll({
      where: {
        assigned: true,
        assignedType: 'Gift'
      }
    });
    res.json(gifts);
  } catch (err) {
    console.error('Error fetching gifted products:', err);
    res.status(500).json({ error: 'Failed to fetch gifted products' });
  }
});


module.exports = router;
