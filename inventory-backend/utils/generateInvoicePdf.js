const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateInvoicePdf = (invoice, customer, products, path) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(path));

  doc.fontSize(20).text('Invoice', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Invoice #: ${invoice.invoiceNumber}`);
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`);
  doc.text(`Customer: ${customer.name}`);
  doc.text(`Type: ${invoice.customerType}`);
  doc.moveDown();

  doc.text('Products:');
  products.forEach((p, i) => {
    doc.text(`${i + 1}. ${p.barcode}`);
  });

  doc.text(`\nTotal Items: ${invoice.totalItems}`);
  doc.end();
};

module.exports = generateInvoicePdf;
