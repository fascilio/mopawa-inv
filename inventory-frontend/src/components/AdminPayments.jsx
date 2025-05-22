import { useEffect, useState } from "react";
import axios from "axios";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/payments");
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">M-Pesa Payments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Receipt</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td className="border p-2">{p.mpesaReceiptNumber}</td>
                <td className="border p-2">{p.phoneNumber}</td>
                <td className="border p-2">Ksh {p.amount}</td>
                <td className="border p-2">
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

export default AdminPayments;
