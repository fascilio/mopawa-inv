const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
// const Sample = require('../models/Samples');

router.post('/receive', async (req, res) => {
  console.log('Received barcode:', req.body);
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

// DELETE /api/products/delete-by-barcode/:barcode
router.delete('/delete-by-barcode/:barcode', async (req, res) => {
  const { barcode } = req.params;

  try {
    const deleted = await Product.findOneAndDelete({ barcode });

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', deleted });
  } catch (err) {
    console.error('Error deleting product by barcode:', err);
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

// GET /api/products/all
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const detailed = products.map(product => ({
      _id: product._id,
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
    const tested = await Product.find({ status:  {$in: ['good', 'bad'] } });
    res.json(tested);
  }catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to fetch tested products'});
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
  console.log('assigned:', req.body)
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


router.get('/assigned', async (req, res) => {
  try {
    // Fetch all assigned products
    const products = await Product.find({ assigned: true, assignedType: { $exists: true, $ne: null } });

    // Separate into ones that can be populated and ones that cannot
    const canPopulate = products.filter(p => ['Dealer', 'Retailer'].includes(p.assignedType));
    const cannotPopulate = products.filter(p => !['Dealer', 'Retailer'].includes(p.assignedType));

    // Populate those that can
    const populated = await Product.populate(canPopulate, { path: 'assignedTo' });

    // Combine back
    const combined = [...populated, ...cannotPopulate];

    res.json(combined);
  } catch (err) {
    console.error('Error fetching assigned products:', err);
    res.status(500).json({ error: 'Failed to fetch assigned products' });
  }
});


router.get('/good', async (req, res) => {
    const products = await Product.find({ status: 'good' });
    res.json(products);
});

  router.get('/bad', async (req, res) => {
    const products = await Product.find({ status: 'bad' });
    res.json(products);
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

router.put('/:id/mark-good', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        status: 'good',
        wasUnderMaintenance: true, 
        assigned: false 
      },
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

router.get('/testing-count', async (req, res) => {
  try {
    const total = await Product.countDocuments({ status: 'pending' });
    res.json({ total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching testing count' });
  }
});

router.get('/maintenance-out', async (req, res) => {
  try {
    const repaired = await Product.find({ wasUnderMaintenance: true, status: 'good' });
    res.json(repaired);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch repaired products' });
  }
});

router.get('/maintenance-count', async (req, res) => {
  try {
    const total = await Product.countDocuments({ status: 'bad' });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching maintenance count' });
  }
});

router.get('/good-count', async (req, res) => {
  try {
    const total = await Product.countDocuments({ status: 'good', assigned: false });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching good product count' });
  }
});


router.post('/samples', async (req, res) => {
  const { barcode } = req.body;

  try {
    const product = await Product.findOne({ barcode, assigned: false });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.assigned = true;
    product.status = 'assigned'; 
    product.assignedType = "Sample"; 
    product.assignedAt = new Date();

    await product.save();

    res.json({ message: 'Product assigned to sample successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/samples', async (req, res) => {
  try {
    const sampleProducts = await Product.find({ assigned: true, assignedType: 'Sample' });
    res.json(sampleProducts);
  } catch (err) {
    console.error('Error fetching sample products:', err);
    res.status(500).json({ error: 'Failed to fetch sample products' });
  }
});

router.get('/samples/:sampleId/stock', async (req, res) => {
  try {
    const { sampleId } = req.params;
    const products = await Product.find({
      assignedType: 'Sample',
      assignedTo: sampleId
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
    const product = await Product.findOne({ barcode, assigned: false });

    if (!product) {
      return res.status(404).json({ error: 'Product not found or already assigned' });
    }

    product.assigned = true;
    product.assignedType = 'Gift';
    await product.save();

    res.json({ message: 'Product gifted successfully' });
  } catch (err) {
    console.error('Error gifting product:', err);
    res.status(500).json({ error: 'Failed to gift product' });
  }
});

router.get('/gifts', async (req, res) => {
  try {
    const gifts = await Product.find({ assigned: true, assignedType: 'Gift' });
    res.json(gifts);
  } catch (err) {
    console.error('Error fetching gifted products:', err);
    res.status(500).json({ error: 'Failed to fetch gifted products' });
  }
});

 
module.exports = router;
