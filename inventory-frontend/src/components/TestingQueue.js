import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './TestingQueue.css'; 

function TestingQueue({ reloadTrigger }) {
  const [pendingProducts, setPendingProducts] = useState([]);

  useEffect(() => {
    const fetchPending = async () => {
      const res = await api.get('/products/pending');
      setPendingProducts(res.data);
    };

    fetchPending();
  }, [reloadTrigger]);

  const handleTest = async (id, status) => {
    await api.post(`/products/test/${id}`, { status });
    setPendingProducts(pendingProducts.filter((p) => p._id !== id));
  };

  return (
    <div className="testing-container">
      <h3 className="testing-title">Products Pending Testing</h3>
      <ul className="testing-list">
        {pendingProducts.map((product) => (
          <li key={product._id} className="testing-item">
            <span className="testing-barcode">{product.barcode}</span>
            <div className="testing-buttons">
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TestingQueue;
