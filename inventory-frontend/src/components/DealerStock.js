import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './DealerStock.css';
import MpesaForm from './MpesaForm';
import DealerProductOverview from './DealerProductOverview';
import DealerReturnForm from './DealerReturnForm';

function DealerStock() {
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [dealerProducts, setDealerProducts] = useState([]);
  const [newDealerName, setNewDealerName] = useState('');
  const [showAddSubDealer, setShowAddSubDealer] = useState(false);
  const [showAddDealer, setShowAddDealer] = useState(false);
  const navigate = useNavigate();
  const [editingDealerId, setEditingDealerId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dealerInvoices, setDealerInvoices] = useState([]);
  const [showInvoices, setShowInvoices] = useState(false);
  const [subDealers, setSubDealers] = useState([]);
  const [showStockView, setShowStockView] = useState(false);

  const handleEditDealer = (dealer) => {
    setEditingDealerId(dealer.id);
    setEditedName(dealer.name);
  };

  useEffect(() => {
    setDealerInvoices([]);
    setShowInvoices(false);
  }, [selectedDealer]);

  const fetchDealerInvoices = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dealers/${selectedDealer.id}/invoices`);
      setDealerInvoices(res.data);
      setShowInvoices(true);
    } catch (err) {
      console.error(err);
      alert('Failed to load invoices');
    }
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/dealers/${editingDealerId}`, {
        name: editedName
      });
      setDealers(dealers.map(d => d._id === editingDealerId ? res.data : d));
      setEditingDealerId(null);
      setEditedName('');
    } catch (err) {
      console.error(err);
      alert('Failed to update dealer');
    }
  };

  const handleDeleteDealer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dealer?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/dealers/${id}`);
      setDealers(dealers.filter(d => d.id !== id));
      if (selectedDealer && selectedDealer.id === id) {
        setSelectedDealer(null);
        setDealerProducts([]);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete dealer');
    }
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/dealers`)
      .then(res => setDealers(res.data))
      .catch(err => console.error(err));
  }, []);

  const loadDealerStock = async (dealer) => {
    setSelectedDealer(dealer);
    setShowAddSubDealer(false);
    try {
      const stockRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dealers/${dealer.id}/stock`);
      setDealerProducts(stockRes.data);

      const subRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dealers`);
      const subs = subRes.data.filter(d => d.parentDealer === dealer.id);
      setSubDealers(subs);
    } catch (err) {
      console.error(err);
      alert('Failed to load stock');
    }
  };

  const createSubDealer = async () => {
    if (!selectedDealer || !newDealerName) return;
    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/dealers/${selectedDealer.id}/subdealers`, {
        name: newDealerName
      });
      setSubDealers([...subDealers, res.data]);
      setNewDealerName('');
      setShowAddSubDealer(false);
    } catch (err) {
      console.error(err);
      alert('Failed to create sub-dealer');
    }
  };

  return (
    <div className="dealer-container">
      <h2
        style={{ cursor: selectedDealer ? 'pointer' : 'default' }}
        onClick={() => {
          if (selectedDealer) {
            setSelectedDealer(null);
            setDealerProducts([]);
            setSubDealers([]);
            setSearchTerm('');
            setShowStockView(false);
          }
        }}
      >
        Dealers Warehouse
      </h2>

      <input
        type="text"
        placeholder={!selectedDealer ? 'Search main dealer...' : 'Search sub-dealer...'}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="dealer-search-input"
      />

      {!selectedDealer && (
        <>
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
                    const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/dealers/create`, {
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
            {dealers
              .filter(d => !d.parentDealerId && d.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(dealer => (
                <div key={dealer.id} className="dealer-item">
                  <button onClick={() => loadDealerStock(dealer)}>{dealer.name}</button>
                </div>
              ))}
            {editingDealerId && (
              <div className="edit-dealer-form">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={() => setEditingDealerId(null)}>Cancel</button>
              </div>
            )}
          </div>
        </>
      )}

      {selectedDealer && (
        <div className="dealer-details">
          <h3>{selectedDealer.name} {selectedDealer.parentDealer ? "(Sub-Dealer)" : "(Main Dealer)"}</h3>

          {!selectedDealer.parentDealerId && (
            <>
              <button onClick={() => setShowAddSubDealer(!showAddSubDealer)}>
                {showAddSubDealer ? 'Cancel' : 'Create Sub-Dealer'}
              </button>

              {showAddSubDealer && (
                <div>
                  <input
                    type="text"
                    value={newDealerName}
                    onChange={(e) => setNewDealerName(e.target.value)}
                    placeholder="Sub-dealer name"
                  />
                  <button onClick={createSubDealer}>Create</button>
                </div>
              )}

              <h4>Sub-Dealers:</h4>
              <ul>
                {subDealers
                  .filter(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(sub => (
                    <li key={sub.id}>
                      <button onClick={() => loadDealerStock(sub)}>{sub.name}</button>
                    </li>
                  ))}
              </ul>
            </>
          )}

          <div className="product-type-boxes">
            <h2>PRODUCTS</h2>
            <DealerProductOverview
              dealer={selectedDealer}
              dealerProducts={dealerProducts}
              subDealers={subDealers}
            />
            <div className="product-box disabled"> (Coming Soon)</div>
            <div className="product-box disabled"> (Coming Soon)</div>
          </div>
          <div> <DealerReturnForm dealerId={selectedDealer.id} /> </div>


          <div> <MpesaForm /> </div>
          <h3>Warranty Actions for {selectedDealer.name}</h3>
          <div className="warranty-action">
            <p>Enjoy using a MOPAWA powerbank because you are covered. Click <Link to='/warranty-policy'>here</Link> to know more about warranty registrations.</p>
          </div>

          <button onClick={fetchDealerInvoices}>INVOICES</button>
          {showInvoices && (
            <div>
              <h4>Invoices for {selectedDealer.name}</h4>
              <ul>
                {dealerInvoices.map(inv => (
                  <li key={inv.id}>
                    Invoice #{inv.invoiceNumber} - {new Date(inv.createdAt).toLocaleDateString()} -
                    <Link to={`/invoice/${inv.id}`} target="_blank" rel="noopener noreferrer">View</Link> or
                    <a href={`${process.env.REACT_APP_BASE_URL}/api/invoices/${inv.id}/download`} target="_blank" rel="noopener noreferrer"> Download</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DealerStock;
