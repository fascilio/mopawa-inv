import React, { useState } from 'react';
import axios from 'axios';
import BarcodeInputScanner from '../components/BarcodeInputScanner';

function ReceiveProducts() {
  const [scanned, setScanned] = useState([]);

  const handleScan = async (barcode) => {
    try {
      await axios.post('http://localhost:5000/api/products/create', {
        barcode,
        status: 'pending',
      });
      setScanned([...scanned, barcode]);
    } catch (err) {
      alert('Error saving barcode');
    }
  };

  return (
    <div>
      <h2>Receive Products (Scan via Device)</h2>
      <BarcodeInputScanner onDetected={handleScan} />
      <ul>{scanned.map(b => <li key={b}>{b}</li>)}</ul>
    </div>
  );
}

export default ReceiveProducts;
