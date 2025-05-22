import React, { useState, useRef } from 'react';
import api from '../services/api';
import './ProductScanner.css';
import TestingQueue from './TestingQueue';
import StockIn from './StockIn';
import StockOut from './StockOut';
import AssignedProducts from '../pages/AssignedProducts';
import BarcodeInputScanner from './BarcodeScanner'; 

function TestingStation() {
  const [reloadKey, setReloadKey] = useState(0);
  const [activeComponent, setActiveComponent] = useState('');
  const [scanStatus, setScanStatus] = useState(null);
  const [scanMessage, setScanMessage] = useState('');
  
  const processBarcode = async (scannedBarcode) => {
    try {
      const response = await api.post('products/receive', { barcode: scannedBarcode });
      setScanStatus('success');
      setScanMessage(response.data.message || 'Scan successful');
      setReloadKey((prev) => prev + 1);
    } catch (error) {
      setScanStatus('error');
      setScanMessage(
        error.response?.data?.message || 'Failed to process barcode'
      );
    } finally {
      setTimeout(() => {
        setScanStatus(null);
        setScanMessage('');
      }, 2000);
    }
  };
  

  const handleScanDetected = (scannedBarcode) => {
    if (scannedBarcode.trim()) {
      processBarcode(scannedBarcode.trim());
    }
  };

  return (
    <div className="testing-container">
      <button onClick={() => setActiveComponent('stock-in')} className="testing-stock-in">Stock In</button>
      <button onClick={() => setActiveComponent('stock-out')} className="testing-stock-out">Stock Out</button>
      {/* <button onClick={() => setActiveComponent('testing-warehouse')} className="testing-warehouse">testing Warehouse</button> */}
      <button onClick={() => setActiveComponent('product-history')} className="testing-product-history">Product History</button>

      {/* {activeComponent === 'stock-in' && <BarcodeInputScanner onDetected={handleScanDetected} scanStatus={scanStatus} />} */}
      {activeComponent === 'stock-in' && (
        <>
          <h3>Scan Products for Stock In</h3>
          {/* <BarcodeInputScanner onDetected={handleScanDetected} scanStatus={scanStatus} /> */}
          <BarcodeInputScanner
            onDetected={handleScanDetected}
            scanStatus={scanStatus}
            scanMessage={scanMessage}
          />
        </>
      )}
      {activeComponent === 'stock-out' && <StockOut />}
      {activeComponent === 'product-history' && <AssignedProducts />}
      {/* {activeComponent === 'testing-warehouse' && <TestingQueue reloadTrigger={reloadKey} />} */}

      {activeComponent === '' && (
        <>
          {/* <h3 className="scan-title">Scan or Enter Barcode</h3> */}
          <StockIn />
          {/* <TestingQueue reloadTrigger={reloadKey} /> */}
        </>
      )}
    </div>
  );
}

export default TestingStation;

