import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const GuardScanner = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  
  const scannerRef = useRef(null);

  useEffect(() => {
    // Only initialize scanner if it hasn't been initialized or if we are in scanning state
    if (!scannerRef.current && isScanning) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader", 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(onScanSuccess, onScanError);
      scannerRef.current = scanner;
    }

    // Cleanup function to stop scanner on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear scanner on unmount.", error);
        });
        scannerRef.current = null;
      }
    };
  }, [isScanning]);

  const onScanSuccess = async (decodedText) => {
    try {
      // 1. Stop scanning immediately after success
      if (scannerRef.current) {
        await scannerRef.current.clear();
        scannerRef.current = null;
        setIsScanning(false);
      }

      setLoading(true);
      setError('');

      // 2. Send token to backend for verification
      const response = await fetch('http://localhost:5000/api/visitors/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scannedData: decodedText }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        // Play success sound or vibrate if possible
        if (navigator.vibrate) navigator.vibrate(200);
      } else {
        setError(data.message || 'Verification Failed');
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        // Allow re-scanning after error
        setIsScanning(true);
      }
    } catch (err) {
      setError('Connection to backend failed.');
      setIsScanning(true);
    } finally {
      setLoading(false);
    }
  };

  const onScanError = (errorMessage) => {
    // We don't want to show every scan attempt error (like "No QR code found")
    // as it happens 10 times per second.
    // console.log(errorMessage);
  };

  const handleReset = () => {
    setResult(null);
    setError('');
    setIsScanning(true);
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div className="card glass">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text)' }}>
          Gate Entry Terminal
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
          Authorized security personnel only. Scan visitor pass for instant verification.
        </p>

        {isScanning && !loading && (
          <div id="qr-reader" style={{ 
            width: '100%', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            border: '2px dashed var(--primary)',
            background: 'rgba(255,255,255,0.05)'
          }}></div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
            <p style={{ fontWeight: 600 }}>Authenticating Token...</p>
          </div>
        )}

        {error && !loading && (
          <div style={{ 
            marginTop: '20px', 
            padding: '24px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            borderRadius: '16px', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px 0', textTransform: 'uppercase' }}>Access Denied</h3>
            <p style={{ fontWeight: 500 }}>{error}</p>
            <button 
              onClick={handleReset}
              className="btn"
              style={{ marginTop: '16px', background: '#ef4444', color: 'white' }}
            >
              Try Again
            </button>
          </div>
        )}

        {result && !loading && (
          <div style={{ 
            marginTop: '20px', 
            animation: 'slideUp 0.4s ease-out'
          }}>
            <div style={{ 
              padding: '24px', 
              background: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '20px', 
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'var(--success)', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'white',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                }}>✓</div>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--success)', fontWeight: 800 }}>VERIFIED ENTRY</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(16, 185, 129, 0.7)' }}>
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                <div className="info-row">
                  <span className="label">Visitor Name</span>
                  <span className="value">{result.visitor.name}</span>
                </div>
                <div className="info-row">
                  <span className="label">Authorized Flat</span>
                  <span className="value">Unit {result.visitor.flat}</span>
                </div>
                <div className="info-row">
                  <span className="label">Vehicle No</span>
                  <span className="value">{result.visitor.vehicle || 'None'}</span>
                </div>
              </div>

              <button 
                onClick={handleReset}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '20px' }}
              >
                Scan Next Visitor
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .info-row:last-child { border-bottom: none; }
        .label { color: var(--text-muted); font-size: 0.85rem; }
        .value { font-weight: 700; color: var(--text); }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255,255,255,0.1);
          border-left-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        #qr-reader__dashboard_section_csr button {
          background: var(--primary) !important;
          color: white !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          font-weight: 600 !important;
        }
        #qr-reader__status_span { font-size: 0.8rem !important; color: var(--text-muted) !important; }
      `}</style>
    </div>
  );
};

export default GuardScanner;
