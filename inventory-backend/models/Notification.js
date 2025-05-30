// const mongoose = require('mongoose');

// const notificationSchema = new mongoose.Schema({
//   phoneNumber: String,
//   serialNumber: String,
//   type: { type: String, default: 'warranty-claim' },
//   message: String,
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Notification', notificationSchema);

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  serialNumber: { type: String, required: true },
  type: { type: String, enum: ['warranty-registration', 'warranty-claim'], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
