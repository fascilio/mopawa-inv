import { useState, useEffect } from "react";
import axios from "axios";

function MpesaForm() {
  const [phone, setPhone] = useState("254");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [agentAccount, setAgentAccount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); 
  const [status, setStatus] = useState("⏳ Waiting...");

  const payNow = async () => {
    setIsProcessing(true); 
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/mpesa/stkpush`, {
      //("http://localhost:5000/api/mpesa/stkpush", {
        phone,
        amount,
        accountReference: agentAccount,
      });
      setMessage("Check your phone to complete payment.");
    } catch (err) {
      setMessage("Payment failed.");
      console.error(err);
    } finally {
      // Keep overlay until user closes it manually
    }
  };

  const pollPaymentStatus = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/mpesa/status?account=${agentAccount}`);
      //(`http://localhost:5000/api/mpesa/status?account=${agentAccount}`);
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
    const input = e.target.value.replace(/\D/g, "");
    if (input.startsWith("254")) {
      setPhone(input.slice(0, 12));
    } else {
      setPhone("254" + input.slice(0, 9));
    }
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
              setPhone("254");
              setAmount("");
              setAgentAccount("");
              setMessage("");
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
  // position: "fixed",
  top: 0,
   left: 0,
   height: "100vh",
   width: "80vw",
   backgroundColor: "rgba(0,0,0,0.7)",
   color: "#fff",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  // alignItems: "flex-end",
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
