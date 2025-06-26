const express = require('express');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();
const router = express.Router();
const Warranty = require('../models/Warranty');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const { Op } = require('sequelize');

const registrations = [];
const otpStore = {};

async function sendSMS(phone, message) {
  const payload = {
    userid: process.env.USER_ID,
    password: process.env.PASSWORD,
    mobile: phone,
    msg: message,
    senderid: process.env.SENDER_ID,
    msgType: "text",
    sendMethod: "quick",
    duplicatecheck: "true",
    output: "json",
  };

  try {
    const response = await axios.post(
      "https://smsportal.hostpinnacle.co.ke/SMSApi/send",
      qs.stringify(payload),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    console.log("SMS API response:", response.data);
  } catch (err) {
    console.error("Failed to send SMS:", err.response?.data || err.message);
  }
}

router.post("/register", async (req, res) => {
  const { phone_number, serial_number } = req.body;

  try {
    // 1. Check if product with the given barcode exists
    const product = await Product.findOne({ where: { barcode: serial_number } });
    if (!product) {
      return res.status(400).json({ message: "Invalid, Product not found." });
    }

    // 2. Check how many warranties this number has registered already
    const phoneWarranties = await Warranty.count({ where: { clientId: phone_number } });
    if (phoneWarranties >= 2) {
      return res.status(400).json({ message: "Out of limit with this number, please try another phone number to register your warranty." });
    }

    // 3. Prevent duplicate registration for same barcode
    const alreadyRegistered = await Warranty.findOne({ where: { barcode: serial_number } });
    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already registered." });
    }

    // 4. Save to Warranty table
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    await Warranty.create({
      barcode: serial_number,
      clientType: product.assignedType || "Dealer", // fallback
      clientId: product.assignmentId || phone_number,
      registeredAt: new Date(),
      expiresAt: sixMonthsFromNow,
      claimed: false
    });

    // 5. Send SMS
    await sendSMS(
      phone_number,
      `You have successfully registered your new power bank.\nProduct: ${serial_number}\nThank you for choosing Mopawa.`
    );

    // 6. Save Notification
    await Notification.create({
      phoneNumber: phone_number,
      serialNumber: serial_number,
      message: `New warranty registration by ${phone_number} for product ${serial_number}`,
      type: "warranty-registration",
    });

    return res.status(200).json({ message: `Registered successfully for ${serial_number}` });

  } catch (err) {
    console.error("Warranty registration error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});



router.post("/claimWarranty", async (req, res) => {
  const { phoneNumber, serialNumber } = req.body;

  const record = registrations.find(
    (r) => r.phone_number === phoneNumber && r.serial_number === serialNumber
  );

  if (!record) {
    return res.status(404).json({ message: "Warranty not found." });
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  if (new Date(record.registeredAt) < sixMonthsAgo) {
    return res.status(400).json({ message: "Warranty has expired." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phoneNumber] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  await sendSMS(phoneNumber, `Your warranty OTP is: ${otp}`);
  console.log("Generated OTP:", otp, "for", phoneNumber);

  return res.status(200).json({ message: "OTP sent." });
});

router.post("/verifyOtp", async (req, res) => {
  const { phoneNumber, otp } = req.body;
  const record = otpStore[phoneNumber];
  const registration = registrations.find(r => r.phone_number === phoneNumber);

  if (!record) {
    return res.status(400).json({ message: "OTP not requested." });
  }

  if (String(record.otp) !== String(otp)) {
    return res.status(400).json({ message: "Invalid OTP." });
  }

  if (Date.now() > record.expiresAt) {
    return res.status(400).json({ message: "OTP expired." });
  }

  if (registration) {
    registration.claimed = true;
    registration.claimDate = new Date();

    try {
      await Notification.create({
        phoneNumber,
        serialNumber: registration.serial_number,
        message: `Warranty claim made by ${phoneNumber} for product ${registration.serial_number}`,
        type: 'warranty-claim'
      });
    } catch (err) {
      console.error("Failed to save notification:", err);
    }
  }

  delete otpStore[phoneNumber];
  return res.status(200).json({ message: "Successful. Visit any of our authorized outlets for help." });
});

router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Failed to load notifications." });
  }
});

router.get("/registrations", (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const enriched = registrations.map(r => {
    const isExpired = new Date(r.registeredAt) < sixMonthsAgo;
    return {
      ...r,
      warrantyStatus: isExpired ? "expired" : "active"
    };
  });

  res.json(enriched);
});

module.exports = router;
