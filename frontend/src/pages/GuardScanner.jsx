import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const GuardScanner = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  
  const scannerRef = useRef(null);

  useEffect(() => {
    // Only initialize scanner if the container exists and we are in scanning state
    const qrReaderDiv = document.getElementById("qr-reader");
    
    if (isScanning && !loading && qrReaderDiv && !scannerRef.current) {
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
  }, [isScanning, loading]);

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

      // 2. Send token to backend for unified scan
      const response = await fetch('http://localhost:5000/api/visitors/scan-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          qrData: decodedText,
          gateName: "Main Entrance", // Optional tracking
          scannedBy: "GUARD_001"    // Optional tracking
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        if (navigator.vibrate) navigator.vibrate(200);
      } else {
        setError(data.message || 'Scan Processing Failed');
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        setIsScanning(true);
      }
    } catch (err) {
      setError('Connection to security server lost.');
      setIsScanning(true);
    } finally {
      setLoading(false);
    }
  };

  const onScanError = (errorMessage) => {
    // console.log(errorMessage);
  };

  const handleReset = () => {
    setResult(null);
    setError('');
    setIsScanning(true);
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div className="card glass animate-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
               Smart Scan Terminal
             </h2>
             <div style={{ padding: '4px 12px', background: 'rgba(30, 64, 175, 0.1)', color: 'var(--primary)', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700 }}>
                ONLINE
             </div>
        </div>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
          Unified Entry & Exit verification system. Place QR code clearly in the scanner.
        </p>

        {isScanning && !loading && (
          <div id="qr-reader" style={{ 
            width: '100%', 
            borderRadius: '20px', 
            overflow: 'hidden', 
            border: '2px solid rgba(255,255,255,0.1)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}></div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
            <p style={{ fontWeight: 600, letterSpacing: '1px' }}>PROCESSING LIFECYCLE...</p>
          </div>
        )}

        {error && !loading && (
          <div className="animate-in" style={{ 
            marginTop: '20px', 
            padding: '30px', 
            background: 'rgba(239, 68, 68, 0.05)', 
            color: '#ef4444', 
            borderRadius: '20px', 
            border: '1px solid rgba(239, 68, 68, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 10px 0', fontWeight: 800 }}>SECURITY BLOCK</h3>
            <p style={{ fontWeight: 500, opacity: 0.8 }}>{error}</p>
            <button 
              onClick={handleReset}
              className="btn"
              style={{ marginTop: '24px', background: '#ef4444', color: 'white', padding: '12px 30px' }}
            >
              Retry Scan
            </button>
          </div>
        )}

        {result && !loading && (
          <div className="animate-in" style={{ marginTop: '20px' }}>
            <div style={{ 
              padding: '30px', 
              background: result.data.status === 'inside' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(30, 64, 175, 0.05)', 
              borderRadius: '24px', 
              border: `1px solid ${result.data.status === 'inside' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(30, 64, 175, 0.1)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  background: result.data.status === 'inside' ? 'var(--success)' : 'var(--primary)', 
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: 'white',
                  boxShadow: result.data.status === 'inside' ? '0 10px 20px rgba(16, 185, 129, 0.2)' : '0 10px 20px rgba(30, 64, 175, 0.2)'
                }}>
                  {result.data.status === 'inside' ? '▼' : '▲'}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: result.data.status === 'inside' ? 'var(--success)' : 'var(--primary)', fontWeight: 800 }}>
                    {result.data.status === 'inside' ? 'ENTRY AUTHORIZED' : 'EXIT AUTHORIZED'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {result.message}
                  </p>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <div className="info-row">
                  <span className="label">Visitor</span>
                  <span className="value">{result.data.name}</span>
                </div>
                <div className="info-row">
                  <span className="label">Unit No.</span>
                  <span className="value">{result.data.flat}</span>
                </div>
                <div className="info-row">
                  <span className="label">Current Status</span>
                  <span className={`status-badge ${result.data.status === 'inside' ? 'badge-active' : 'badge-used'}`} style={{ padding: '2px 8px' }}>
                    {result.data.status.toUpperCase()}
                  </span>
                </div>
                {result.data.entryTime && (
                  <div className="info-row">
                    <span className="label">Entry At</span>
                    <span className="value">{new Date(result.data.entryTime).toLocaleTimeString()}</span>
                  </div>
                )}
                {result.data.exitTime && (
                  <div className="info-row">
                    <span className="label">Exit At</span>
                    <span className="value">{new Date(result.data.exitTime).toLocaleTimeString()}</span>
                  </div>
                )}
              </div>

              <button 
                onClick={handleReset}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '24px', padding: '14px' }}
              >
                Ready for Next Scan
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
