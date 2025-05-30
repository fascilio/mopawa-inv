import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './SidebarLayout.css'; 

function SidebarLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <div className="sidebar">
        <h3>Admin Panel</h3>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/notifications">Notifications</Link></li>
          <li><Link to="/payments">Payments</Link></li>
          {/* <li><Link to="/stk-push">stk push</Link></li> */}
          {/* <li><Link to="/testing">Pending Testing</Link></li> */}
          {/* <li><Link to="/ready">Ready for Market</Link></li> */}
          {/* <li><Link to="/maintenance">Maintenance Warehouse</Link></li> */}
          {/* <li><Link to="/assigned">Assigned</Link></li> */}
          {/* <li><Link to="/dealer-stock">Dealers</Link></li>
          <li><Link to="/retailer-stock">Retailers</Link></li> 
          <li><Link to="/sample-stock">Samples</Link></li>
          <li><Link to="/gift-stock">Gifts</Link></li>*/}
        </ul>
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default SidebarLayout;

