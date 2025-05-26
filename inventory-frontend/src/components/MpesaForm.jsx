// import { useState } from "react";
// import axios from "axios";

// function MpesaForm() {
//   const [phone, setPhone] = useState("");
//   const [amount, setAmount] = useState("");
//   const [message, setMessage] = useState("");
//   const [agentAccount, setAgentAccount] = useState(""); 

//   const payNow = async () => {
//     try {
//       const res = await axios.post("http://localhost:5000/api/mpesa/stkpush", {
//         phone,
//         amount,
//         // accountReference: "PowerBank123", 
//         accountReference: agentAccount,
//       });
//       setMessage("Check your phone to complete payment.");
//     } catch (err) {
//       setMessage("Payment failed.");
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h2>M-Pesa Payment</h2>
//       <input
//         placeholder="2547XXXXXXXX"
//         value={phone}
//         onChange={(e) => setPhone(e.target.value)}
//       />
//       <input
//         placeholder="Agent ID or Phone"
//         value={agentAccount}
//         onChange={(e) => setAgentAccount(e.target.value)}
//       />
//       <input
//         type="number"
//         placeholder="Amount"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />
//       <button onClick={payNow}>Pay Now</button>
//       <p>{message}</p>
//     </div>
//   );
// }

// export default MpesaForm;



















import { useState } from "react";
import axios from "axios";

function MpesaForm() {
  const [phone, setPhone] = useState("254");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [agentAccount, setAgentAccount] = useState("");

  const payNow = async () => {
    try {
      await axios.post("http://localhost:5000/api/mpesa/stkpush", {
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

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, ""); 
    if (input.startsWith("254")) {
      setPhone(input.slice(0, 12)); // Limit to 12 digits (2547XXXXXXXX)
    } else {
      setPhone("254" + input.slice(0, 9)); 
    }
  };

  return (
    <div>
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
        Agent ID or Phone
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

      <button onClick={payNow}>Pay Now</button>
      <p>{message}</p>
    </div>
  );
}

export default MpesaForm;


