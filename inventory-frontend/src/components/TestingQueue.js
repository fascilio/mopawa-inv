import React, { useEffect, useState } from 'react';
import api from '../services/api';

function TestingQueue() {
  const [pendingProducts, setPendingProducts] = useState([]);

  useEffect(() => {
    api.get('/products/pending').then((res) => {
      setPendingProducts(res.data);
    });
  }, []);

  const handleTest = async (id, status) => {
    await api.post(`/products/test/${id}`, { status });
    setPendingProducts(pendingProducts.filter((p) => p._id !== id));
  };

  return (
    <div>
      <h3>Products Pending Testing</h3>
      <ul>
        {pendingProducts.map((product) => (
          <li key={product._id}>
            {product.barcode}
            <button onClick={() => handleTest(product._id, 'good')}>Good</button>
            <button onClick={() => handleTest(product._id, 'bad')}>Needs Maintenance</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TestingQueue;
