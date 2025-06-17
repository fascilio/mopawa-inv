import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./GiftStock.css"

function GiftStock() {
  const [giftedProducts, setGiftedProducts] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [goodProducts, setGoodProducts] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/good`)
    //('http://localhost:5000/api/products/good')
      .then(res => setGoodProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchGiftedProducts = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/gifts`)
    //('http://localhost:5000/api/products/gifts')
      .then(res => setGiftedProducts(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchGiftedProducts();
  }, []);

  const assignToGift = () => {
    if (!barcode) return;

    axios.post(`${process.env.REACT_APP_BASE_URL}/api/products/gifts`, {
    //('http://localhost:5000/api/products/gifts', {
      barcode,
      destinationType: 'gift',
    }).then(() => {
      setBarcode('');
      fetchGiftedProducts();
    }).catch(err => {
      console.error(err);
      alert('Assignment failed');
    });
  };

  return (
    <div className='gift-stock-container'>
      <h2>Gift Products</h2>

      {/* <input
        type="text"
        placeholder="Enter barcode from good products"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
      /> */}
      <input
        type="text"
        placeholder="Scan or enter barcode"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') assignToGift();
        }}
        autoFocus
      />
      {/* <button onClick={assignToGift}>Gift Product</button> */}

      <h3>Already Gifted</h3>
      <ul>
        {giftedProducts.map(p => (
          <li key={p._id}>{p.barcode}</li>
        ))}
      </ul>
      <h3>Warranty Actions </h3>
      <div className="warranty-action">
      <p>Enjoy using a MOPAWA powerbank because you are covered. Click <Link to='/warranty-policy'>here</Link> to know more about warranty registrations.</p>
      </div>
    </div>
  );
}

export default GiftStock;
