import React, { useState } from 'react';
import api from '../services/api';

function ProductScanner() {
  const [barcode, setBarcode] = useState('');

  const handleScan = async () => {
    try {
      await api.post('/products/receive', { barcode });
      alert('Product received and pending testing');
      setBarcode('');
    } catch (error) {
      console.error(error);
      alert('Failed to save product');
    }
  };

  return (
    <div>
      <h3>Scan Product Barcode</h3>
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Scan or enter barcode"
      />
      <button onClick={handleScan}>Submit</button>
    </div>
  );
}

export default ProductScanner;
