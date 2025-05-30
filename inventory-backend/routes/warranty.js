const express = require('express');
const axios = require('axios')
const qs = require('qs')
require('dotenv').config();
const router = express.Router();
const Warranty = require('../models/Warranty');
const Product = require('../models/Product');
const Notification = require('../models/Notification'); 

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

// router.post("/register", async (req, res) => {
//     const { phone_number, serial_number } = req.body;
  
//     const exists = registrations.find(
//       (r) => r.phone_number === phone_number && r.serial_number === serial_number
//     );
//     if (exists) {
//       return res.status(400).json({ message: "Already registered." });
//     }
  
//   //   registrations.push({
//   //     phone_number,
//   //     serial_number,
//   //     registeredAt: new Date(),
//   //   });
  
//   registrations.push({
//       id: registrations.length + 1,
//       phone_number,
//       serial_number,
//       registeredAt: new Date(),
//       warrantyStatus: "active",
//       claimed: false
//     });
    
  
//     await sendSMS(
//       phone_number,
//       "Thank you. You have successfully registered your new power bank."
//     );
  
//     return res.status(200).json({ message: "Registered successfully." });
//   });

router.post("/register", async (req, res) => {
  const { phone_number, serial_number } = req.body;

  const exists = registrations.find(
    (r) => r.phone_number === phone_number && r.serial_number === serial_number
  );
  if (exists) {
    return res.status(400).json({ message: "Already registered." });
  }

  registrations.push({
    id: registrations.length + 1,
    phone_number,
    serial_number,
    registeredAt: new Date(),
    warrantyStatus: "active",
    claimed: false
  });

  // Send SMS
  await sendSMS(
    phone_number,
    "Thank you. You have successfully registered your new power bank."
  );

  // Save registration notification
  const notification = new Notification({
    phoneNumber: phone_number,
    serialNumber: serial_number,
    message: `New warranty registration by ${phone_number} for product ${serial_number}`
  });
  await notification.save().catch(err => console.error("Failed to save registration notification:", err));

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
    console.log("Generated OTP:", otp, "for", phoneNumber);
  
    return res.status(200).json({ message: "OTP sent." });
});

// router.post("/verifyOtp", (req, res) => {
//     const { phoneNumber, otp } = req.body;
//     const record = otpStore[phoneNumber];
//     const registration = registrations.find(r =>
//       r.phone_number === phoneNumber
//     );
        

//     if (registration) {
//       registration.claimed = true; 
//       registration.claimDate = new Date();
//     }
    
  
//     if (!record) {
//       return res.status(400).json({ message: "OTP not requested." });
//     }
//         console.log("Stored OTP:", record.otp, "Type:", typeof record.otp);
//         console.log("Received OTP:", otp, "Type:", typeof otp);
//     // if (record.otp !== otp) {
//     //   return res.status(400).json({ message: "Invalid OTP." });
//     // }
//     if (String(record.otp) !== String(otp)) {
//       return res.status(400).json({ message: "Invalid OTP." });
//     }
    
  
//     if (Date.now() > record.expiresAt) {
//       return res.status(400).json({ message: "OTP expired." });
//     }

  
//     delete otpStore[phoneNumber];
  
//     return res.status(200).json({ message: "OTP verified. You may claim warranty." });
// });
// router.post("/verifyOtp", (req, res) => {
//   const { phoneNumber, otp } = req.body;

//   console.log("Received phoneNumber:", phoneNumber);
//   console.log("Received OTP:", otp);
  
//   const record = otpStore[phoneNumber];
//   if (!record) {
//     return res.status(400).json({ message: "OTP not requested." });
//   }

//   console.log("Stored OTP:", record.otp, "Type:", typeof record.otp);
//   console.log("Received OTP:", otp, "Type:", typeof otp);

//   if (String(record.otp).trim() !== String(otp).trim()) {
//     return res.status(400).json({ message: "Invalid OTP." });
//   }

//   if (Date.now() > record.expiresAt) {
//     return res.status(400).json({ message: "OTP expired." });
//   }

//   const registration = registrations.find(r => r.phone_number === phoneNumber);
//   if (registration) {
//     registration.claimed = true;
//     registration.claimDate = new Date();
//   }

//   delete otpStore[phoneNumber];
//   return res.status(200).json({ message: "OTP verified. You may claim warranty." });
// });

router.post("/verifyOtp", (req, res) => {
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

    // Save notification
    const notification = new Notification({
      phoneNumber,
      serialNumber: registration.serial_number,
      message: `Warranty claim made by ${phoneNumber} for product ${registration.serial_number}`
    });

    notification.save().catch(err => console.error("Failed to save notification:", err));
  }

  delete otpStore[phoneNumber];

  return res.status(200).json({ message: "Successful. Visit any of our authorized outlets for help." });
});

router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Failed to load notifications." });
  }
});

router.post('/claim', async (req, res) => {
  const { phoneNumber, serialNumber } = req.body;

  try {
    const message = `Warranty claim made by ${phoneNumber} for product ${serialNumber}`;
    const notification = new Notification({
      phoneNumber,
      serialNumber,
      type: 'warranty-claim',
      message,
    });
    await notification.save();

    res.status(201).json({ message: 'Warranty claim submitted successfully.' });
  } catch (err) {
    console.error('Claim failed:', err);
    res.status(500).json({ error: 'Server error during claim.' });
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
