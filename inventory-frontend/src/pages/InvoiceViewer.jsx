import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InvoicePage from './InvoicePage';
import axios from 'axios';

function InvoiceViewer() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`${process.env.BASE_URL}/api/invoice${invoiceId}`);
        //(`http://localhost:5000/api/invoice/${invoiceId}`);
        setInvoice(res.data);
      } catch (err) {
        console.error('Failed to fetch invoice:', err);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  return <InvoicePage invoice={invoice} />;
}

export default InvoiceViewer;
