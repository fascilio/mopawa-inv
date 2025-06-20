const express = require("express");
const axios = require("axios");
const moment = require("moment");
require("dotenv").config();
const router = express.Router();
const Payment = require("../models/Payments"); // Sequelize model

const {
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_CALLBACK_URL,
} = process.env;

async function getAccessToken() {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");

  try {
    const res = await axios.get(
      "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );
    return res.data.access_token;
  } catch (err) {
    console.error("Access Token Error:", err.response?.data || err.message);
    throw err;
  }
}

router.post("/stkpush", async (req, res) => {
  const { phone, amount, accountReference } = req.body;
  const sanitizedPhone = phone.replace(/^0/, "254");
  const timestamp = moment().format("YYYYMMDDHHmmss");
  const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString("base64");

  try {
    const token = await getAccessToken();

    const payload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: sanitizedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: sanitizedPhone,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: accountReference || "Payment",
      TransactionDesc: "Payment for goods",
    };

    const stkRes = await axios.post(
      "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json({ message: "STK Push initiated", data: stkRes.data });
  } catch (err) {
    res.status(500).json({
      message: "STK Push failed",
      error: err.response?.data || err.message,
    });
  }
});

router.post("/callback", async (req, res) => {
  const data = req.body;
  console.log("M-PESA Callback:", JSON.stringify(data, null, 2));

  const result = data.Body?.stkCallback;
  if (result?.ResultCode === 0) {
    const details = result.CallbackMetadata.Item.reduce((acc, item) => {
      acc[item.Name] = item.Value;
      return acc;
    }, {});

    const paymentRecord = {
      mpesaReceiptNumber: details.MpesaReceiptNumber,
      phoneNumber: details.PhoneNumber,
      amount: details.Amount,
      transactionDate: moment(details.TransactionDate, "YYYYMMDDHHmmss").toDate(),
      accountReference: details.AccountReference || "Unknown",
    };

    console.log("✅ Payment received:", paymentRecord);
    await Payment.create(paymentRecord);
  } else {
    console.warn("❌ Payment failed:", result?.ResultDesc);
  }

  res.json({ message: "Callback received" });
});

router.get("/status", async (req, res) => {
  const { account } = req.query;
  try {
    const payment = await Payment.findOne({
      where: { accountReference: account },
      order: [["createdAt", "DESC"]],
    });

    if (!payment) return res.json({ status: "Pending" });
    res.json({ status: "Paid" });
  } catch (err) {
    res.status(500).json({ message: "Error checking status" });
  }
});

router.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments" });
  }
});

module.exports = router;
