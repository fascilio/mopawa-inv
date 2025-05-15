import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GiftStock() {
  const [gifts, setGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState('');
  const [giftProducts, setGiftProducts] = useState([]);
  const [barcode, setBarcode] = useState('');

  // Fetch all gift destinations
  useEffect(() => {
    axios.get('http://localhost:5000/api/gifts')
      .then(res => setGifts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch gift stock
  const fetchGiftStock = () => {
    if (!selectedGift) return;

    axios.get(`http://localhost:5000/api/gifts/${selectedGift}/stock`)
      .then(res => setGiftProducts(res.data))
      .catch(err => console.error(err));
  };

  // Assign product to gift
  const assignProduct = () => {
    if (!barcode || !selectedGift) return;

    axios.post('http://localhost:5000/api/products/assign', {
      barcode,
      destinationType: 'gift',
      destinationId: selectedGift,
    }).then(() => {
      fetchGiftStock();
      setBarcode('');
    }).catch(err => {
      console.error(err);
      alert('Assignment failed');
    });
  };

  return (
    <div>
      <h2>Assign Products to Gift</h2>

      <select
        value={selectedGift}
        onChange={(e) => {
          setSelectedGift(e.target.value);
          setGiftProducts([]);
        }}
      >
        <option value="">Select Gift</option>
        {gifts.map(gift => (
          <option key={gift._id} value={gift._id}>
            {gift.name}
          </option>
        ))}
      </select>

      <button onClick={fetchGiftStock}>View Gift Stock</button>

      <br /><br />

      <input
        type="text"
        placeholder="Enter barcode to assign"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
      />
      <button onClick={assignProduct}>Assign to Gift</button>

      <h3>Gift Stock</h3>
      <ul>
        {giftProducts.map(p => (
          <li key={p._id}>{p.barcode}</li>
        ))}
      </ul>
    </div>
  );
}

export default GiftStock;
