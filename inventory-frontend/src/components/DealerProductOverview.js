import React from 'react';
import { useNavigate } from 'react-router-dom';

function DealerProductOverview({ dealer, dealerProducts, subDealers }) {
  const navigate = useNavigate();
  const totalSubDealerProducts = subDealers.reduce((sum, sub) => sum + (sub.stockCount || 0), 0);
  const totalProducts = dealerProducts.length + totalSubDealerProducts;

  return (
    <div
      className="product-box clickable"
      onClick={() => navigate(`/dealer-overview/${dealer.id}`)}
    >
      <h4>MP5PO</h4>
      <p>Main Dealer Stock: {dealerProducts.length}</p>
      <p>Sub-Dealers: {subDealers.length}</p>
      <p>Total Products: {totalProducts}</p>
    </div>
  );
}

export default DealerProductOverview;
