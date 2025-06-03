import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function SampleStock() {
  const [sampleProducts, setSampleProducts] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [goodProducts, setGoodProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSampleProducts = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/samples`)
    //('http://localhost:5000/api/products/samples')
      .then(res => {
        console.log("Sample products:", res.data); 
        setSampleProducts(res.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/good`)
    //('http://localhost:5000/api/products/good')
      .then(res => {
        const unassigned = res.data.filter(p => !p.assigned);
        setGoodProducts(unassigned);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetchSampleProducts();
  }, []);

  const assignProduct = () => {
    setError('');
    setSuccess('');
    const trimmed = barcode.trim();

    if (!trimmed) {
      setError('Please scan or enter a barcode.');
      return;
    }

    const isValid = goodProducts.find(p => p.barcode === trimmed);
    if (!isValid) {
      setError('Barcode not found in distribution warehouse.');
      return;
    }

    axios.post(`${process.env.REACT_APP_BASE_URL}/api/products/samples`, {
    //('http://localhost:5000/api/products/samples', {
      barcode: trimmed,
      destinationType: 'Sample',
    }).then(() => {
      fetchSampleProducts();
      setBarcode('');
      setSuccess(`Product ${trimmed} assigned to Sample.`);
      setGoodProducts(prev => prev.filter(p => p.barcode !== trimmed));
    }).catch(err => {
      console.error(err);
      setError('Assignment failed');
    });
  };

  return (
    <div>
      <h2>Sample Stock Management</h2>

      <input
        type="text"
        placeholder="Scan or enter barcode"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') assignProduct();
        }}
        autoFocus
      />
      {/* <button onClick={assignProduct}>Assign</button> */}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h3>Sample Products ({sampleProducts.length})</h3>
      <ul>
        {sampleProducts.length === 0 ? (
          <li>No sample products assigned yet.</li>
        ) : (
          sampleProducts.map(p => (
            <li key={p._id}>{p.barcode}</li>
          ))
        )}
      </ul>
      <h3>Warranty Actions </h3>
      <div className="warranty-action">
      <p>Enjoy using a MOPAWA powerbank because you are covered. Click <Link to='/warranty-policy'>here</Link> to know more about warranty registrations.</p>
      </div>
    </div>
  );
}

export default SampleStock;

