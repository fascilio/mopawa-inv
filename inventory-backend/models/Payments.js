const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  mpesaReceiptNumber: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionDate: { type: Date, required: true },
  accountReference: {type:String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
