import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function DealerOverviewPage() {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [dealerProducts, setDealerProducts] = useState([]);
  const [subDealers, setSubDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [dealerRes, stockRes, subRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/api/dealers/${id}`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/api/dealers/${id}/stock`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/api/dealers/${id}/subdealers`)
        ]);

        setDealer(dealerRes.data);
        setDealerProducts(stockRes.data);
        //setSubDealers(subRes.data);
        const subsWithStock = await Promise.all(
            subRes.data.map(async (sub) => {
                try {
                //const stockRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dealers/${sub.id || sub._id}/stock`);
                const stockRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dealers/${id}/subdealers/${sub.id}/stock`);
                return { ...sub, stockCount: stockRes.data.length };
                } catch (err) {
                console.error(`Failed to fetch stock for sub-dealer ${sub.name}`, err);
                return { ...sub, stockCount: 0 };
                }
            })
            );

        setSubDealers(subsWithStock);
      } catch (err) {
        console.error('Overview load error:', err);
        setError('Failed to load dealer overview.');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [id]);

  if (loading) return <div style={{ padding: '20px' }}>Loading overview...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dealer Overview: {dealer.name}</h2>

      <div style={{ marginBottom: '20px' }}>
        <strong>Main Dealer Stock:</strong> {dealerProducts.length}<br />
        <strong>Sub-Dealers:</strong> {subDealers.length}
      </div>

      <section>
        <h3>Main Dealer Products</h3>
        {dealerProducts.length === 0 ? (
          <p>No products assigned.</p>
        ) : (
          <ul>
            {dealerProducts.map(p => (
              <li key={p.id || p._id}>{p.barcode}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>Sub-Dealer Stocks</h3>
        {subDealers.length === 0 && <p>No sub-dealers found.</p>}
        {subDealers.map(sub => (
          <div key={sub.id || sub._id} style={{ marginBottom: '20px' }}>
            <h4>{sub.name} ({sub.stockCount || 0})</h4>
            <SubDealerStock subDealerId={sub.id || sub._id} />
          </div>
        ))}
      </section>

      <div> <ReturnedProductList dealerId={id} /> </div>

      <Link to="/dealer-stock" style={{ display: 'inline-block', marginTop: '30px', color: '#007bff' }}>
        ← Back to Dealers
      </Link>
    </div>
  );
}

function SubDealerStock({ subDealerId }) {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/dealers/${subDealerId}/stock`)
      .then(res => setStock(res.data))
      .catch(err => console.error('Sub-dealer stock error:', err))
      .finally(() => setLoading(false));
  }, [subDealerId]);

  if (loading) return <p>Loading stock...</p>;

  return (
    <ul>
      {stock.length === 0
        ? <li>No stock available</li>
        : stock.map(item => <li key={item.id || item._id}>{item.barcode}</li>)
      }
    </ul>
  );
}

function ReturnedProductList({ dealerId }) {
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/dealers/${dealerId}/returns`)
      .then(res => setReturns(res.data))
      .catch(err => console.error('Failed to load returns', err));
  }, [dealerId]);

    return (
    <div style={{ marginTop: '30px' }}>
      <h3>Returned Products</h3>
      {returns.length === 0 ? (
        <p>No returned products yet.</p>
      ) : (
        <ul>
          {returns.map(ret => (
            <li key={ret.id}>
              <strong>{ret.barcode}</strong> - {ret.reason}
              {ret.imageUrl && (
                <div>
                  <img
                    src={`${process.env.REACT_APP_BASE_URL}${ret.imageUrl}`}
                    alt="Return"
                    style={{ width: '100px', marginTop: '5px' }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DealerOverviewPage;
