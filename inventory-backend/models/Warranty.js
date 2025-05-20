const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
  barcode: { type: String, required: true, unique: true },
  clientType: { type: String, enum: ['Dealer', 'Retailer'], required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'clientType' },
  registeredAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  claimed: { type: Boolean, default: false },
  claimDate: { type: Date },
});

module.exports = mongoose.model('Warranty', warrantySchema);
