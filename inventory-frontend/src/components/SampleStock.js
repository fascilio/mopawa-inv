import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SampleStock() {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState('');
  const [sampleProducts, setSampleProducts] = useState([]);
  const [barcode, setBarcode] = useState('');

  // Fetch all sample destinations
  useEffect(() => {
    axios.get('http://localhost:5000/api/samples')
      .then(res => setSamples(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch sample stock
  const fetchSampleStock = () => {
    if (!selectedSample) return;

    axios.get(`http://localhost:5000/api/samples/${selectedSample}/stock`)
      .then(res => setSampleProducts(res.data))
      .catch(err => console.error(err));
  };

  // Assign product to sample
  const assignProduct = () => {
    if (!barcode || !selectedSample) return;

    axios.post('http://localhost:5000/api/products/assign', {
      barcode,
      destinationType: 'sample',
      destinationId: selectedSample,
    }).then(() => {
      fetchSampleStock();
      setBarcode('');
    }).catch(err => {
      console.error(err);
      alert('Assignment failed');
    });
  };

  return (
    <div>
      <h2>Assign Products to Sample</h2>

      <select
        value={selectedSample}
        onChange={(e) => {
          setSelectedSample(e.target.value);
          setSampleProducts([]);
        }}
      >
        <option value="">Select Sample</option>
        {samples.map(sample => (
          <option key={sample._id} value={sample._id}>
            {sample.name}
          </option>
        ))}
      </select>

      <button onClick={fetchSampleStock}>View Sample Stock</button>

      <br /><br />

      <input
        type="text"
        placeholder="Enter barcode to assign"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
      />
      <button onClick={assignProduct}>Assign to Sample</button>

      <h3>Sample Stock</h3>
      <ul>
        {sampleProducts.map(p => (
          <li key={p._id}>{p.barcode}</li>
        ))}
      </ul>
    </div>
  );
}

export default SampleStock;
