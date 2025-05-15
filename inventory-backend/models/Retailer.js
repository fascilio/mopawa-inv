const mongoose = require('mongoose');

const retailerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Retailer', retailerSchema);
