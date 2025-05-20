const express = require('express');
const router = express.Router();
const Warranty = require('../models/Warranty');
const Product = require('../models/Product');

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
    //console.log("Credentials:", process.env.USER_ID, process.env.PASSWORD, process.env.SENDER_ID);


    console.log("SMS API response:", response.data);
  } catch (err) {
    console.error("Failed to send SMS:", err.response?.data || err.message);
  }
}

router.post("/register", async (req, res) => {
    const { phone_number, serial_number } = req.body;
  
    const exists = registrations.find(
      (r) => r.phone_number === phone_number && r.serial_number === serial_number
    );
    if (exists) {
      return res.status(400).json({ message: "Already registered." });
    }
  
  //   registrations.push({
  //     phone_number,
  //     serial_number,
  //     registeredAt: new Date(),
  //   });
  
  registrations.push({
      id: registrations.length + 1,
      phone_number,
      serial_number,
      registeredAt: new Date(),
      warrantyStatus: "active",
      claimed: false
    });
    
  
    await sendSMS(
      phone_number,
      "Thank you. You have successfully registered your new power bank."
    );
  
    return res.status(200).json({ message: "Registered successfully." });
  });



router.post("/getWarrantySms", async (req, res) => {
    const { phoneNumber, serialNumber } = req.body;
  
    const record = registrations.find(
      (r) =>
        r.phone_number === phoneNumber && r.serial_number === serialNumber
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
  
    return res.status(200).json({ message: "OTP sent." });
});

router.post("/verifyOtp", (req, res) => {
    const { phoneNumber, otp } = req.body;
    const record = otpStore[phoneNumber];
    const registration = registrations.find(r =>
      r.phone_number === phoneNumber
    );
    
    if (registration) {
      registration.claimed = true; 
      registration.claimDate = new Date();
    }
    
  
    if (!record) {
      return res.status(400).json({ message: "OTP not requested." });
    }
  
    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }
  
    if (Date.now() > record.expiresAt) {
      return res.status(400).json({ message: "OTP expired." });
    }
  
    delete otpStore[phoneNumber];
  
    return res.status(200).json({ message: "OTP verified. You may claim warranty." });
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
