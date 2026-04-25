import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertOctagon, Timer, ShieldCheck, MapPin } from 'lucide-react';

const GuardScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const startScanner = () => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);
    
    // Wait for React to render the #reader div
    setTimeout(() => {
        const scanner = new Html5QrcodeScanner("reader", { 
          fps: 10, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true 
        });
        scanner.render(onScanSuccess, onScanError);
        
        // Save scanner instance to window for cleanup if needed
        window.scannerInstance = scanner;
    }, 150);
  };

  const onScanSuccess = async (qrData) => {
     if (loading) return;
     setLoading(true);
     
     try {
         const res = await fetch('http://localhost:5000/api/visitors/scan-qr', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ qrData, gateName: 'North Gate' })
         });
         const data = await res.json();
         
         if (data.success) {
            setScanResult({ ...data.data, message: data.message, type: 'success' });
            if (window.navigator.vibrate) window.navigator.vibrate(100);
            
            // Stop scanning on success
            stopScanner();
         } else {
            setScanResult({ message: data.message, type: 'error' });
            if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
            stopScanner();
         }
     } catch (e) {
         setError('Network Sync Failed. Is the server online?');
     } finally {
         setLoading(false);
     }
  };

  const stopScanner = () => {
    if (window.scannerInstance) {
        window.scannerInstance.clear().catch(e => console.warn(e));
        setIsScanning(false);
    }
  };

  const onScanError = (err) => { /* Ignore regular scanning noise */ };

  const handleReset = () => {
      setScanResult(null);
      setError(null);
      startScanner();
  };

  return (
    <div className="scanner-saas animate-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
                <h1 style={{ fontWeight: 800, fontSize: '1.8rem', margin: 0 }}>Security Terminal</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Scan visitor token for validation</p>
            </div>
            <div className="glass" style={{ padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>GATE-NORTH-01</span>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '32px' }}>
            {/* Left: Scanner Core */}
            <div className="glass" style={{ padding: '24px', borderRadius: '24px', minHeight: '400px', position: 'relative' }}>
                {!isScanning && !scanResult ? (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
                         <ShieldCheck size={80} color="var(--primary)" style={{ opacity: 0.15, marginBottom: '24px' }} />
                         <h3 style={{ marginBottom: '12px' }}>Ready for Verification</h3>
                         <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>
                            Initialize the system scanner to begin gate validation.
                         </p>
                         <button className="btn btn-primary" onClick={startScanner} style={{ padding: '12px 32px' }}>
                            Activate Laser Scanner
                         </button>
                    </div>
                ) : (
                    <div id="reader" style={{ border: 'none', borderRadius: '16px', overflow: 'hidden' }}></div>
                )}

                {loading && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                        <div className="spinner"></div>
                        <p style={{ marginTop: '16px', fontWeight: 700, letterSpacing: '1px' }}>VERIFYING CLOUD PASS...</p>
                    </div>
                )}
            </div>

            {/* Right: Real-time Feedback Card */}
            <div className="feedback-column">
                <AnimatePresence mode="wait">
                    {scanResult ? (
                        <motion.div 
                            key={scanResult.message}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className={`glass result-card result-${scanResult.type}`}
                            style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '24px' }}
                        >
                            <div style={{ marginBottom: '32px' }}>
                                {scanResult.type === 'success' ? (
                                    <CheckCircle size={80} color="var(--success)" />
                                ) : (
                                    <AlertOctagon size={80} color="var(--error)" />
                                )}
                            </div>
                            
                            <h2 style={{ marginBottom: '12px', textAlign: 'center', fontWeight: 800 }}>
                                {scanResult.type === 'success' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                            </h2>
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>{scanResult.message}</p>

                            {scanResult.name && (
                                <div style={{ width: '100%', background: 'rgba(0,0,0,0.02)', padding: '20px', borderRadius: '16px' }}>
                                    <div className="detail-row"><span>Visitor Name</span> <strong>{scanResult.name}</strong></div>
                                    <div className="detail-row"><span>Unit / Flat</span> <strong>{scanResult.flat || 'N/A'}</strong></div>
                                    <div className="detail-row" style={{ border: 'none' }}><span>Status</span> 
                                        <span className={`status-badge ${scanResult.status === 'inside' ? 'badge-active' : 'badge-used'}`}>
                                            {scanResult.status}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <button 
                                className="btn btn-primary" 
                                style={{ marginTop: '40px', width: '100%', padding: '14px' }}
                                onClick={handleReset}
                            >
                                Continue Scanning
                            </button>
                        </motion.div>
                    ) : (
                         <div className="glass" style={{ padding: '32px', height: '400px', opacity: 0.5, borderStyle: 'dashed', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                                <Timer size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                                <p style={{ fontWeight: 600 }}>Waiting for Security Token</p>
                            </div>
                         </div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {error && (
             <div className="glass animate-in" style={{ marginTop: '24px', padding: '16px 24px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                <AlertOctagon size={20} />
                {error}
             </div>
        )}

        <style>{`
            .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); }
            .spinner { width: 40px; height: 40px; border: 4px solid rgba(0,0,0,0.1); border-left-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
    </div>
  );
};

export default GuardScanner;
