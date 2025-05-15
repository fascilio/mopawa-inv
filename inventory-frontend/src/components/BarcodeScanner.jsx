import React, { useRef } from 'react';

function BarcodeInputScanner({ onDetected }) {
  const inputRef = useRef();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const barcode = e.target.value.trim();
      if (barcode) {
        onDetected(barcode);
        e.target.value = ''; 
      }
    }
  };

  return (
    <input
      ref={inputRef}
      autoFocus
      placeholder="Scan barcode here"
      onKeyDown={handleKeyDown}
      style={{ padding: '1rem', fontSize: '1.2rem', width: '100%' }}
    />
  );
}

export default BarcodeInputScanner;

