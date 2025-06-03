import { useEffect, useState } from "react";
import axios from "axios";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        //const res = await axios.get("http://localhost:5000/api/mpesa/payments");
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/mpesa/payments`);
        setPayments(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch payments", error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
        M-Pesa Payments
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ccc",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f3f3f3" }}>
              <th style={thStyle}>Receipt</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td style={tdStyle}>{p.mpesaReceiptNumber}</td>
                <td style={tdStyle}>{p.phoneNumber}</td>
                <td style={tdStyle}>Ksh {p.amount}</td>
                <td style={tdStyle}>
                  {new Date(p.transactionDate).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
  fontWeight: "bold",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};

export default AdminPayments;
