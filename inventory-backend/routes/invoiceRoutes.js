const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const generateInvoicePdf = require('../utils/generateInvoicePdf');
const path = require('path');

router.get('/:id/download', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer')
      .populate('products');

    if (!invoice) return res.status(404).send('Invoice not found');

    const filename = `${invoice.invoiceNumber}.pdf`;
    const filePath = path.join(__dirname, '..', 'invoices', filename);

    generateInvoicePdf(invoice, invoice.customer, invoice.products, filePath);

    setTimeout(() => {
      res.download(filePath);
    }, 500);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating invoice');
  }
});

router.get('/:invoiceId', async (req, res) => {
  const invoice = await Invoice.findById(req.params.invoiceId).populate('products') .populate('customer');
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  res.json(invoice);
});

router.get('/:id/view', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer')
      .populate('products');

    if (!invoice) return res.status(404).send('Invoice not found');

    const filename = `${invoice.invoiceNumber}.pdf`;
    const filePath = path.join(__dirname, '..', 'invoices', filename);

    generateInvoicePdf(invoice, invoice.customer, invoice.products, filePath);

    // Wait briefly for the PDF to be generated
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
