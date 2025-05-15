import { useEffect, useState } from 'react';
import axios from 'axios';
import './GoodProducts.css';

function GoodProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products/good')
      .then((res) => {
        const unassigned = res.data.filter(p => !p.assigned);
        setProducts(unassigned);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="good-products-container">
      <h2 className="good-products-title">Good Products (Ready for Market)</h2>
      <ul className="good-products-list">
        {products.map((p) => (
          <li key={p._id} className="good-product-item">
            <span className="product-barcode">{p.barcode}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GoodProducts;

