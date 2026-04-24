import React from 'react';

const QRModal = ({ qrCode, onClose, expiresAt }) => {
  if (!qrCode) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass modal-content qr-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Security Pass</h2>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>
          Authorized Entry for Resident Verification
        </div>
        
        <div className="qr-frame">
          <img src={qrCode} alt="Visitor QR Code" className="qr-image-full" />
        </div>

        <div className="glass" style={{ padding: '12px', marginBottom: '20px', background: 'rgba(99, 102, 241, 0.05)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>EXPIRES AT</div>
          <div style={{ fontWeight: '600', color: 'var(--primary)' }}>
            {expiresAt ? new Date(expiresAt).toLocaleTimeString() : '--:--'}
          </div>
        </div>

        <button 
          className="btn-primary"
          onClick={onClose}
          style={{ width: '100%' }}
        >
          Confirm & Close
        </button>
      </div>
    </div>
  );
};


export default QRModal;
