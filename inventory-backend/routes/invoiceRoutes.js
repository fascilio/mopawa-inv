const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Dealer = require('../models/Dealer');
const Retailer = require('../models/Retailer');
const generateInvoicePdf = require('../utils/generateInvoicePdf');
const path = require('path');

// GET: Download invoice as PDF
router.get('/:id/download', async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);

    if (!invoice) return res.status(404).send('Invoice not found');

    let customer;
    if (invoice.customerType === 'Dealer') {
      customer = await Dealer.findByPk(invoice.customerId);
    } else if (invoice.customerType === 'Retailer') {
      customer = await Retailer.findByPk(invoice.customerId);
    }

    const filename = `${invoice.invoiceNumber}.pdf`;
    const filePath = path.join(__dirname, '..', 'invoices', filename);

    // Manually pass products if needed later
    generateInvoicePdf(invoice, customer, [], filePath); // Empty array for products

    setTimeout(() => {
      res.download(filePath);
    }, 500);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating invoice');
  }
});

// GET: View invoice JSON
router.get('/:invoiceId', async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.invoiceId);

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    let customer;
    if (invoice.customerType === 'Dealer') {
      customer = await Dealer.findByPk(invoice.customerId);
    } else if (invoice.customerType === 'Retailer') {
      customer = await Retailer.findByPk(invoice.customerId);
    }

    res.json({ invoice, customer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// GET: View invoice as inline PDF
router.get('/:id/view', async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);

    if (!invoice) return res.status(404).send('Invoice not found');

    let customer;
    if (invoice.customerType === 'Dealer') {
      customer = await Dealer.findByPk(invoice.customerId);
    } else if (invoice.customerType === 'Retailer') {
      customer = await Retailer.findByPk(invoice.customerId);
    }

    const filename = `${invoice.invoiceNumber}.pdf`;
    const filePath = path.join(__dirname, '..', 'invoices', filename);

    generateInvoicePdf(invoice, customer, [], filePath); 

    setTimeout(() => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
      res.sendFile(filePath);
    }, 500);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating invoice');
  }
});

module.exports = router;
