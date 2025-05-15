const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  customerType: {
    type: String, 
    enum: ['Dealer', 'Retailer']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'customerType'
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  totalItems: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
