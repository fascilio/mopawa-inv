import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StockOutPage() {
  const [clientType, setClientType] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [products, setProducts] = useState([]);
  const [scannedBarcodes, setScannedBarcodes] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/good`)
    //('http://localhost:5000/api/products/good')
      .then(res => {
        const unassigned = res.data.filter(p => !p.assigned);
        setProducts(unassigned);
      })
      .catch(err => console.error(err));
  }, []);

  const handleClientTypeChange = (type) => {
    setClientType(type);
    setSelectedClient(null);
    setScannedBarcodes([]);
    setBarcodeInput('');

    const endpoint = type === 'Dealer' ? '/api/dealers' : '/api/retailers';

    axios.get(`${process.env.REACT_APP_BASE_URL}${endpoint}`)
    //(`http://localhost:5000${endpoint}`)
      .then(res => {
        const filtered = type === 'Dealer'
          ? res.data.filter(d => !d.parentDealer)
          : res.data;
        setClients(filtered);
      })
      .catch(err => console.error(err));
  };

  const handleScan = (e) => {
    e.preventDefault();
    const code = barcodeInput.trim();

    const found = products.find(p => p.barcode === code);
    if (!found) {
      alert('Invalid or already assigned barcode');
    } else if (scannedBarcodes.includes(code)) {
      alert('Already scanned');
    } else {
      setScannedBarcodes(prev => [...prev, code]);
    }

    setBarcodeInput('');
  };

  const handleDone = async () => {
    if (!selectedClient || scannedBarcodes.length === 0) return;

    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/products/assign-bulk`, {
      //('http://localhost:5000/api/products/assign-bulk', {
        barcodes: scannedBarcodes,
        destinationType: clientType,
        destinationId: selectedClient.id
      });

      const { invoiceId } = res.data;
      navigate(`/invoice/${invoiceId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to assign products');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Stock Out</h2>

      <div>
        <label>Select Client Type:</label>
        <select
          value={clientType}
          onChange={(e) => handleClientTypeChange(e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="Dealer">Dealer</option>
          <option value="Retailer">Retailer</option>
          {/* <option value="sample">Sample</option>
          <option value="gift">Gift</option> */}
        </select>
      </div>

      {clientType && (
        <div style={{ marginTop: '15px' }}>
          <label>Select {clientType}:</label>
          {/* <select
            value={selectedClient?.id || ''}
            onChange={(e) => {
              const selected = clients.find(c => c.id === e.target.value);
              setSelectedClient(selected);
            }}
          > */}
          <select
            value={selectedClient?.id || ''}
            onChange={(e) => {
              const selected = clients.find(c => c.id === Number(e.target.value));
              setSelectedClient(selected);
            }}
          >
            <option value="">-- Select --</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedClient && (
        <div style={{ marginTop: '25px' }}>
          <h4>Scan Product Barcodes</h4>
          <form onSubmit={handleScan}>
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Scan barcode..."
              autoFocus
            />
          </form>

          {scannedBarcodes.length > 0 && (
            <>
              <h5>Scanned Products:</h5>
              <ul>
                {scannedBarcodes.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              <button onClick={handleDone}>Done & Generate Invoice</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default StockOutPage;
