import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarcodeInputScanner from '../components/BarcodeScanner';

function AssignProducts() {
  const [barcodes, setBarcodes] = useState([]);
  const [destinationType, setDestinationType] = useState('dealer'); 
  const [destinationId, setDestinationId] = useState('');
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/${destinationType}s`)
      //.get(`http://localhost:5000/api/${destinationType}s`)
      .then((res) => setDestinations(res.data))
      .catch((err) => {
        console.error('❌ Failed to fetch destinations:', err);
        setDestinations([]);
      });
  }, [destinationType]);


  const handleScan = async (barcode) => {
    if (barcodes.includes(barcode)) return;
  
    if (!barcode || !destinationId || !destinationType) {
      alert('Please select where to assign the product first');
      return;
    }
  
    const formattedType = destinationType.charAt(0).toUpperCase() + destinationType.slice(1);
  
    const payload = {
      barcode,
      destinationType: formattedType,
      destinationId,
      assigned: true,
      assignment: {
        type: formattedType,
        id: destinationId,
        date: new Date(),
      },
    };
  
    console.log('📦 Sending assignment request:', payload);
  
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/products/assign`, payload, {
      // .post('http://localhost:5000/api/products/assign', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log(`✅ Assigned ${barcode} to ${formattedType} (${destinationId})`);
      setBarcodes((prev) => [...prev, barcode]);
    } catch (err) {
      console.error('❌ Assignment failed:', err.response?.data || err.message);
      alert('Failed to assign product');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Assign Products</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Destination Type: </label>
        <select value={destinationType} onChange={(e) => setDestinationType(e.target.value)}>
          <option value="dealer">Dealer</option>
          <option value="retail">Retail</option>
          <option value="sample">Sample</option>
          <option value="gift">Gift</option>
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Destination Name: </label>
        <select value={destinationId} onChange={(e) => setDestinationId(e.target.value)}>
          <option value="">Select</option>
          {destinations.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {destinationId && (
        <div style={{ marginBottom: '1rem' }}>
          <BarcodeInputScanner onDetected={handleScan} />
        </div>
      )}

      <h4>Assigned Barcodes:</h4>
      <ul>
        {barcodes.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

export default AssignProducts;

