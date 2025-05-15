import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RetailerStock.css';

function RetailerStock() {
  const [retailers, setRetailers] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState('');
  const [retailProducts, setRetailProducts] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [showAddRetailer, setShowAddRetailer] = useState(false);
  const [newRetailerName, setNewRetailerName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/retailers')
      .then(res => setRetailers(res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchRetailStock = (retailerId) => {
    if (!retailerId) return;
    axios.get(`http://localhost:5000/api/retailers/${retailerId}/stock`)
      .then(res => setRetailProducts(res.data))
      .catch(err => console.error(err));
  };

  const handleRetailerClick = (retailerId) => {
    setSelectedRetailer(retailerId);
    fetchRetailStock(retailerId);
  };

  const assignProduct = () => {
    if (!barcode || !selectedRetailer) return;
    axios.post('http://localhost:5000/api/products/assign', {
      barcode,
      destinationType: 'Retailer',
      destinationId: selectedRetailer
    }).then(() => {
      fetchRetailStock(selectedRetailer);
      setBarcode('');
    }).catch(err => {
      console.error(err);
      alert('Assignment failed');
    });
  };

  return (
    <div className="retailer-container">
      <h2 className="retailer-title">Assign Products to Retailer/Sales Agent</h2>

      <button
        onClick={() => setShowAddRetailer(!showAddRetailer)}
        className="retailer-button"
      >
        {showAddRetailer ? 'Cancel' : 'Add Retailer'}
      </button>

      {showAddRetailer && (
        <div className="add-retailer-form">
          <input
            type="text"
            value={newRetailerName}
            onChange={(e) => setNewRetailerName(e.target.value)}
            placeholder="Retailer name"
            className="add-retailer-input"
          />
          <button
            onClick={async () => {
              try {
                const res = await axios.post('http://localhost:5000/api/retailers/create', {
                  name: newRetailerName,
                });
                setNewRetailerName('');
                setShowAddRetailer(false);
                setRetailers([...retailers, res.data]);
              } catch (err) {
                console.error(err);
                alert('Failed to add retailer');
              }
            }}
            className="save-button"
          >
            Save
          </button>
        </div>
      )}

      <div className="retailer-list">
        {retailers.map((r) => (
          <button
            key={r._id}
            onClick={() => handleRetailerClick(r._id)}
            className={`retailer-item ${selectedRetailer === r._id ? 'selected' : ''}`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {selectedRetailer && (
        <>
          <div className="assign-section">
            <input
              type="text"
              placeholder="Enter barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="assign-input"
            />
            <button
              onClick={assignProduct}
              className="assign-button"
            >
              Assign to Retailer
            </button>
          </div>

          <h3 className="stock-title">Retailer Stock</h3>
          {retailProducts.length === 0 ? (
            <p>No products assigned yet.</p>
          ) : (
            <ul className="list-disc ml-5">
              {retailProducts.map((p) => (
                <li key={p._id}>{p.barcode}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default RetailerStock;

