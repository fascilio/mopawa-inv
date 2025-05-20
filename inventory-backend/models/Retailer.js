const mongoose = require('mongoose');

const retailerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isTeamLeader: {
    type: Boolean,
    default: false
  },
  teamLeader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retailer',
    default: null
  }
});

module.exports = mongoose.model('Retailer', retailerSchema);
