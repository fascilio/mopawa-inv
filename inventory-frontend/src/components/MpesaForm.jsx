import { useState } from "react";
import axios from "axios";

function MpesaForm() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const payNow = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/mpesa/stkpush", {
        phone,
        amount,
        accountReference: "PowerBank123", 
      });
      setMessage("Check your phone to complete payment.");
    } catch (err) {
      setMessage("Payment failed.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>M-Pesa Payment</h2>
      <input
        placeholder="2547XXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={payNow}>Pay Now</button>
      <p>{message}</p>
    </div>
  );
}

export default MpesaForm;
