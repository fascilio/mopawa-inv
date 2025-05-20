import React, { useRef } from 'react';

function BarcodeInputScanner({ onDetected, scanStatus, scanMessage }) {
  const inputRef = useRef();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      let raw = e.target.value;
      
      const cleaned = raw.replace(/[\u0000-\u001F\u007F-\u009F\u25D9]/g, '').trim();

      if (cleaned) {
        onDetected(cleaned);
      }

      e.target.value = ''; 
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        autoFocus
        placeholder="Scan barcode here"
        onKeyDown={handleKeyDown}
        style={{
          padding: '1rem',
          fontSize: '1.2rem',
          width: '100%',
          border: scanStatus === 'success'
            ? '2px solid green'
            : scanStatus === 'error'
            ? '2px solid red'
            : '1px solid #ccc',
          transition: 'border 0.3s',
        }}
      />
      {scanStatus === 'success' && (
        <span style={{ position: 'absolute', right: 10, top: 10, color: 'green', fontSize: '1.5rem' }}>✔</span>
      )}
      {scanStatus === 'error' && (
        <span style={{ position: 'absolute', right: 10, top: 10, color: 'red', fontSize: '1.5rem' }}>✖</span>
      )}
      {scanMessage && (
        <div style={{ marginTop: '0.5rem', color: scanStatus === 'error' ? 'red' : 'green' }}>
          {scanMessage}
        </div>
      )}
    </div>
  );
}

export default BarcodeInputScanner;
