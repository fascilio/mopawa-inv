import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RetailerStock.css';
import { Link } from 'react-router-dom';
import MpesaForm from './MpesaForm'

function RetailerStock() {
  const [retailers, setRetailers] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [retailProducts, setRetailProducts] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [showAddRetailer, setShowAddRetailer] = useState(false);
  const [newRetailerName, setNewRetailerName] = useState('');
  //const [newRetailerPhone, setNewRetailerPhone] = useState('')
  const [readyProducts, setReadyProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();
  const [isTeamLeader, setIsTeamLeader] = useState(false);
  const [teamLeaderId, setTeamLeaderId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [retailerInvoices, setRetailerInvoices] = useState([]);
  const [showInvoices, setShowInvoices] = useState(false);
  const [showReadyProducts, setShowReadyProducts] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/retailers`)
    //('http://localhost:5000/api/retailers')
      .then(res => setRetailers(res.data))
      .catch(err => console.error(err));
   }, []);

  useEffect(() => {
    if (selectedRetailer && selectedRetailer.isTeamLeader) {
      axios.get(`${process.env.REACT_APP_BASE_URL}/api/retailers/${selectedRetailer.id}/team-members`)
      //(`http://localhost:5000/api/retailers/${selectedRetailer._id}/team-members`)
        .then(response => {
          setRetailers(response.data);
        })
        .catch(err => {
          console.error('Failed to fetch team members:', err);
          setRetailers([]); 
        });
    } else {
      axios.get(`${process.env.REACT_APP_BASE_URL}/api/retailers`)
      //('http://localhost:5000/api/retailers')
        .then(res => setRetailers(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedRetailer]);


  const fetchRetailStock = (retailerId) => {
    if (!retailerId) return;
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/retailers/${retailerId}/stock`)
    //(`http://localhost:5000/api/retailers/${retailerId}/stock`)
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
      //(`http://localhost:5000/api/retailers/${selectedRetailer._id}/invoices`);
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

  // useEffect(() => {
  //   axios.get('http://localhost:5000/api/products/good')
  //     .then(res => {
  //       const unassigned = res.data.filter(p => !p.assigned);
  //       setReadyProducts(unassigned);
  //     });
  // }, []);

  const handleProductToggle = (barcode) => {
    if (selectedProducts.includes(barcode)) {
      setSelectedProducts(selectedProducts.filter(b => b !== barcode));
    } else {
      setSelectedProducts([...selectedProducts, barcode]);
    }
  };

  const assignBulkProducts = async () => {
    if (!selectedRetailer || selectedProducts.length === 0) return;
  
    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/products/assign-bulk`, {
      //('http://localhost:5000/api/products/assign-bulk', {
        barcodes: selectedProducts,
        destinationType: 'Retailer',
        destinationId: selectedRetailer,
      });
  
      const { invoiceId } = res.data;
      navigate(`/invoice/${invoiceId}`);
  
      setSelectedProducts([]);
      fetchRetailStock(selectedRetailer);
    } catch (err) {
      console.error(err);
      alert('Bulk assignment failed');
    }
  };

  const loadReadyProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/good`);
      //('http://localhost:5000/api/products/good');
      const unassigned = res.data.filter(p => !p.assigned);
      setReadyProducts(unassigned);
    } catch (err) {
      console.error('Failed to load ready products:', err);
      alert('Could not load ready products');
    }
  };
  const handleCategoryClick = () => {
    loadReadyProducts(); 
    setShowReadyProducts(true); 
  };
  return (
    <div className="retailer-container">
      <h2
        className="retailer-title"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          setSelectedRetailer('');
          setRetailProducts([]);
          setSelectedProducts([]);
          setShowAddRetailer(false);
        }}
      >
        Retailers/Sales Agent
      </h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder={
            !selectedRetailer
              ? "Search Team Leaders"
              : "Search Team Members or Barcode"
          }
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
                //('http://localhost:5000/api/retailers/create', {
                  name: newRetailerName,
                  isTeamLeader,
                  teamLeaderId: isTeamLeader ? null : teamLeaderId
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
          .filter(r =>
            r.isTeamLeader &&
            r.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((r) => (
            <button key={r.id} onClick={() => handleSelectRetailer(r.id)}>
              {r.name}
            </button>
          ))}
      </div>

      {selectedRetailer && (
        <div className="product-category-boxes" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div
            onClick={loadReadyProducts}
            style={{
              flex: 1,
              padding: '20px',
              border: '2px solid #007bff',
              borderRadius: '10px',
              cursor: 'pointer',
              textAlign: 'center',
              backgroundColor: '#f0f8ff',
            }}
          >
            <h3>MP5P0</h3>
            <p>Click to view available products</p>
            <ul className="assign-list">
              {readyProducts.map(p => (
                <li key={p.id}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(p.barcode)}
                    onChange={() => handleProductToggle(p.barcode)}
                  />
                  {p.barcode}
                </li>
              ))}
            </ul>
            <button onClick={assignBulkProducts} className="assign-button">Confirm</button>
          </div>

          <div style={{
            flex: 1,
            padding: '20px',
            border: '2px dashed #ccc',
            borderRadius: '10px',
            textAlign: 'center',
            color: '#999'
          }}>
            <h3>Future Category</h3>
          </div>

          <div style={{
            flex: 1,
            padding: '20px',
            border: '2px dashed #ccc',
            borderRadius: '10px',
            textAlign: 'center',
            color: '#999'
          }}>
            <h3>Future Category</h3>
          </div>
        </div>
      )}
      {selectedRetailer && (
        <>
          <div className="assign-section">
            <h3 className="assign-title">Assign Product to {selectedRetailer.name}</h3>
            <button
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
              onClick={async () => {
                if (window.confirm(`Are you sure you want to delete ${selectedRetailer.name}?`)) {
                  try {
                    await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/retailers/${selectedRetailer.id}`);
                    //(`http://localhost:5000/api/retailers/${selectedRetailer._id}`);
                    setSelectedRetailer(null);
                    const refreshed = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/retailers`);
                    //('http://localhost:5000/api/retailers');
                    setRetailers(refreshed.data);
                    setRetailProducts([]);
                    setSelectedProducts([]);
                  } catch (err) {
                    console.error(err);
                    alert('Failed to delete retailer');
                  }
                }
              }}
            >
            Delete {selectedRetailer.name}
            </button>
            {/*<div className="assign-input-group">
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
            </div>*/}
          </div>

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
          {selectedRetailer && (
            <button
              onClick={fetchRetailerInvoices}
              className="retailer-button"
              style={{ marginTop: '1rem' }}
            >
              View Invoices
            </button>
          )}
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
            <div>
              <MpesaForm />
            </div>
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
              <button
                onClick={async () => {
                  try {
                    const res = await axios.post(
                      `${process.env.REACT_APP_BASE_URL}/api/retailers/${selectedRetailer.id}/team-member`,
                      //`http://localhost:5000/api/retailers/${selectedRetailer._id}/team-member`,
                      { name: newRetailerName }
                    );
                    setNewRetailerName('');
                    const refreshed = await axios.get(
                      `${process.env.REACT_APP_BASE_URL}/api/retailers/${selectedRetailer.id}/team-members`
                      //`http://localhost:5000/api/retailers/${selectedRetailer._id}/team-members`
                    );
                    setRetailers(refreshed.data);
                  } catch (err) {
                    console.error(err);
                    alert('Failed to add sub-retailer');
                  }
                }}
                className="save-button"
              >
                Add Sub-Retailer
              </button>
              {selectedRetailer?.isTeamLeader && (
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
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RetailerStock;

