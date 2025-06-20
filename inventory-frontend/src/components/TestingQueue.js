import React, { useEffect, useState } from 'react';
import api from '../services/api';
// //import './TestingQueue.css'; 

function TestingQueue({ reloadTrigger }) {
  const [pendingProducts, setPendingProducts] = useState([]);

  useEffect(() => {
    const fetchPending = async () => {
      const res = await api.get
      (`${process.env.REACT_APP_BASE_URL}/api/products/pending`);
      //("http://localhost:5000/api/products/pending");
      setPendingProducts(res.data.reverse());
    };

    fetchPending();
  }, [reloadTrigger]);

  const handleTest = async (id, status) => {
    await api.post
    (`${process.env.REACT_APP_BASE_URL}/api/products/test/${id}`, { status });
    //(`http://localhost:5000/api/products/test/${id}`, { status });
    setPendingProducts(pendingProducts.filter((p) => p.id !== id));
  };

  const handleDelete = async (barcode) => {
    try {
      await api.delete
      (`${process.env.REACT_APP_BASE_URL}/api/products/delete-by-barcode/${barcode}`);
      //(`http://localhost:5000/api/products/delete-by-barcode/${barcode}`);
      setPendingProducts(pendingProducts.filter((p) => p.barcode !== barcode));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete product');
    }
  };

  return (
    <div className="testing-container">
      <h3 className="testing-title">Imports Warehouse</h3>
      <ul className="testing-list">
        {pendingProducts.map((product) => (
          <li key={product._id} className="testing-item">
            <span className="testing-barcode">{product.barcode}</span>
            <div className="testing-buttons">
              {/* Uncomment if needed:
              <button
                className="testing-button good"
                onClick={() => handleTest(product._id, 'good')}
              >
                Good
              </button>
              <button
                className="testing-button bad"
                onClick={() => handleTest(product._id, 'bad')}
              >
                Needs Maintenance
              </button>
              */}
              <button
                className="testing-button delete"
                onClick={() => handleDelete(product.barcode)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TestingQueue;
