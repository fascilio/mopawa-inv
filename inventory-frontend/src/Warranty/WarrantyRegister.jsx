import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function WarrantyRegister() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessBox, setShowSuccessBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setShowSuccessBox(false);
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
      setShowSuccessBox(true);
      setTimeout(() => {
        setShowSuccessBox(false);
      }, 3000);
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
    backgroundColor: '#facc15',
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
    color: '#3b82f6',
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

      {showSuccessBox && (
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #16a34a',
          color: '#16a34a',
          padding: '30px',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '100%',
        }}>
          <div style={{ fontSize: '64px', fontWeight: 'bold' }}>✅</div>
          <h3 style={{ margin: 0 }}>Success!</h3>
          <p style={{ textAlign: 'center', margin: 0 }}>
            You have successfully registered your product.
          </p>
        </div>
      )}

      {errorMessage && <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}

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
