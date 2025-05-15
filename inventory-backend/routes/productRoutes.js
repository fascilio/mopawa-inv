const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');

router.post('/receive', async (req, res) => {
  const { barcode } = req.body;

  try {
    const existingProduct = await Product.findOne({ barcode });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product already registered' });
    }

    const newProduct = new Product({ barcode });
    await newProduct.save();

    res.status(201).json({ message: 'Product registered successfully' });
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).json({ message: 'Server error' });
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


router.post('/assign', async (req, res) => {
  const { barcode, destinationType, destinationId } = req.body;

  console.log('Incoming assignment request:');
  console.log('Barcode:', barcode);
  console.log('Destination Type:', destinationType);
  console.log('Destination ID:', destinationId);

  if (!barcode || !destinationType || !destinationId) {
    console.log('❌ Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const product = await Product.findOne({ barcode });
    if (!product) {
      console.log('❌ Product not found for barcode:', barcode);
      return res.status(404).json({ error: 'Product not found' });
    }

    product.assigned = true;

    const formattedType = destinationType.charAt(0).toUpperCase() + destinationType.slice(1).toLowerCase();

    product.assignment = {
      type: formattedType,
      id: destinationId,
      date: new Date(),
    };

    product.assignedTo = destinationId;
    product.assignedType = formattedType;

    await product.save();

    const invoice = new Invoice({
      invoiceNumber: 'INV-' + Date.now(),
      customerType: formattedType, 
      customer: destinationId,
      products: [product._id], 
      totalItems: 1
    });

    await invoice.save();

    console.log('✅ Product assigned and invoice created');
    res.json({ message: 'Product assigned and invoice created', invoiceId: invoice._id });

  } catch (err) {
    console.error('❌ Server error during assignment:', err);
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
      const product = await Product.findOne({ barcode });
      if (product && !product.assigned) {
        product.assigned = true;
        product.assignment = {
          type: destinationType,
          id: destinationId,
          date: new Date(),
        };
        product.assignedTo = destinationId;
        product.assignedType = destinationType;
        await product.save();
        assignedProducts.push(product._id);
      }
    }

    // Create invoice
    const invoice = new Invoice({
      invoiceNumber: 'INV-' + Date.now(),
      customerType: destinationType,
      customer: destinationId,
      products: assignedProducts,
      totalItems: assignedProducts.length
    });
    await invoice.save();

    res.json({ message: 'Assigned successfully', invoiceId: invoice._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during assignment' });
  }
});



// GET /api/products/assigned
router.get('/assigned', async (req, res) => {
  try {
    const assignedProducts = await Product.find({ assigned: true }).populate('assignedTo');
    res.json(assignedProducts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assigned products' });
  }
});

  // GET good products
router.get('/good', async (req, res) => {
    const products = await Product.find({ status: 'good' });
    res.json(products);
});

  // GET bad (maintenance) products
  router.get('/bad', async (req, res) => {
    const products = await Product.find({ status: 'bad' });
    res.json(products);
  });
  
  router.post('/', async (req, res) => {
    const { barcode, status } = req.body;
  
    try {
      const exists = await Product.findOne({ barcode });
      if (exists) return res.status(400).json({ message: 'Product already exists' });
  
      const product = new Product({ barcode, status });
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

  router.put('/status/:barcode', async (req, res) => {
    const { barcode } = req.params;
    const { status } = req.body;
  
    try {
      const product = await Product.findOne({ barcode });
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      product.status = status;
      await product.save();
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // PUT /api/products/:id/mark-good
router.put('/:id/mark-good', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'good' },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error updating product status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// routes or controller file
router.get('/testing-count', async (req, res) => {
  try {
    const total = await Product.countDocuments({ status: 'pending' });
    res.json({ total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching testing count' });
  }
});
 
module.exports = router;
