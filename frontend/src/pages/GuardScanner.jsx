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
    <div className="container" style={{ maxWidth: '500px', margin: '0 0' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>Security Surveillance</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.875rem' }}>
          Real-time entry verification terminal.
        </p>

        <div className="form-group" style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '2px solid #e2e8f0' }}>
          <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>Simulated Optical Input</label>
          <textarea
            value={scannedData}
            onChange={(e) => setScannedData(e.target.value)}
            className="form-input"
            placeholder='Ready for QR payload...'
            style={{ height: '120px', background: 'white', fontFamily: 'monospace' }}
          />
          <div style={{ marginTop: '12px', height: '4px', background: 'var(--primary)', borderRadius: '2px', opacity: 0.3 }}></div>
        </div>

        <button 
            onClick={handleVerify} 
            className="btn btn-primary"
            disabled={loading || !scannedData}
            style={{ width: '100%', marginTop: '24px' }}
        >
          {loading ? 'Analyzing Token...' : 'Verify Entry Credentials'}
        </button>

        {error && (
          <div style={{ 
            marginTop: '24px', 
            padding: '20px', 
            background: '#fef2f2', 
            color: 'var(--error)', 
            borderRadius: '12px', 
            border: '1px solid #fee2e2',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 4px 0' }}>🚫 ACCESS DENIED</h4>
            <div style={{ fontSize: '0.875rem' }}>Reason: {error}</div>
          </div>
        )}

        {result && (
          <div style={{ 
            marginTop: '24px', 
            padding: '24px', 
            background: '#ecfdf5', 
            color: '#065f46', 
            borderRadius: '12px', 
            border: '1px solid #d1fae5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
               <div style={{ width: 12, height: 12, background: 'var(--success)', borderRadius: '50%' }}></div>
               <h4 style={{ margin: 0, fontWeight: 800 }}>✅ VERIFIED: ENTRY ALLOWED</h4>
            </div>
            
            <div style={{ fontSize: '0.875rem', color: '#064e3b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(6, 95, 70, 0.1)', paddingBottom: '8px' }}>
                <span>Visitor</span>
                <strong>{result.visitor.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(6, 95, 70, 0.1)', paddingBottom: '8px' }}>
                <span>Authorized Unit</span>
                <strong>{result.visitor.flat}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Log Timestamp</span>
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
