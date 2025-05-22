import { useEffect, useState } from 'react';
import axios from 'axios';
import './MaintenanceProducts.css';

function MaintenanceProducts() {
  const [productsIn, setProductsIn] = useState([]);
  const [productsOut, setProductsOut] = useState([]);
  const [view, setView] = useState('in'); 
  const [maintenanceCount, setMaintenanceCount] = useState(0);
  const [scanInput, setScanInput] = useState('');
  const [pendingProducts, setPendingProducts] = useState([]);
  const [maintenanceProducts, setMaintenanceProducts] = useState([]);

  useEffect(() => {
    fetchStockIn();
    fetchStockOut();
    fetchMaintenanceCount();
    fetchPendingProducts();
    fetchMaintenanceProducts();
  }, []);  

  const fetchStockIn = () => {
    axios
      .get('http://localhost:5000/api/products/bad')
      .then((res) => setProductsIn(res.data))
      .catch((err) => console.error(err));
  };

  const fetchStockOut = () => {
    axios
      .get('http://localhost:5000/api/products/maintenance-out') 
      .then((res) => setProductsOut(res.data))
      .catch((err) => console.error(err));
  };

  const fetchMaintenanceCount = () => {
    axios
      .get('http://localhost:5000/api/products/maintenance-count')
      .then((res) => setMaintenanceCount(res.data.total))
      .catch((err) => console.error('Failed to fetch maintenance count', err));
  };

  const fetchPendingProducts = () => {
    axios
      .get('http://localhost:5000/api/products/pending')
      .then((res) => setPendingProducts(res.data))
      .catch((err) => console.error(err));
  };

  const fetchMaintenanceProducts = () => {
    axios
      .get('http://localhost:5000/api/products/bad')
      .then((res) => setMaintenanceProducts(res.data))
      .catch((err) => console.error(err));
  };

  const handleScan = async () => {
    const barcode = scanInput.trim();
    setScanInput('');
  
    if (!barcode) return;
  
    try {
      if (view === 'in') {
        const pendingRes = await axios.get('http://localhost:5000/api/products/pending');
        const product = pendingRes.data.find(p => p.barcode === barcode);
  
        if (!product) return alert('Product not found or not in pending list');

        await axios.post(`http://localhost:5000/api/products/test/${product._id}`, {
          status: 'bad'
        });
  
        fetchStockIn();
        fetchMaintenanceCount();
      } else if (view === 'out') {
        const badRes = await axios.get('http://localhost:5000/api/products/bad');
        const product = badRes.data.find(p => p.barcode === barcode);
  
        if (!product) return alert('Product not found in maintenance');
  
        await axios.put(`http://localhost:5000/api/products/${product._id}/mark-good`);
  
        fetchStockOut();
        fetchMaintenanceCount();
      }
    } catch (err) {
      console.error('Scan error:', err.response?.data || err.message);
      alert('Failed to process product');
    }
  };

  const markAsGood = async (productId) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${productId}/mark-good`);
      fetchStockIn();
      fetchStockOut(); 
    } catch (err) {
      console.error(err);
      alert('Failed to mark product as good');
    }
  };

  const productsToShow = view === 'in' ? productsIn : productsOut;

  return (
    <div className="maintenance-container">
      <h2 className="maintenance-title">Maintenance Warehouse ({maintenanceCount})</h2>

      <div className="stock-buttons">
        <button
          className={view === 'in' ? 'active' : ''}
          onClick={() => setView('in')}
        >
          Stock In
        </button>
        <button
          className={view === 'out' ? 'active' : ''}
          onClick={() => setView('out')}
        >
          Stock Out
        </button>
      </div>

      <div className="scan-field">
        <input
          type="text"
          placeholder="Scan barcode..."
          value={scanInput}
          onChange={(e) => setScanInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleScan()}
        />
        <button onClick={handleScan}>Scan</button>
      </div>

      <ul className="maintenance-list">
        {productsToShow.map((p) => (
          <li key={p._id} className="maintenance-item">
            <span className="maintenance-barcode">{p.barcode}</span>
            {view === 'in' && (
              <button className="mark-good-button" onClick={() => markAsGood(p._id)}>
                Mark as Ready
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MaintenanceProducts;
