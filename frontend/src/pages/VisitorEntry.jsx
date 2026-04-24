import React, { useState } from 'react';
import VisitorForm from '../components/VisitorForm';
import QRModal from '../components/QRModal';

const VisitorEntry = () => {
  const [qrCode, setQrCode] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVisitorSubmit = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setQrCode(data.qrCode);
        setExpiresAt(data.expiresAt);
      } else {
        setError(data.message || 'Failed to generate pass');
      }
    } catch (err) {
      setError('Server connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 0' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>Visitor Registration</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.875rem' }}>
          Assign access credentials and generate visual entry tokens.
        </p>

        {error && (
          <div style={{ 
            padding: '12px', 
            background: '#fef2f2', 
            color: 'var(--error)', 
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '0.875rem',
            fontWeight: 600,
            border: '1px solid #fee2e2'
          }}>
            ⚠️ {error}
          </div>
        )}

        <VisitorForm onSubmit={handleVisitorSubmit} loading={loading} />
      </div>

      <QRModal 
        qrCode={qrCode} 
        expiresAt={expiresAt} 
        onClose={() => setQrCode(null)} 
      />
    </div>
  );



};

export default VisitorEntry;
