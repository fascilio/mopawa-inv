import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DealerReturnForm({ dealerId }) {
  const [barcode, setBarcode] = useState('');
  const [reason, setReason] = useState('');
  const [photo, setPhoto] = useState(null);
  const [returns, setReturns] = useState([]);
  const [error, setError] = useState('');

  const loadReturns = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dealers/${dealerId}/returns`);
      setReturns(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (dealerId) loadReturns();
  }, [dealerId]);

  const submitReturn = async () => {
    if (!barcode || !reason) {
      setError('Barcode and reason are required');
      return;
    }

    const formData = new FormData();
    formData.append('barcode', barcode);
    formData.append('reason', reason);
    if (photo) formData.append('photo', photo);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/dealers/${dealerId}/returns`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      setReturns([...returns, res.data]);
      setBarcode('');
      setReason('');
      setPhoto(null);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to submit return');
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Returned Products</h3>
      <input
        type="text"
        placeholder="Barcode"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        style={{ padding: '8px', marginRight: '10px' }}
      />
      <input
        type="text"
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        style={{ padding: '8px', marginRight: '10px' }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
        style={{ marginRight: '10px' }}
      />
      <button onClick={submitReturn}>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ marginTop: '20px' }}>
        {returns.map(ret => (
          <li key={ret.id || ret._id}>
            {ret.barcode} - {ret.reason}
            {ret.imageUrl && (
              <div>
                <img
                  src={`${process.env.REACT_APP_BASE_URL}${ret.imageUrl}`}
                  alt="Return"
                  style={{ width: '100px', marginTop: '5px' }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DealerReturnForm;
