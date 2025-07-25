import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './InvoicePage.css';
import html2pdf from 'html2pdf.js';
import axios from 'axios';
import logo from '../assets/mopawalogo.png';

function InvoicePage() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/invoice/${invoiceId}`);
        //(`http://localhost:5000/api/invoice/${invoiceId}`);
        setInvoice(res.data);
      } catch (err) {
        console.error('Failed to fetch invoice', err);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  const handleDownload = () => {
    const element = document.getElementById('invoice-container');
    html2pdf()
      .set({
        margin: 10,
        filename: `${invoice.invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save();
  };

  const handlePrint = () => {
    window.print();
  };
  

  if (!invoice) return <div>Loading invoice...</div>;

  return (
    <div className="invoice-page">
      <div id="invoice-container">
        <header>
          <img src={logo} alt="Company Logo" style={{ height: '80px' }} />
          <h2>Mopawa Software LTD</h2>
          <p>Bush House, Kabarnet Road <br />
            • +254 708 999 666 <br />
            • www.mopawa.co.ke 
            </p>
        </header>

        <section className="invoice-details">
          <h3>Invoice #{invoice.invoiceNumber}</h3>
          <p>Date: {new Date(invoice.date).toLocaleDateString()}</p>
          <p><strong>To:</strong> {invoice.customer.name}</p>
          <p>Customer Type: {invoice.customerType}</p>
        </section>
        <section className="product-list">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Unit Price (Ksh)</th>
                <th>Quantity</th>
                <th>Total (Ksh)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>MPO501</td>
                <td>1000</td>
                <td>{invoice.totalItems}</td>
                <td>{invoice.totalItems * 1000}</td>
              </tr>
            </tbody>
          </table>

          <p className="total">Total Items: {invoice.totalItems}</p>
          <p className="total">Total Amount: {invoice.totalItems * 1000} Ksh</p>
        </section>
      </div>

      <button className="download-btn" onClick={handleDownload}>
        Download PDF
      </button> <br />
      <button className="download-btn" onClick={handlePrint}>
        Print Invoice
      </button>
    </div>
  );
}

export default InvoicePage;
