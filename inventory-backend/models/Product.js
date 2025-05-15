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
  },
  assigned: {
    type: Boolean,
    default: false,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'assignedType', 
  },
  assignedType: {
    type: String,
    enum: ['Dealer', 'Retailer'],
  },
  assignment: {
    type: {
      type: String, 
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'assignment.type',
    },
    date: Date,
  },
  
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
