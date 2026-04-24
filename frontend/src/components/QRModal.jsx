import React from 'react';

const QRModal = ({ qrCode, onClose, expiresAt }) => {
  if (!qrCode) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
             <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Security QR Pass</h2>
             <span className="status-badge badge-active">Active</span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          This pass is valid for one-time entry until the expiry time listed below.
        </p>
        
        <div className="qr-wrapper">
          <img src={qrCode} alt="Security Pass" style={{ width: '220px', height: '220px' }} />
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
           <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Token Expires In</div>
           <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
              {expiresAt ? new Date(expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '30:00'}
           </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={onClose}>
              Done
            </button>
            <button className="btn" style={{ background: '#f1f5f9', color: 'var(--text-main)' }}>
              Download
            </button>
        </div>

        <div style={{ marginTop: '20px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          Powered by <strong>ParkSmart Enterprise</strong>
        </div>
      </div>
    </div>
  );
};



export default QRModal;
