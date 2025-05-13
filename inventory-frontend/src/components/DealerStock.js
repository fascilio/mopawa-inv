import React, { useEffect, useState } from 'react';
import api from '../services/api';

function DealerStock() {
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [dealerStock, setDealerStock] = useState([]);
  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    api.get('/dealers').then((res) => setDealers(res.data));
  }, []);

  const handleAssign = async () => {
    await api.post('/products/assign', { barcode, dealerId: selectedDealer });
    alert('Product assigned');
    setBarcode('');
  };

  const loadDealerStock = async (dealerId) => {
    setSelectedDealer(dealerId);
    const res = await api.get(`/dealers/${dealerId}/stock`);
    setDealerStock(res.data);
  };

  return (
    <div>
      <h3>Dealer Assignment</h3>
      <select onChange={(e) => loadDealerStock(e.target.value)}>
        <option>Select Dealer</option>
        {dealers.map((dealer) => (
          <option key={dealer._id} value={dealer._id}>{dealer.name}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Scan barcode to assign"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
      />
      <button onClick={handleAssign}>Assign</button>

      <h4>Dealer Stock</h4>
      <ul>
        {dealerStock.map((item) => (
          <li key={item._id}>{item.barcode}</li>
        ))}
      </ul>
    </div>
  );
}

export default DealerStock;
