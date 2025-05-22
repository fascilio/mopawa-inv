import { useEffect, useState } from 'react';
import axios from 'axios';
import './AssignedProducts.css';

function AssignedProducts() {
  const [products, setProducts] = useState([]);
  const [searchType, setSearchType] = useState('barcode');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products/assigned')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // return (
  //   <div className="assigned-products-container">
  //     <h2 className="assigned-products-title">Distributed Products</h2>
  //     <table className="assigned-products-table">
  //       <thead>
  //         <tr>
  //           <th>Barcode</th>
  //           <th>Distributed To</th>
  //           <th>Type</th>
  //           <th>Date</th>
  //         </tr>
  //       </thead>
  //     </table>

  //     <div className="table-scroll-container">
  //       <table className="assigned-products-table">
  //         <tbody>
  //           {[...products].reverse().map((p) => (
  //             <tr key={p._id}>
  //               <td>{p.barcode}</td>
  //               <td>{p.assignedTo?.name || 'Unknown'}</td>
  //               <td>{p.assignedType}</td>
  //               <td>{new Date(p.createdAt).toLocaleString()}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );
  return (
    <div className="assigned-products-container">
      <h2 className="assigned-products-title">Distributed Products</h2>
  
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem' }}>
          Search By:
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="barcode">Barcode</option>
            <option value="date">Date</option>
          </select>
        </label>
  
        <input
          type="text"
          placeholder={`Search by ${searchType}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '250px',
          }}
        />
      </div>
  
      <table className="assigned-products-table">
        <thead>
          <tr>
            <th>Barcode</th>
            <th>Distributed To</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
      </table>
  
      <div className="table-scroll-container">
        <table className="assigned-products-table">
          <tbody>
            {[...products]
              .reverse()
              .filter((p) => {
                if (searchType === 'barcode') {
                  return p.barcode.toLowerCase().includes(searchQuery.toLowerCase());
                } else if (searchType === 'date') {
                  return new Date(p.createdAt)
                    .toLocaleDateString()
                    .includes(searchQuery);
                }
                return true;
              })
              .map((p) => (
                <tr key={p._id}>
                  <td>{p.barcode}</td>
                  <td>{p.assignedTo?.name || 'Unknown'}</td>
                  <td>{p.assignedType}</td>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
}

export default AssignedProducts;
