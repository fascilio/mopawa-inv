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
      .get(`${process.env.REACT_APP_BASE_URL}/api/products/bad`)
      //('http://localhost:5000/api/products/bad')
      .then((res) => setProductsIn(res.data))
      .catch((err) => console.error(err));
  };

  const fetchStockOut = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/products/maintenance-out`)
      //('http://localhost:5000/api/products/maintenance-out') 
      .then((res) => setProductsOut(res.data))
      .catch((err) => console.error(err));
  };

  const fetchMaintenanceCount = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/products/maintenance-count`)
      //('http://localhost:5000/api/products/maintenance-count')
      .then((res) => setMaintenanceCount(res.data.total))
      .catch((err) => console.error('Failed to fetch maintenance count', err));
  };

  const fetchPendingProducts = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/products/pending`)
      //('http://localhost:5000/api/products/pending')
      .then((res) => setPendingProducts(res.data))
      .catch((err) => console.error(err));
  };

  const fetchMaintenanceProducts = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/products/bad`)
      //('http://localhost:5000/api/products/bad')
      .then((res) => setMaintenanceProducts(res.data))
      .catch((err) => console.error(err));
  };

  const handleScan = async () => {
    const barcode = scanInput.trim();
    setScanInput('');
  
    if (!barcode) return;
  
    try {
      if (view === 'in') {
        const pendingRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/pending`);
        //('http://localhost:5000/api/products/pending');
        const product = pendingRes.data.find(p => p.barcode === barcode);
  
        if (!product) return alert('Product not found or not in pending list');

        await axios.post(`${process.env.REACT_APP_BASE_URL}/api/products/test/${product.id}`, {
        //(`http://localhost:5000/api/products/test/${product._id}`, {
          status: 'bad'
        });
  
        fetchStockIn();
        fetchMaintenanceCount();
      } else if (view === 'out') {
        const badRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/bad`);
        //('http://localhost:5000/api/products/bad');
        const product = badRes.data.find(p => p.barcode === barcode);
  
        if (!product) return alert('Product not found in maintenance');
  
        await axios.put(`${process.env.REACT_APP_BASE_URL}/api/products/${product.id}/mark-good`);
        //(`http://localhost:5000/api/products/${product._id}/mark-good`);
  
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
      await axios.put(`${process.env.REACT_APP_BASE_URL}/api/products/${productId}/mark-good`);
      //(`http://localhost:5000/api/products/${productId}/mark-good`);
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
          onChange={(e) => {
            const raw = e.target.value;
            const cleaned = raw.replace(/[\u0000-\u001F\u007F-\u009F\u25D9]/g, '');
            setScanInput(cleaned);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleScan()}
        />
      </div>
      <ul className="maintenance-list">
        {productsToShow.map((p) => (
          <li key={p.id} className="maintenance-item">
            <span className="maintenance-barcode">{p.barcode}</span>
            {view === 'in' && (
              <button className="mark-good-button" onClick={() => markAsGood(p.id)}>
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



// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import './MaintenanceProducts.css';
// import BarcodeInputScanner from '../components/BarcodeScanner';

// function MaintenanceProducts() {
//   const [productsIn, setProductsIn] = useState([]);
//   const [productsOut, setProductsOut] = useState([]);
//   const [view, setView] = useState('in');
//   const [maintenanceCount, setMaintenanceCount] = useState(0);
//   const [pendingProducts, setPendingProducts] = useState([]);
//   const [maintenanceProducts, setMaintenanceProducts] = useState([]);
//   const [scanStatus, setScanStatus] = useState(null);
//   const [scanMessage, setScanMessage] = useState('');

//   useEffect(() => {
//     fetchStockIn();
//     fetchStockOut();
//     fetchMaintenanceCount();
//     fetchPendingProducts();
//     fetchMaintenanceProducts();
//   }, []);

//   const fetchStockIn = () => {
//     axios
//       .get(`${process.env.REACT_APP_BASE_URL}/api/products/bad`)
//       .then((res) => setProductsIn(res.data))
//       .catch((err) => console.error(err));
//   };

//   const fetchStockOut = () => {
//     axios
//       .get(`${process.env.REACT_APP_BASE_URL}/api/products/maintenance-out`)
//       .then((res) => setProductsOut(res.data))
//       .catch((err) => console.error(err));
//   };

//   const fetchMaintenanceCount = () => {
//     axios
//       .get(`${process.env.REACT_APP_BASE_URL}/api/products/maintenance-count`)
//       .then((res) => setMaintenanceCount(res.data.total))
//       .catch((err) => console.error('Failed to fetch maintenance count', err));
//   };

//   const fetchPendingProducts = () => {
//     axios
//       .get(`${process.env.REACT_APP_BASE_URL}/api/products/pending`)
//       .then((res) => setPendingProducts(res.data))
//       .catch((err) => console.error(err));
//   };

//   const fetchMaintenanceProducts = () => {
//     axios
//       .get(`${process.env.REACT_APP_BASE_URL}/api/products/bad`)
//       .then((res) => setMaintenanceProducts(res.data))
//       .catch((err) => console.error(err));
//   };

//   const handleScan = async (barcode) => {
//     const trimmed = barcode.trim();
//     if (!trimmed) return;

//     try {
//       if (view === 'in') {
//         const pendingRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/pending`);
//         const product = pendingRes.data.find(p => p.barcode === trimmed);

//         if (!product) {
//           setScanStatus('error');
//           setScanMessage('Product not found or not in pending list');
//           return;
//         }

//         await axios.post(`${process.env.REACT_APP_BASE_URL}/api/products/test/${product.id}`, {
//           status: 'bad',
//         });

//         fetchStockIn();
//         fetchMaintenanceCount();
//         setScanStatus('success');
//         setScanMessage('Product marked as bad');
//       } else if (view === 'out') {
//         const badRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/bad`);
//         const product = badRes.data.find(p => p.barcode === trimmed);

//         if (!product) {
//           setScanStatus('error');
//           setScanMessage('Product not found in maintenance');
//           return;
//         }

//         await axios.put(`${process.env.REACT_APP_BASE_URL}/api/products/${product.id}/mark-good`);

//         fetchStockOut();
//         fetchMaintenanceCount();
//         setScanStatus('success');
//         setScanMessage('Product marked as ready');
//       }
//     } catch (err) {
//       console.error('Scan error:', err.response?.data || err.message);
//       setScanStatus('error');
//       setScanMessage('Failed to process product');
//     } finally {
//       setTimeout(() => {
//         setScanStatus(null);
//         setScanMessage('');
//       }, 2000);
//     }
//   };

//   const markAsGood = async (productId) => {
//     try {
//       await axios.put(`${process.env.REACT_APP_BASE_URL}/api/products/${productId}/mark-good`);
//       fetchStockIn();
//       fetchStockOut();
//     } catch (err) {
//       console.error(err);
//       alert('Failed to mark product as good');
//     }
//   };

//   const productsToShow = view === 'in' ? productsIn : productsOut;

//   return (
//     <div className="maintenance-container">
//       <h2 className="maintenance-title">Maintenance Warehouse ({maintenanceCount})</h2>

//       <div className="stock-buttons">
//         <button className={view === 'in' ? 'active' : ''} onClick={() => setView('in')}>
//           Stock In
//         </button>
//         <button className={view === 'out' ? 'active' : ''} onClick={() => setView('out')}>
//           Stock Out
//         </button>
//       </div>

//       <BarcodeInputScanner
//         onDetected={handleScan}
//         scanStatus={scanStatus}
//         scanMessage={scanMessage}
//       />

//       <ul className="maintenance-list">
//         {productsToShow.map((p) => (
//           <li key={p.id} className="maintenance-item">
//             <span className="maintenance-barcode">{p.barcode}</span>
//             {view === 'in' && (
//               <button className="mark-good-button" onClick={() => markAsGood(p.id)}>
//                 Mark as Ready
//               </button>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default MaintenanceProducts;
