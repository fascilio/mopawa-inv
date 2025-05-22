const express = require("express");
const axios = require("axios");
const moment = require("moment");
require("dotenv").config();
const router = express.Router();
const Payment = require('../models/Payments');

const {
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_CALLBACK_URL,
} = process.env;

async function getAccessToken() {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");
  const res = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: { Authorization: `Basic ${auth}` },
    }, //console.log("Encoded Auth Header:", auth)

  );
   return res.data.access_token;
}



router.post("/stkpush", async (req, res) => {
    const { phone, amount, accountReference } = req.body;
  
    //console.log("Incoming payment:", phone, amount, accountReference);
  
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString("base64");

    try {
      const token = await getAccessToken();
      //console.log("Access token:", token);
  
      const stkRes = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
          BusinessShortCode: MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: phone,
          PartyB: MPESA_SHORTCODE,
          PhoneNumber: phone,
          CallBackURL: MPESA_CALLBACK_URL,
          AccountReference: accountReference || "Payment",
          TransactionDesc: "Payment for goods",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log("STK push success:", stkRes.data);
      res.status(200).json({ message: "STK Push initiated", data: stkRes.data });
    } catch (err) {
      console.error("STK Error:", err.response?.data || err.message);
      res.status(500).json({ message: "STK Push failed", error: err.response?.data });
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
        transactionDate: details.TransactionDate,
      };
  
      console.log("✅ Payment received:", paymentRecord);
      await Payment.create(paymentRecord);
  
    } else {
      console.warn("❌ Payment failed:", result.ResultDesc);
    }
  
    res.json({ message: "Callback received" });
});

router.get("/payments", async (req, res) => {
    try {
      const payments = await Payment.find().sort({ createdAt: -1 });
      res.json(payments);
    } catch (err) {
      res.status(500).json({ message: "Error fetching payments" });
    }
});

module.exports = router;
