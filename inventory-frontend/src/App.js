// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './pages/Home';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarLayout from './components/SidebarLayout';
import ProductScanner from './components/ProductScanner';
import TestingQueue from './components/TestingQueue';
import GoodProducts from './pages/GoodProducts';
import MaintenanceProducts from './pages/MaintenanceProducts';
import DealerStock from './components/DealerStock';
import RetailerStock from './components/RetailerStock';
import SampleStock from './components/SampleStock';
import GiftStock from './components/GiftStock';
import Dashboard from './components/Dashboard';
import AssignedProducts from './pages/AssignedProducts'
import InvoiceViewer from './pages/InvoiceViewer';
import WarrantyPolicy from './Warranty/Warranty';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<SidebarLayout />}>
        <Route index element={<Dashboard />} /> {/* 👈 This renders on / */}
        <Route path="scanner" element={<ProductScanner />} />
        <Route path="testing" element={<TestingQueue />} />
        <Route path="ready" element={<GoodProducts />} />
        <Route path="maintenance" element={<MaintenanceProducts />} />
        <Route path="assigned" element={<AssignedProducts />} />
        <Route path="/invoice/:invoiceId" element={<InvoiceViewer />} />
        <Route path="dealer-stock" element={<DealerStock />} />
        <Route path="retailer-stock" element={<RetailerStock />} />
        <Route path="sample-stock" element={<SampleStock />} />
        <Route path="gift-stock" element={<GiftStock />} />
        <Route path="warranty-policy" element={<WarrantyPolicy />} />
      </Route>
    </Routes>
  </Router>
  );
}

export default App;
