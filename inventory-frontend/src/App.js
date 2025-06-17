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
import WarrantyRegister from './Warranty/WarrantyRegister';
import WarrantyClaim from './Warranty/WarrantyClaim'; 
import Notifications from './components/Notifications';
import AdminPayments from './components/AdminPayments';
import MpesaForm from './components/MpesaForm';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<SidebarLayout />}>
        <Route index element={<Dashboard />} /> 
        <Route path="scanner" element={<ProductScanner />} />
        <Route path="testing" element={<TestingQueue />} />
        <Route path="ready" element={<GoodProducts />} />
        <Route path="maintenance" element={<MaintenanceProducts />} />
        <Route path="assigned" element={<AssignedProducts />} />
        <Route path="/invoice/:invoiceId" element={<InvoiceViewer />} />
        <Route path="dealer-stock" element={<DealerStock />} />
        <Route path="retailer-stock" element={<RetailerStock />} />
        <Route path="samples" element={<SampleStock />} />
        <Route path="gifts" element={<GiftStock />} />
        <Route path="warranty-policy" element={<WarrantyPolicy />} />
        <Route path="/warranty-policy/register" element={<WarrantyRegister />} />
        <Route path="/warranty-policy/claim" element={<WarrantyClaim />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="stk-push" element={<MpesaForm />} />
      </Route>
    </Routes>
  </Router>
  );
}

export default App;
