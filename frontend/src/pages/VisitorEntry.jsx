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
    <div className="container" style={{ margin: '0' }}>
      <div className="glass card">
        <h2>Visitor Registration</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px' }}>
          Real-time encrypted pass generation.
        </p>

        {error && (
          <div className="glass" style={{ 
            padding: '12px', 
            background: 'rgba(244, 63, 94, 0.1)', 
            color: 'var(--error)', 
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            border: '1px solid rgba(244, 63, 94, 0.2)'
          }}>
            {error}
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
