import { useEffect, useState } from 'react';
import axios from 'axios';
import './MaintenanceProducts.css';

function MaintenanceProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchBadProducts();
  }, []);

  const fetchBadProducts = () => {
    axios
      .get('http://localhost:5000/api/products/bad')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  const markAsGood = async (productId) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${productId}/mark-good`);
      fetchBadProducts(); 
    } catch (err) {
      console.error(err);
      alert('Failed to mark product as good');
    }
  };

  return (
    <div className="maintenance-container">
      <h2 className="maintenance-title">Products Needing Maintenance</h2>
      <ul className="maintenance-list">
        {products.map((p) => (
          <li key={p._id} className="maintenance-item">
            <span className="maintenance-barcode">{p.barcode}</span>
            <button className="mark-good-button" onClick={() => markAsGood(p._id)}>
              Mark as Ready
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MaintenanceProducts;
