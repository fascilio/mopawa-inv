import { useEffect, useState } from 'react';
import axios from 'axios';
import './GoodProducts.css';
import StockOut from "../components/StockOut"

function GoodProducts() {
  const [stockInProducts, setStockInProducts] = useState([]);
  const [stockOutProducts, setStockOutProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('stockIn');
  const [scannedCode, setScannedCode] = useState('');
  const [message, setMessage] = useState('');
  const [goodProductsCount, setGoodProductsCount] = useState(0);

  useEffect(() => {
    if (activeTab === 'stockIn') {
      fetchGoodProducts();
    } else if (activeTab === 'stockOut') {
      fetchAssignedProducts();
    };
    fetchGoodProductsCount();
  }, [activeTab]);

  const fetchGoodProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/good`);
      //('http://localhost:5000/api/products/good');
      const unassigned = res.data.filter((p) => !p.assigned);
      setStockInProducts(unassigned);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignedProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/assigned`);
      //('http://localhost:5000/api/products/assigned');
      setStockOutProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Get pending products
      const pendingRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/pending`);
      //('http://localhost:5000/api/products/pending');
      const product = pendingRes.data.find(p => p.barcode === scannedCode.trim());

      if (!product) {
        setMessage('Product not found in Testing Warehouse.');
        return;
      }

      // Step 2: Mark as 'good'
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/products/test/${product._id}`, {
      //(`http://localhost:5000/api/products/test/${product._id}`, {
        status: 'good'
      });

      // Step 3: Refresh list
      fetchGoodProducts();
      setMessage(`Product ${scannedCode} marked as Good and added.`);
      setScannedCode('');
    } catch (err) {
      console.error(err);
      setMessage('Error processing barcode.');
    }
  };

  const fetchGoodProductsCount = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/products/good-count`)
      //('http://localhost:5000/api/products/good-count')
      .then((res) => setGoodProductsCount(res.data.total))
      .catch((err) => console.error('Failed to fetch good products count', err));
  };
  

  return (
    <div className="good-products-container">
      <h2 className="good-products-title">Distribution Warehouse ({goodProductsCount})</h2>

      <div className="stock-toggle-buttons">
        <button
          onClick={() => setActiveTab('stockIn')}
          className={activeTab === 'stockIn' ? 'active' : ''}
        >
          Stock In
        </button>
        <button
          onClick={() => setActiveTab('stockOut')}
          className={activeTab === 'stockOut' ? 'active' : ''}
        >
          Stock Out
        </button>
      </div>

      {activeTab === 'stockIn' && (
        <div className="scan-section">
          <h3>Scan Product from Testing Warehouse</h3>
          <form onSubmit={handleScan}>
            <input
              type="text"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              placeholder="Scan or Enter Barcode"
              autoFocus
            />
          </form>
          {message && <p className="status-message">{message}</p>}
        </div>
      )}

      <ul className="good-products-list">
        {activeTab === 'stockIn' &&
          stockInProducts.map((p) => (
            <li key={p._id} className="good-product-item">
              <span className="product-barcode">{p.barcode}</span>
            </li>
          ))}

        {activeTab === 'stockOut' && <StockOut />
          // stockOutProducts.map((p) => (
          //   <li key={p._id} className="good-product-item">
          //     <span className="product-barcode">{p.barcode}</span> →{' '}
          //     <span className="product-destination">{p.assignedTo}</span>
          //   </li>
          // ))
          }
      </ul>
    </div>
  );
}

export default GoodProducts;
