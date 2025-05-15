import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; 
import { Link, Outlet } from 'react-router-dom';

function Dashboard() {
  const [counts, setCounts] = useState({
    testing: 0,
    maintenance: 0,
    good: 0,
    dealer: 0,
    retailer: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [testingRes, maintenanceRes, goodRes, dealerRes, retailerRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products/testing-count'),
          axios.get('http://localhost:5000/api/products/maintenance-count'),
          axios.get('http://localhost:5000/api/products/good-count'),
          axios.get('http://localhost:5000/api/dealers/stock-count'),
          axios.get('http://localhost:5000/api/retailers/stock-count'),
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

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Warehouse Management</h2>
      <div className="dashboard-grid">
        <div className="dashboard-box"><Link to="/scanner">Import Warehouse: {counts.testing}</Link></div>
        <div className="dashboard-box"><Link to="/testing">Spare Parts Warehouse: {counts.maintenance}</Link></div>
        <div className="dashboard-box"><Link>Finished Warehouse: {counts.good}</Link></div>
        <div className="dashboard-box">With Dealers: {counts.dealer}</div>
        <div className="dashboard-box">With Retailers: {counts.retailer}</div>
      </div>
      <ul>
        <li></li>
      </ul>
    </div>
  );
}

export default Dashboard;
