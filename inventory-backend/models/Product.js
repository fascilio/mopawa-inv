// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   barcode: String,
//   status: {
//     type: String,
//     enum: ['pending', 'good', 'bad'],
//     default: 'pending',
//   },
//   category: {
//     type: String,
//     enum: ['dealer', 'retail', 'sample', 'gift', null],
//     default: null,
//   },
//   dealerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Dealer',
//     default: null,
//   },
//   assigned: {
//     type: Boolean,
//     default: false,
//   },
//   wasUderMaintenance: {
//     type: Boolean,
//     default: false
//   },
//   assignedTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     refPath: 'assignedType', 
//   },
//   assignedType: {
//     type: String,
//     enum: ['Dealer', 'Retailer'],
//   },
//   assignment: {
//     type: {
//       type: String, 
//     },
//     id: {
//       type: mongoose.Schema.Types.ObjectId,
//       refPath: 'assignment.type',
//     },
//     date: Date,
//   },
//   // maintenanceHistory: { type: Boolean, default: false },
  
// }, { timestamps: true });

// module.exports = mongoose.model('Product', productSchema);


const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  barcode: {
    type: String,
    required: true,
    unique: true,
  },

  status: {
    type: String,
    enum: ['pending', 'good', 'bad', 'assigned'], 
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

  wasUnderMaintenance: {   
    type: Boolean,
    default: false,
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'assignedType',
    default: null,
  },

  assignedType: {
    type: String,
    enum: ['Dealer', 'Retailer', 'Sample', 'Gift'],  
    default: null,
  },

  assignment: {
    type: {
      type: String,
      enum: ['Dealer', 'Retailer', 'Sample', 'Gift', null],
      default: null,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'assignment.type',
      default: null,
    },
    date: Date,
  },


}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
