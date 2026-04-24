import React, { useState } from 'react';
import VisitorForm from '../components/VisitorForm';
import QRModal from '../components/QRModal';

const VisitorEntry = () => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVisitorSubmit = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      // Note: Make sure backend is running on 5000 and CORS is enabled
      const response = await fetch('http://localhost:5000/api/visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If you have auth implemented, add token here:
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setQrCode(data.qrCode); // This is the base64 image from backend
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
    <div className="container">
      <div className="card">
        <h2>Visitor Entry</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '30px' }}>
          Register a new visitor to generate a security pass.
        </p>

        {error && (
          <div style={{ 
            padding: '10px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <VisitorForm onSubmit={handleVisitorSubmit} loading={loading} />
      </div>

      <QRModal qrCode={qrCode} onClose={() => setQrCode(null)} />
    </div>
  );
};

export default VisitorEntry;
