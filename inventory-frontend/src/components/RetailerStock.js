import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RetailerStock.css';
import { Link } from 'react-router-dom';
import MpesaForm from './MpesaForm';

function RetailerStock() {
  const [retailers, setRetailers] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [retailProducts, setRetailProducts] = useState([]);
  const [showAddRetailer, setShowAddRetailer] = useState(false);
  const [newRetailerName, setNewRetailerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [retailerInvoices, setRetailerInvoices] = useState([]);
  const [showInvoices, setShowInvoices] = useState(false);
  const [isTeamLeader, setIsTeamLeader] = useState(false);
  const [teamLeaderId, setTeamLeaderId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/retailers`)
      .then(res => setRetailers(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedRetailer && selectedRetailer.isTeamLeader) {
      axios.get(`${process.env.REACT_APP_BASE_URL}/api/retailers/${selectedRetailer.id}/team-members`)
        .then(response => {
          setRetailers(response.data);
        })
        .catch(err => {
          console.error('Failed to fetch team members:', err);
          setRetailers([]);
        });
    } else {
      axios.get(`${process.env.REACT_APP_BASE_URL}/api/retailers`)
        .then(res => setRetailers(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedRetailer]);

  const fetchRetailStock = (retailerId) => {
    if (!retailerId) return;
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/retailers/${retailerId}/stock`)
      .then(res => setRetailProducts(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    setRetailerInvoices([]);
    setShowInvoices(false);
  }, [selectedRetailer]);

  const fetchRetailerInvoices = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/retailers/${selectedRetailer.id}/invoices`);
      setRetailerInvoices(res.data);
      setShowInvoices(true);
    } catch (err) {
      console.error(err);
      alert('Failed to load invoices');
    }
  };

  const handleSelectRetailer = (id) => {
    const retailer = retailers.find(r => r.id === id);
    setSelectedRetailer(retailer);
    fetchRetailStock(id);
  };

  const createSubRetailer = async () => {
    if (!selectedRetailer || !newRetailerName) return;
    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/retailers/${selectedRetailer.id}/team-member`, {
        name: newRetailerName
      });
      setNewRetailerName('');
      const refreshed = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/retailers/${selectedRetailer.id}/team-members`);
      setRetailers(refreshed.data);
    } catch (err) {
      console.error(err);
      alert('Failed to add sub-retailer');
    }
  };

  return (
    <div className="retailer-container">
      <h2
        className="retailer-title"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          setSelectedRetailer('');
          setRetailProducts([]);
          setShowAddRetailer(false);
        }}
      >
        Retailers/Sales Agent
      </h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder={!selectedRetailer ? "Search Team Leaders" : "Search Team Members or Barcode"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '5px', marginRight: '10px' }}
        />

        {selectedRetailer && (
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ padding: '5px' }}
          />
        )}
      </div>

      {!selectedRetailer && (
        <button
          onClick={() => setShowAddRetailer(!showAddRetailer)}
          className="retailer-button"
        >
          {showAddRetailer ? 'Cancel' : 'Add Retailer'}
        </button>
      )}

      {!selectedRetailer && showAddRetailer && (
        <div className="add-retailer-form">
          <input
            type="text"
            value={newRetailerName}
            onChange={(e) => setNewRetailerName(e.target.value)}
            placeholder="Retailer name"
            className="add-retailer-input"
          />

          <div>
            <input
              type="checkbox"
              checked={isTeamLeader}
              onChange={e => setIsTeamLeader(e.target.checked)}
            />
            <label>Is Team Leader</label>
          </div>

          {!isTeamLeader && (
            <div>
              <label>Select Team Leader</label>
              <select
                value={teamLeaderId}
                onChange={e => setTeamLeaderId(e.target.value)}
                required
              >
                <option value="">-- Select Team Leader --</option>
                {retailers
                  .filter(r => r.isTeamLeader)
                  .map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <button
            onClick={async () => {
              try {
                const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/retailers/create`, {
                  name: newRetailerName,
                  isTeamLeader,
                  teamLeaderId: isTeamLeader ? null : teamLeaderId,
                });
                setNewRetailerName('');
                setIsTeamLeader(false);
                setTeamLeaderId('');
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
        {retailers
          .filter(r => r.isTeamLeader && r.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((r) => (
            <button key={r.id} onClick={() => handleSelectRetailer(r.id)}>
              {r.name}
            </button>
          ))}
      </div>

      {selectedRetailer && (
        <div className="product-type-boxes">
          <div
            className="product-box clickable"
            onClick={() => fetchRetailStock(selectedRetailer.id)}
          >
            MP5P0
          </div>
          <div className="product-box disabled">Future Category</div>
          <div className="product-box disabled">Future Category</div>
        </div>
      )}

      {selectedRetailer && (
        <>
          <h3 className="stock-title">Retailer Stock</h3>
          {retailProducts.length === 0 ? (
            <p>No products assigned yet.</p>
          ) : (
            <ul className="list-disc ml-5">
              {retailProducts
                .filter(p =>
                  p.barcode.includes(searchTerm) &&
                  (!dateFilter || new Date(p.assignedAt).toISOString().split('T')[0] === dateFilter)
                )
                .map((p) => (
                  <li key={p.id}>{p.barcode}</li>
                ))}
            </ul>
          )}

          <button
            onClick={fetchRetailerInvoices}
            className="retailer-button"
            style={{ marginTop: '1rem' }}
          >
            View Invoices
          </button>

          {showInvoices && (
            <div className="invoice-list">
              <h3>Invoices</h3>
              {retailerInvoices.length === 0 ? (
                <p>No invoices found.</p>
              ) : (
                <ul>
                  {retailerInvoices.map(invoice => (
                    <li key={invoice.id}>
                      <Link to={`/invoice/${invoice.id}`}>Invoice #{invoice.id}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="warranty-section">
            <h3>Warranty Actions for {selectedRetailer.name}</h3>
            <div className="warranty-action">
              <p>Enjoy using a MOPAWA powerbank because you are covered. Click <Link to='/warranty-policy'>here</Link> to know more about warranty registrations.</p>
            </div>
            <MpesaForm />
          </div>

          {selectedRetailer?.isTeamLeader && (
            <div className="team-section">
              <h3>Create Team for {selectedRetailer.name}</h3>
              <input
                type="text"
                placeholder="Sub-retailer name"
                value={newRetailerName}
                onChange={(e) => setNewRetailerName(e.target.value)}
                className="add-retailer-input"
              />
              <button onClick={createSubRetailer} className="save-button">
                Add Sub-Retailer
              </button>
              <div className="retailer-list">
                {retailers
                  .filter(r =>
                    r.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((member) => (
                    <button key={member.id} onClick={() => handleSelectRetailer(member.id)}>
                      {member.name}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RetailerStock;
