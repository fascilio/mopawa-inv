import React from 'react';
import ProductScanner from './ProductScanner';
import TestingQueue from './TestingQueue';
import DealerStock from './DealerStock';

function Dashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ProductScanner />
      <hr />
      <TestingQueue />
      <hr />
      <DealerStock />
    </div>
  );
}

export default Dashboard;
