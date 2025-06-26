import { useState, useEffect } from "react";
import axios from "axios";

function MpesaForm() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("1");
  const [message, setMessage] = useState("");
  const [agentAccount, setAgentAccount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("⏳ Waiting...");
  const [phoneError, setPhoneError] = useState("");

  const payNow = async () => {
    if (phoneError || !phone) return;

    setIsProcessing(true);
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/mpesa/stkpush`, {
        phone,
        amount,
        accountReference: agentAccount,
      });
      setMessage("Check your phone to complete payment.");
    } catch (err) {
      setMessage("Payment failed.");
      console.error(err);
    }
  };

  const pollPaymentStatus = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/mpesa/status?account=${agentAccount}`);
      if (res.data.status === "Success") {
        setStatus("✅ Payment Completed");
        setIsProcessing(false);
      } else if (res.data.status === "Cancelled") {
        setStatus("❌ Cancelled by user");
        setIsProcessing(false);
      } else if (res.data.status === "WrongPin") {
        setStatus("❌ Wrong PIN entered");
        setIsProcessing(false);
      } else {
        setStatus("⏳ Processing...");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let interval;
    if (isProcessing) {
      interval = setInterval(pollPaymentStatus, 3000);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, ""); 
    let formatted = raw;

    
    if (raw.startsWith("254") && raw.length <= 12) {
      formatted = raw;
      setPhoneError(raw.length === 12 ? "" : "Invalid format. Check the number and try again.");
    } else if (raw.startsWith("07") && raw.length <= 10) {
      formatted = "254" + raw.slice(1);
      setPhoneError(raw.length === 10 ? "" : "Invalid format. Check the number and try again.");
    } else {
      setPhoneError("Invalid format.");
    }

    setPhone(formatted);
  };

  return (
    <div style={{ position: "relative" }}>
      <fieldset disabled={isProcessing} style={{ opacity: isProcessing ? 0.5 : 1 }}>
        <h2>M-Pesa Payment</h2>

        <label>
          Phone number
          <input
            type="tel"
            value={phone}
            maxLength={12}
            onChange={handlePhoneChange}
          />
          {phoneError && <p style={{ color: "red", margin: "5px 0 0" }}>{phoneError}</p>}
        </label>

        <label>
          Account number
          <input
            placeholder="Agent ID or Phone"
            value={agentAccount}
            onChange={(e) => setAgentAccount(e.target.value)}
          />
        </label>

        <label>
          Amount
          <input
            type="number"
            placeholder="Amount"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <button onClick={payNow}>Send STK push</button>
        <p>{message}</p>
      </fieldset>

      {isProcessing && (
        <div style={overlayStyle}>
          <button
            onClick={() => {
              setIsProcessing(false);
              setPhone("");
              setAmount("1");
              setAgentAccount("");
              setMessage("");
              setStatus("⏳ Waiting...");
            }}
            style={closeButtonStyle}
          >
            X
          </button>
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>{status}</h2>
            <p>Please wait for the STK push prompt on your phone.</p>
          </div>
        </div>
      )}
    </div>
  );
}

const overlayStyle = {
  top: 0,
  left: 0,
  height: "100vh",
  width: "80vw",
  backgroundColor: "rgba(0,0,0,0.7)",
  color: "#fff",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  padding: "20px",
};

const closeButtonStyle = {
  background: "transparent",
  border: "2px solid white",
  color: "green",
  fontSize: "20px",
  cursor: "pointer",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  textAlign: "center",
  lineHeight: "36px",
  position: "absolute",
  top: "20px",
  right: "20px",
};

export default MpesaForm;
