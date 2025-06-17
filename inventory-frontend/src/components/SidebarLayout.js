import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './SidebarLayout.css';

function SidebarLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      {/* Hamburger button (visible on mobile) */}
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar with conditional mobile class */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <img src="mopawalogo.png" alt="Logo" className="logo" />
        <h3>Admin Panel</h3>
        <ul>
          <li><Link to="/" onClick={() => setSidebarOpen(false)}>Dashboard</Link></li>
          <li><Link to="/notifications" onClick={() => setSidebarOpen(false)}>Notifications</Link></li>
          <li><Link to="/payments" onClick={() => setSidebarOpen(false)}>Payments</Link></li>
        </ul>
      </div>

      {/* Main content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default SidebarLayout;

