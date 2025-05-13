const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  barcode: String,
  status: {
    type: String,
    enum: ['pending', 'good', 'bad'],
    default: 'pending',
  },
  category: {
    type: String,
    enum: ['dealer', 'retail', 'sample', 'gift', null],
    default: null,
  },
  dealerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer',
    default: null,
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
