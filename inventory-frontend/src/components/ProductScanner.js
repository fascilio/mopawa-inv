import React, { useState } from 'react';
import api from '../services/api';
import './ProductScanner.css';
//import TestingQueue from './TestingQueue';

function TestingStation() {
  const [barcode, setBarcode] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const handleScan = async () => {
    try {
      await api.post('/receive', { barcode });
      setBarcode('');
      setReloadKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data?.message === 'Product already registered') {
        alert('This barcode is already registered.');
      } else {
        alert('Failed to save product');
      }
    }
  };  

  const handleStockIn = async () => {

  };

  const handleStockOut = async () => {

  }

  return (
    <div className="testing-container">
      <button onClick={handleStockIn}className="testing-title">Stock In </button>
      <button onClick={handleStockOut}className="testing-title">Stock Out</button>

      <div>
        <h3 className="scan-title">Scan Product Barcode</h3>
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Scan or enter barcode"
          className="scan-input"
        />
        <button onClick={handleScan} className="scan-button">
          Submit
        </button>
      </div>

      {/* <TestingQueue reloadTrigger={reloadKey} /> */}
    </div>
  );
}

export default TestingStation;

