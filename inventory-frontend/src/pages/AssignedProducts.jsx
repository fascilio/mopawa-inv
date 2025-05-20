import { useEffect, useState } from 'react';
import axios from 'axios';
import './AssignedProducts.css';

function AssignedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products/assigned')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="assigned-products-container">
      <h2 className="assigned-products-title">Assigned Products</h2>
      <table className="assigned-products-table">
        <thead>
          <tr>
            <th>Barcode</th>
            <th>Assigned To</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
      </table>

      <div className="table-scroll-container">
        <table className="assigned-products-table">
          <tbody>
            {[...products].reverse().map((p) => (
              <tr key={p._id}>
                <td>{p.barcode}</td>
                <td>{p.assignedTo?.name || 'Unknown'}</td>
                <td>{p.assignedType}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssignedProducts;
