// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Dashboard.css'; 
// import { Link } from 'react-router-dom';

// function Dashboard() {
//   const [counts, setCounts] = useState({
//     testing: 0,
//     maintenance: 0,
//     good: 0,
//     dealer: 0,
//     retailer: 0,
//   });

//   useEffect(() => {
//     const fetchCounts = async () => {
//       try {
//         const [testingRes, maintenanceRes, goodRes, dealerRes, retailerRes] = await Promise.all([
//           //axios.get('http://localhost:5000/api/products/testing-count'),
//           axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/testing-count`),
//           //axios.get('http://localhost:5000/api/products/maintenance-count'),
//           axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/maintenance-count`),
//           //axios.get('http://localhost:5000/api/products/good-count'),
//           axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/good-count`),
//           //axios.get('http://localhost:5000/api/dealers/stock-count'),
//           axios.get(`${process.env.REACT_APP_BASE_URL}/api/dealers/stock-count`),
//           //axios.get('http://localhost:5000/api/retailers/stock-count'),
//           axios.get(`${process.env.REACT_APP_BASE_URL}/api/retailers/stock-count`),
//         ]);

//         setCounts({
//           testing: testingRes.data.total,
//           maintenance: maintenanceRes.data.total,
//           good: goodRes.data.total,
//           dealer: dealerRes.data.total,
//           retailer: retailerRes.data.total,
//         });
//       } catch (error) {
//         console.error('Failed to fetch counts:', error);
//       }
//     };

//     fetchCounts();
//   }, []);

//   return (
//     <div className="dashboard-container">
//       <h2 className="dashboard-title"> Warehouse Management</h2>
//       <div className="dashboard-grid">
//         <div className="dashboard-box"><Link to="/scanner">Import Warehouse: {counts.testing}</Link></div>
//         <div className="dashboard-box"><Link to="/maintenance">Spare Parts Warehouse: {counts.maintenance}</Link></div>
//         <div className="dashboard-box"><Link to="/ready">Finished Warehouse: {counts.good}</Link></div>
//         <div className="dashboard-box"><Link to="/dealer-stock">Dealers Warehouse: {counts.dealer}</Link></div>
//         <div className="dashboard-box"><Link to="/retailer-stock">Direct Sales warehouse: {counts.retailer}</Link></div>
//         <div className="dashboard-box"><Link to="/samples">Samples Warehouse</Link></div>
//         <div className="dashboard-box"><Link to="gifts">Gifts Warehouse</Link></div>
//       </div>
      
//     </div>
//   );
// }

// export default Dashboard;







import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; 
import { Link } from 'react-router-dom';

function Dashboard() {
  const [counts, setCounts] = useState({
    testing: 0,
    maintenance: 0,
    good: 0,
    dealer: 0,
    retailer: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [testingRes, maintenanceRes, goodRes, dealerRes, retailerRes] = await Promise.all([
          //axios.get('http://localhost:5000/api/products/testing-count'),
          axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/testing-count`),
          //axios.get('http://localhost:5000/api/products/maintenance-count'),
          axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/maintenance-count`),
          //axios.get('http://localhost:5000/api/products/good-count'),
          axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/good-count`),
          //axios.get('http://localhost:5000/api/dealers/stock-count'),
          axios.get(`${process.env.REACT_APP_BASE_URL}/api/dealers/stock-count`),
          //axios.get('http://localhost:5000/api/retailers/stock-count'),
          axios.get(`${process.env.REACT_APP_BASE_URL}/api/retailers/stock-count`),
        ]);

        setCounts({
          testing: testingRes.data.total,
          maintenance: maintenanceRes.data.total,
          good: goodRes.data.total,
          dealer: dealerRes.data.total,
          retailer: retailerRes.data.total,
        });
      } catch (error) {
        console.error('Failed to fetch counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setSearching(true);
    setSearchResult('');

    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/find/${searchTerm}`);
      setSearchResult(`📦 Found in: ${res.data.location}`);
    } catch (err) {
      if (err.response?.status === 404) {
        setSearchResult('❌ Product not found.');
      } else {
        setSearchResult('⚠️ Error checking product.');
      }
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Warehouse Management</h2>

      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Scan or enter barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginRight: '10px'
          }}
        />
        <button
          type="submit"
          disabled={searching}
          style={{
            padding: '10px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searchResult && <p style={{ fontWeight: 'bold', marginBottom: '20px' }}>{searchResult}</p>}

      <div className="dashboard-grid">
        <div className="dashboard-box"><Link to="/scanner">Import Warehouse: {counts.testing}</Link></div>
        <div className="dashboard-box"><Link to="/maintenance">Spare Parts Warehouse: {counts.maintenance}</Link></div>
        <div className="dashboard-box"><Link to="/ready">Finished Warehouse: {counts.good}</Link></div>
        <div className="dashboard-box"><Link to="/dealer-stock">Dealers Warehouse: {counts.dealer}</Link></div>
        <div className="dashboard-box"><Link to="/retailer-stock">Direct Sales warehouse: {counts.retailer}</Link></div>
        <div className="dashboard-box"><Link to="/samples">Samples Warehouse</Link></div>
        <div className="dashboard-box"><Link to="/gifts">Gifts Warehouse</Link></div>
      </div>
    </div>
  );
}

export default Dashboard;
