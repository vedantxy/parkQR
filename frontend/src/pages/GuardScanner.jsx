import React, { useState } from 'react';

const GuardScanner = () => {
  const [scannedData, setScannedData] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/visitors/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scannedData }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'Verification Failed');
      }
    } catch (err) {
      setError('Connection to backend failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ margin: '0' }}>
      <div className="glass card">
        <h2>QR Surveillance</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Simulated scanning interface for entry verification.
        </p>

        <div className="form-field">
          <label>Encrypted QR Payload</label>
          <textarea
            value={scannedData}
            onChange={(e) => setScannedData(e.target.value)}
            className="form-input"
            placeholder='Paste scannable data here...'
            style={{ height: '100px', fontFamily: 'monospace', fontSize: '0.75rem' }}
          />
        </div>

        <button 
            onClick={handleVerify} 
            className="btn-primary"
            disabled={loading || !scannedData}
            style={{ marginTop: '10px' }}
        >
          {loading ? 'Decrypting...' : 'Verify Access'}
        </button>

        {error && (
          <div className="glass" style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: 'rgba(244, 63, 94, 0.1)', 
            color: 'var(--error)', 
            borderRadius: '12px', 
            textAlign: 'center',
            border: '1px solid rgba(244, 63, 94, 0.2)'
          }}>
            <strong>DENIED:</strong> {error}
          </div>
        )}

        {result && (
          <div className="glass" style={{ 
            marginTop: '20px', 
            padding: '20px', 
            background: 'rgba(16, 185, 129, 0.1)', 
            color: 'var(--success)', 
            borderRadius: '12px', 
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>ACCESS GRANTED</h3>
            <div style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Visitor:</span>
                <span>{result.visitor.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Destination:</span>
                <span>Flat {result.visitor.flat}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Entry Logged:</span>
                <span>{new Date(result.visitor.entryTime).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default GuardScanner;
