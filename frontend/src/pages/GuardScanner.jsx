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
    <div className="container">
      <div className="card">
        <h2>Guard Control: QR Verification</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '20px' }}>
          Paste the JSON data from the QR code to simulate a scan.
        </p>

        <div className="form-group">
          <label>QR Payload (Simulated Scan)</label>
          <textarea
            value={scannedData}
            onChange={(e) => setScannedData(e.target.value)}
            placeholder='{"vId": "...", "flat": "...", "exp": ...}'
            style={{ 
                width: '100%', 
                height: '100px', 
                background: 'rgba(0,0,0,0.2)', 
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '10px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.8rem'
            }}
          />
        </div>

        <button 
            onClick={handleVerify} 
            disabled={loading || !scannedData}
            style={{ width: '100%', padding: '12px', background: '#6366f1' }}
        >
          {loading ? 'Verifying...' : 'Verify Entry'}
        </button>

        {error && (
          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', textAlign: 'center' }}>
            <strong>Access Denied:</strong> {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '8px', textAlign: 'center' }}>
            <strong>✅ {result.message}</strong>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#fff' }}>
              Visitor: {result.visitor.name} <br/>
              Flat: {result.visitor.flat} <br/>
              Entry Time: {new Date(result.visitor.entryTime).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuardScanner;
