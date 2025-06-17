// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; 

// function WarrantyRegister() {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [serialNumber, setSerialNumber] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccessMessage("");
//     setErrorMessage("");
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_BASE_URL}/api/warranty/register`,
//         {
//           phone_number: phoneNumber,
//           serial_number: serialNumber,
//         }
//       );
//       setSuccessMessage("Warranty registered successfully!");
//       setPhoneNumber("");
//       setSerialNumber("");
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

//   return (
//     <div className="flex flex-col items-center p-6">
//         <button
//         onClick={() => navigate(-1)}
//         className="self-start text-sm text-blue-500 underline mb-2"
//       >
//         ← Back
//       </button>
//       <h2 className="font-bold text-2xl my-2">Register Warranty</h2>
//       <p style={{ color: 'black' }}>Please note that warranty details cannot be changed once registered</p>

//       {errorMessage && <p className="text-red-600">{errorMessage}</p>}
//       {successMessage && <p className="text-green-600">{successMessage}</p>}

//       <form onSubmit={handleSubmit} className="flex flex-col">
//         <div className="p-5">
//           <label htmlFor="serialNumber" className="mr-10">Serial Number:</label>
//           <input
//             className="rounded-md font-sans"
//             type="text"
//             id="serialNumber"
//             value={serialNumber}
//             onChange={(e) => setSerialNumber(e.target.value)}
//             required
//           />
//         </div>

//         <div className="p-5">
//           <label htmlFor="phoneNumber" className="mr-10">Phone Number:</label>
//           <input
//             className="rounded-md font-sans"
//             placeholder="2547XXXXXXXX"
//             type="text"
//             id="phoneNumber"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="text-white bg-yellow-400 px-3 py-2 rounded-md mt-3"
//         >
//           {loading ? "Registering..." : "Register Warranty"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default WarrantyRegister;









import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function WarrantyRegister() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/warranty/register`,
        {
          phone_number: phoneNumber,
          serial_number: serialNumber,
        }
      );
      setSuccessMessage("Warranty registered successfully!");
      setPhoneNumber("");
      setSerialNumber("");
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

  const buttonStyle = {
    backgroundColor: '#facc15', // yellow-400
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '16px',
  };

  const backStyle = {
    alignSelf: 'flex-start',
    color: '#3b82f6', // blue-500
    textDecoration: 'underline',
    fontSize: '14px',
    marginBottom: '10px',
    cursor: 'pointer',
    background: 'none',
    border: 'none'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold',
  };

  const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
    fontSize: '16px',
  };

  const fieldContainerStyle = {
    marginBottom: '20px',
  };

  const formStyle = {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button onClick={() => navigate(-1)} style={backStyle}>
        ← Back
      </button>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Register Warranty</h2>
      <p style={{ color: 'black', marginBottom: '16px' }}>
        Please note that warranty details cannot be changed once registered
      </p>

      {errorMessage && <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={fieldContainerStyle}>
          <label htmlFor="serialNumber" style={labelStyle}>Serial Number:</label>
          <input
            type="text"
            id="serialNumber"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldContainerStyle}>
          <label htmlFor="phoneNumber" style={labelStyle}>Phone Number:</label>
          <input
            placeholder="2547XXXXXXXX"
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            backgroundColor: loading ? '#eab308' : buttonStyle.backgroundColor,
          }}
        >
          {loading ? "Registering..." : "Register Warranty"}
        </button>
      </form>
    </div>
  );
}

export default WarrantyRegister;
