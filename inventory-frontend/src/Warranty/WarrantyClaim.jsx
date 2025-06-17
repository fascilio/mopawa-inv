// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; 

// function WarrantyClaim() {
//   const [claimNumber, setClaimNumber] = useState("");
//   const [claimSerialNumber, setClaimSerialNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const navigate = useNavigate();

//   const handleClaim = async (e) => {
//     e.preventDefault();
//     setSuccessMessage("");
//     setErrorMessage("");
//     setLoading(true);

//     try {
//       await axios.post(`${process.env.REACT_APP_BASE_URL}/api/warranty/claimWarranty`, {
//         phoneNumber: claimNumber,
//         serialNumber: claimSerialNumber,
//       });
//       setSuccessMessage("OTP sent successfully!");
//       setOtpSent(true);
//     } catch (error) {
//       setErrorMessage(error.response?.data?.message || "An error occurred.");
//     } finally {
//       setLoading(false);
//       setTimeout(() => {
//         setErrorMessage("");
//         setSuccessMessage("");
//       }, 3000);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setSuccessMessage("");
//     setErrorMessage("");
//     setLoading(true);

//     try {
//       const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/warranty/verifyOtp`, {
//         phoneNumber: claimNumber.trim(),
//         otp: otp.trim(),
//       });
//       setSuccessMessage(response.data.message);
//       setOtp("");
//       setOtpSent(false);
//     } catch (error) {
//       setErrorMessage(error.response?.data?.message || "Invalid OTP.");
//     } finally {
//       setLoading(false);
//       setTimeout(() => {
//         setErrorMessage("");
//         setSuccessMessage("");
//       }, 3000);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-6">
//         <button
//         onClick={() => navigate(-1)}
//         className="self-start text-sm text-blue-500 underline mb-2"
//       >
//         ← Back
//       </button>
//       <h2 className="font-bold text-2xl my-2">Claim Warranty</h2>

//       {errorMessage && <p className="text-red-600">{errorMessage}</p>}
//       {successMessage && <p className="text-green-600">{successMessage}</p>}

//       <form onSubmit={handleClaim} className="flex flex-col">
//         <div className="p-5">
//           <label htmlFor="claimSerialNumber" className="mr-10">Serial Number:</label>
//           <input
//             className="rounded-md font-sans"
//             type="text"
//             id="claimSerialNumber"
//             value={claimSerialNumber}
//             onChange={(e) => setClaimSerialNumber(e.target.value)}
//             required
//           />
//         </div>

//         <div className="p-5">
//           <label htmlFor="claimNumber" className="mr-10">Phone Number:</label>
//           <input
//             className="rounded-md font-sans"
//             placeholder="2547XXXXXXXX"
//             type="text"
//             id="claimNumber"
//             value={claimNumber}
//             onChange={(e) => setClaimNumber(e.target.value)}
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="text-white bg-blue-500 px-3 py-2 rounded-md mt-3"
//         >
//           {loading ? "Sending OTP..." : "Claim Warranty"}
//         </button>
//       </form>

//       {otpSent && (
//         <form onSubmit={handleVerifyOtp} className="flex flex-col items-center mt-4">
//           <label htmlFor="otp" className="mb-2 font-bold">Enter OTP:</label>
//           <input
//             type="text"
//             id="otp"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             className="rounded-md font-sans mb-3"
//             required
//           />
//           <button
//             type="submit"
//             className="text-white bg-green-500 px-3 py-2 rounded-md"
//           >
//             Verify OTP
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }

// export default WarrantyClaim;











import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function WarrantyClaim() {
  const [claimNumber, setClaimNumber] = useState("");
  const [claimSerialNumber, setClaimSerialNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleClaim = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/warranty/claimWarranty`, {
        phoneNumber: claimNumber,
        serialNumber: claimSerialNumber,
      });
      setSuccessMessage("OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 3000);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/warranty/verifyOtp`, {
        phoneNumber: claimNumber.trim(),
        otp: otp.trim(),
      });
      setSuccessMessage(response.data.message);
      setOtp("");
      setOtpSent(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 3000);
    }
  };

  const labelStyle = {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '6px'
  };

  const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
    fontSize: '16px',
    marginBottom: '10px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px'
  };

  const formStyle = {
    maxWidth: '400px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '16px'
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          alignSelf: 'flex-start',
          background: 'none',
          border: 'none',
          color: '#3b82f6',
          textDecoration: 'underline',
          fontSize: '14px',
          marginBottom: '10px',
          cursor: 'pointer'
        }}
      >
        ← Back
      </button>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Claim Warranty</h2>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleClaim} style={formStyle}>
        <div>
          <label htmlFor="claimSerialNumber" style={labelStyle}>Serial Number:</label>
          <input
            type="text"
            id="claimSerialNumber"
            value={claimSerialNumber}
            onChange={(e) => setClaimSerialNumber(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="claimNumber" style={labelStyle}>Phone Number:</label>
          <input
            type="text"
            id="claimNumber"
            placeholder="2547XXXXXXXX"
            value={claimNumber}
            onChange={(e) => setClaimNumber(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            backgroundColor: loading ? '#60a5fa' : '#3b82f6',
            color: 'white'
          }}
        >
          {loading ? "Sending OTP..." : "Claim Warranty"}
        </button>
      </form>

      {otpSent && (
        <form onSubmit={handleVerifyOtp} style={formStyle}>
          <label htmlFor="otp" style={labelStyle}>Enter OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={inputStyle}
          />
          <button
            type="submit"
            style={{
              ...buttonStyle,
              backgroundColor: '#22c55e',
              color: 'white'
            }}
          >
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
}

export default WarrantyClaim;
