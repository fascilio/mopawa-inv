import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './StockIn.css';
//import ProductScanner from './ProductScanner'

function StockInPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/products/all')
        .then(res => setProducts(res.data.reverse()))
        .catch(err => console.error(err));
    }, []);

    return (
        <div className="table-scroll-container">
            
            <h3> All registered products</h3>
            {/* <ProductScanner /> */}
            <ul>
                {products.map(p => (
                    <li key={p._id}>
                    {p.barcode} <br />
                    Stocked In: {new Date(p.createdAt).toLocaleString()}
                    </li>
                ))}
                </ul>

        </div>
    )
}

export default StockInPage