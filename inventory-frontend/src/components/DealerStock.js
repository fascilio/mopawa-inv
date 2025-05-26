import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './DealerStock.css';

function DealerStock() {
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [dealerProducts, setDealerProducts] = useState([]);
  const [assignableProducts, setAssignableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [newDealerName, setNewDealerName] = useState('');
  const [showAddSubDealer, setShowAddSubDealer] = useState(false);
  const [showAddDealer, setShowAddDealer] = useState(false);
  const navigate = useNavigate();
  const [editingDealerId, setEditingDealerId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dealerInvoices, setDealerInvoices] = useState([]);
  const [showInvoices, setShowInvoices] = useState(false);


  const handleEditDealer = (dealer) => {
    setEditingDealerId(dealer._id);
    setEditedName(dealer.name);
  };
  
  useEffect(() => {
    setDealerInvoices([]);
    setShowInvoices(false);
  }, [selectedDealer]);

  const fetchDealerInvoices = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/dealers/${selectedDealer._id}/invoices`);
      setDealerInvoices(res.data);
      setShowInvoices(true);
    } catch (err) {
      console.error(err);
      alert('Failed to load invoices');
    }
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/dealers/${editingDealerId}`, {
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
      await axios.delete(`http://localhost:5000/api/dealers/${id}`);
      setDealers(dealers.filter(d => d._id !== id));
      if (selectedDealer && selectedDealer._id === id) {
        setSelectedDealer(null);
        setDealerProducts([]);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete dealer');
    }
  };


  useEffect(() => {
    axios.get('http://localhost:5000/api/dealers')
      .then(res => setDealers(res.data))
      .catch(err => console.error(err));
  }, []);

  const [subDealers, setSubDealers] = useState([]);

  const loadDealerStock = async (dealer) => {
    setSelectedDealer(dealer);
    setShowAddSubDealer(false);
    setSelectedProducts([]);

    try {
      if (dealer.parentDealer) {
        const subStockRes = await axios.get(`http://localhost:5000/api/dealers/${dealer.parentDealer}/subdealers/${dealer._id}/stock`);
        setDealerProducts(subStockRes.data);

        const parentStock = await axios.get(`http://localhost:5000/api/dealers/${dealer.parentDealer}/stock`);
        const alreadyAssigned = subStockRes.data.map(p => p.barcode);
        const available = parentStock.data.filter(p => !alreadyAssigned.includes(p.barcode));
        setAssignableProducts(available);
      } else {
        const stockRes = await axios.get(`http://localhost:5000/api/dealers/${dealer._id}/stock`);
        setDealerProducts(stockRes.data);

        const readyRes = await axios.get('http://localhost:5000/api/products/good');
        const unassigned = readyRes.data.filter(p => !p.assigned);
        setAssignableProducts(unassigned);

        // Fetch sub-dealers of this main dealer
        const subRes = await axios.get(`http://localhost:5000/api/dealers`);
        const subs = subRes.data.filter(d => d.parentDealer === dealer._id);
        setSubDealers(subs);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load stock');
    }
  };

  
  const assignBulkProducts = async () => {
    if (!selectedDealer || selectedProducts.length === 0) return;
  
    try {
      const res = await axios.post('http://localhost:5000/api/products/assign-bulk', {
        barcodes: selectedProducts,
        destinationType: 'Dealer',
        destinationId: selectedDealer._id
      });
  
      setSelectedProducts([]);
      loadDealerStock(selectedDealer);
  
      //  No invoice for sub-dealers
      if (!selectedDealer.parentDealer) {
        const { invoiceId } = res.data;
        navigate(`/invoice/${invoiceId}`);
      } else {
        alert('Products assigned to sub-dealer without invoice.');
      }
    } catch (err) {
      console.error(err);
      alert('Bulk assignment failed');
    }
  };

  const createSubDealer = async () => {
    if (!selectedDealer || !newDealerName) return;
  
    try {
      const res = await axios.post(`http://localhost:5000/api/dealers/${selectedDealer._id}/subdealers`, {
        name: newDealerName
      });
      setDealers([...dealers, res.data]);
      setNewDealerName('');
      setShowAddSubDealer(false);
    } catch (err) {
      console.error(err);
      alert('Failed to create sub-dealer');
    }
  };  
  

  return (
    <div className="dealer-container">
      {/* <h2>Dealers</h2> */}
      <h2
        style={{ cursor: selectedDealer ? 'pointer' : 'default' }}
        onClick={() => {
          if (selectedDealer) {
            setSelectedDealer(null);
            setDealerProducts([]);
            setAssignableProducts([]);
            setSelectedProducts([]);
            setSubDealers([]);
            setSearchTerm('');
          }
        }}
      >
        Dealers Warehouse
      </h2>
      <input
        type="text"
        placeholder={
          !selectedDealer ? 'Search main dealer...' : 'Search sub-dealer...'
        }
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="dealer-search-input"
      />
       {!selectedDealer && (
          <button
            onClick={() => setShowAddDealer(!showAddDealer)}
            className="add-dealer-toggle"
          >
            {showAddDealer ? 'Cancel' : 'Add Dealer'}
          </button>
        )}

       {!selectedDealer && showAddDealer && (
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

      {!selectedDealer && (
        <div className="dealer-buttons">
          {/* {dealers.filter(d => !d.parentDealer).map(dealer => ( */}
          {dealers
            .filter(d => !d.parentDealer && d.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(dealer => (
              <div key={dealer._id} className="dealer-item">
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
      )}


      {selectedDealer && (
        <div className="dealer-details">
          <h3>{selectedDealer.name} {selectedDealer.parentDealer ? "(Sub-Dealer)" : "(Main Dealer)"}</h3>

          {!selectedDealer.parentDealer && (
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
            </>
          )}

          {!selectedDealer.parentDealer && (
            <>

              <h4>Sub-Dealers:</h4>
              {/* <ul>
                {subDealers.map(sub => (
                  <li key={sub._id}>
                    <button onClick={() => loadDealerStock(sub)}>
                      {sub.name}
                    </button>
                  </li>
                ))}
              </ul> */}
              <ul>
                {subDealers
                  .filter(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(sub => (
                    <li key={sub._id}>
                      <button onClick={() => loadDealerStock(sub)}>{sub.name}</button>
                    </li>
                  ))}
              </ul>
            </>
          )}

          <h4>Assign Products to {selectedDealer.name}:</h4>
          {assignableProducts.length === 0 ? (
            <p>No products available for assignment.</p>
          ) : (
            <ul>
              {assignableProducts.map(p => (
                <li key={p._id}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(p.barcode)}
                    onChange={() =>
                      setSelectedProducts(prev =>
                        prev.includes(p.barcode)
                          ? prev.filter(b => b !== p.barcode)
                          : [...prev, p.barcode]
                      )
                    }
                  />
                  {p.barcode}
                </li>
              ))}
            </ul>
          )}
          <button onClick={assignBulkProducts}>Dispatch Selected</button>

          <h4>Current Stock of {selectedDealer.name} Warehouse:</h4>
          <ul>
            {dealerProducts.map(p => (
              <li key={p._id}>{p.barcode} got this stock on {new Date(p.createdAt).toLocaleString()}</li>
            ))}
          </ul>
          <button onClick={fetchDealerInvoices}>INVOICES</button>
          {showInvoices && (
            <div>
              <h4>Invoices for {selectedDealer.name}</h4>
              <ul>
              {dealerInvoices.map(inv => (
                <li key={inv._id}>
                  Invoice #{inv.invoiceNumber} - {new Date(inv.createdAt).toLocaleDateString()} - 
                  {/* <a href={`http://localhost:5000/api/invoice/${inv._id}/view`} target="_blank" rel="noopener noreferrer">View PDF</a> |  */}
                  <Link to={`/invoice/${inv._id}`} target="_blank" rel="noopener noreferrer">View </Link> or 
                  <a href={`http://localhost:5000/api/invoices/${inv._id}/download`} target="_blank" rel="noopener noreferrer"> Download </a>
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
