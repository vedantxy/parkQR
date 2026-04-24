import React from 'react';

const QRModal = ({ qrCode, onClose }) => {
  if (!qrCode) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Visitor Entry Pass</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Please show this QR code at the entry gate.
        </p>
        
        <div className="qr-container">
          <img src={qrCode} alt="Visitor QR Code" className="qr-image" />
        </div>

        <button 
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.1)', marginTop: '10px' }}
        >
          Close Pass
        </button>
      </div>
    </div>
  );
};

export default QRModal;
