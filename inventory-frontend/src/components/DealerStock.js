import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DealerStock.css';

function DealerStock() {
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [dealerProducts, setDealerProducts] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [showAddDealer, setShowAddDealer] = useState(false);
  const [newDealerName, setNewDealerName] = useState('');
  const [readyProducts, setReadyProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    axios.get('http://localhost:5000/api/dealers')
      .then(res => setDealers(res.data))
      .catch(err => console.error(err));
  }, []);

  const loadDealerStock = async (dealer) => {
    setSelectedDealer(dealer);
    setBarcode('');
    try {
      const res = await axios.get(`http://localhost:5000/api/dealers/${dealer._id}/stock`);
      setDealerProducts(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load dealer stock');
    }
  };
  
  useEffect(() => {
    axios.get('http://localhost:5000/api/products/good')
      .then(res => {
        const unassigned = res.data.filter(p => !p.assigned);
        setReadyProducts(unassigned);
      });
  }, []);

  const handleProductToggle = (barcode) => {
    if (selectedProducts.includes(barcode)) {
      setSelectedProducts(selectedProducts.filter(b => b !== barcode));
    } else {
      setSelectedProducts([...selectedProducts, barcode]);
    }
  };

  const assignBulkProducts = async () => {
    if (!selectedDealer || selectedProducts.length === 0) return;
  
    try {
      const res = await axios.post('http://localhost:5000/api/products/assign-bulk', {
        barcodes: selectedProducts,
        destinationType: 'Dealer',
        destinationId: selectedDealer._id,
      });
  
      const { invoiceId } = res.data;
      navigate(`/invoice/${invoiceId}`);
  
      setSelectedProducts([]);
      loadDealerStock(selectedDealer);
    } catch (err) {
      console.error(err);
      alert('Bulk assignment failed');
    }
  };

  return (
    <div className="dealer-container">
      <h2 className="dealer-title">Dealers</h2>

      <button
        onClick={() => setShowAddDealer(!showAddDealer)}
        className="add-dealer-toggle"
      >
        {showAddDealer ? 'Cancel' : 'Add Dealer'}
      </button>

      {showAddDealer && (
        <div className="add-dealer-form">
          <input
            type="text"
            value={newDealerName}
            onChange={(e) => setNewDealerName(e.target.value)}
            placeholder="Dealer name"
            className="add-dealer-input"
          />
          <button
            onClick={async () => {
              try {
                const res = await axios.post('http://localhost:5000/api/dealers/create', {
                  name: newDealerName,
                });
                setNewDealerName('');
                setShowAddDealer(false);
                setDealers([...dealers, res.data]);
              } catch (err) {
                console.error(err);
                alert('Failed to add dealer');
              }
            }}
            className="add-dealer-save"
          >
            Save
          </button>
        </div>
      )}

      <div className="dealer-buttons">
        {dealers.map(dealer => (
          <button
            key={dealer._id}
            className={`dealer-button ${
              selectedDealer && selectedDealer._id === dealer._id ? 'active' : ''
            }`}
            onClick={() => loadDealerStock(dealer)}
          >
            {dealer.name}
          </button>
        ))}
      </div>

      {selectedDealer && (
        <div className="assign-section">
          <h3 className="assign-title">Assign Product to {selectedDealer.name}</h3>
          <div className="assign-input-group">
            <h3>Select Products to Assign:</h3>
              <ul className="assign-list">
                {readyProducts.map(p => (
                  <li key={p._id}>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(p.barcode)}
                      onChange={() => handleProductToggle(p.barcode)}
                    />
                    {p.barcode}
                  </li>
                ))}
              </ul> <br/>
              <button onClick={assignBulkProducts} className="assign-button">Confirm</button>
          </div>
          <br />
          <h4 className="assign-title">Dealer Stock:</h4>
          <ul className="stock-list">
            {dealerProducts.map(p => (
              <li key={p._id}>{p.barcode}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DealerStock;
