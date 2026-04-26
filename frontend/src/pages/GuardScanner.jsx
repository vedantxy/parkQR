import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanLine, ShieldCheck, AlertTriangle, CheckCircle, XCircle,
  Clock, MapPin, RotateCcw, Zap, Keyboard, Send, User, Car, Home, Camera
} from 'lucide-react';
import toast from 'react-hot-toast';

const GuardScanner = () => {
  const { user } = useAuth();
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [scanMode, setScanMode] = useState('qr'); // 'qr' or 'alpr'
  const [alprScanning, setAlprScanning] = useState(false);

  const startScanner = () => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);

    setTimeout(() => {
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        aspectRatio: 1.0
      });
      scanner.render(onScanSuccess, () => {});
      window.scannerInstance = scanner;
    }, 200);
  };

  const stopScanner = () => {
    if (window.scannerInstance) {
      window.scannerInstance.clear().catch(() => {});
      setIsScanning(false);
    }
  };

  const processQR = async (qrData) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/visitors/scan-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ qrData, gateName: 'MAIN-GATE-01' })
      });

      const data = await res.json();

      if (res.status === 401) {
        setError('Authentication failed. Please re-login.');
        stopScanner();
      } else if (data.success) {
        const result = { ...data.data, message: data.message, type: 'success', time: new Date().toLocaleTimeString() };
        setScanResult(result);
        setRecentScans(prev => [result, ...prev].slice(0, 5));
        toast.success(data.message || 'Access Granted');
        if (window.navigator.vibrate) window.navigator.vibrate(100);
        stopScanner();
      } else {
        const result = { message: data.message, type: 'error', time: new Date().toLocaleTimeString() };
        setScanResult(result);
        setRecentScans(prev => [result, ...prev].slice(0, 5));
        toast.error(data.message || 'Access Denied');
        if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
        stopScanner();
      }
    } catch (e) {
      setError('Network error. Backend may be offline.');
      toast.error('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const onScanSuccess = (qrData) => processQR(qrData);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      processQR(manualCode.trim());
      setManualCode('');
    }
  };

  const simulateALPR = () => {
    setAlprScanning(true);
    setScanResult(null);
    setError(null);
    
    // Simulate 2 second scanning processing
    setTimeout(() => {
      setAlprScanning(false);
      
      // Generate a mock result
      const mockResult = {
        name: 'Mock Resident / Visitor',
        vehicleNumber: 'MH 02 AB 1234',
        flat: 'A-101',
        message: 'ALPR Match Found: Access Granted',
        type: 'success',
        time: new Date().toLocaleTimeString(),
        slotId: 'P-12'
      };
      
      setScanResult(mockResult);
      setRecentScans(prev => [mockResult, ...prev].slice(0, 5));
      toast.success('ALPR Match Found');
      if (window.navigator.vibrate) window.navigator.vibrate(100);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">Guard Scanner</h1>
          <p className="text-sm text-txt-secondary mt-0.5">Scan visitor QR codes for entry/exit verification</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-border rounded-btn px-3 py-2">
          <MapPin size={14} className="text-primary" />
          <span className="text-sm font-medium text-txt-primary">Main Gate</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Area */}
        <div className="space-y-4">
          
          {/* Scan Mode Toggle */}
          <div className="flex p-1 bg-surface rounded-xl">
            <button
              onClick={() => { setScanMode('qr'); stopScanner(); setScanResult(null); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                scanMode === 'qr' ? 'bg-white text-primary shadow-sm' : 'text-txt-muted hover:text-txt-secondary'
              }`}
            >
              <ScanLine size={16} /> QR Code
            </button>
            <button
              onClick={() => { setScanMode('alpr'); stopScanner(); setScanResult(null); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                scanMode === 'alpr' ? 'bg-white text-primary shadow-sm' : 'text-txt-muted hover:text-txt-secondary'
              }`}
            >
              <Camera size={16} /> ALPR (Mock)
            </button>
          </div>

          <div className="bg-white rounded-card border border-border shadow-card overflow-hidden">
            <div className="aspect-square relative flex items-center justify-center bg-surface">
              {scanMode === 'qr' ? (
                <>
                  {!isScanning && !scanResult ? (
                <div className="text-center p-8">
                  <div className="h-20 w-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ScanLine size={36} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-txt-primary mb-2">Scanner Ready</h3>
                  <p className="text-sm text-txt-muted mb-6 max-w-xs mx-auto">
                    Activate the camera to scan visitor QR codes for instant verification
                  </p>
                  <button
                    onClick={startScanner}
                    className="px-6 py-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-btn shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 mx-auto"
                  >
                    <Zap size={16} /> Start Scanner
                  </button>
                </div>
              ) : (
                <div id="reader" className="w-full h-full" />
              )}

              {/* Scanning overlay */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Corner brackets */}
                  <div className="absolute top-8 left-8 w-12 h-12 border-t-3 border-l-3 border-primary rounded-tl-lg" style={{ borderWidth: '3px 0 0 3px' }} />
                  <div className="absolute top-8 right-8 w-12 h-12 border-t-3 border-r-3 border-primary rounded-tr-lg" style={{ borderWidth: '3px 3px 0 0' }} />
                  <div className="absolute bottom-8 left-8 w-12 h-12 border-b-3 border-l-3 border-primary rounded-bl-lg" style={{ borderWidth: '0 0 3px 3px' }} />
                  <div className="absolute bottom-8 right-8 w-12 h-12 border-b-3 border-r-3 border-primary rounded-br-lg" style={{ borderWidth: '0 3px 3px 0' }} />
                  {/* Scan line */}
                  <div className="absolute left-12 right-12 h-0.5 bg-primary/60 animate-scan" />
                </div>
              )}

              {/* Loading overlay */}
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  <div className="h-10 w-10 border-3 border-primary-200 border-t-primary rounded-full animate-spin" style={{ borderWidth: '3px' }} />
                  <p className="mt-4 text-sm font-semibold text-txt-secondary">Verifying...</p>
                </div>
              )}
            </>
          ) : (
            // ALPR Mode UI
            <div className="text-center p-8 w-full h-full flex flex-col items-center justify-center relative bg-gray-900 text-white">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
              
              <div className="relative z-10 w-full">
                <div className="h-20 w-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-primary/50">
                  <Camera size={36} className="text-primary-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Number Plate Scanner</h3>
                <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto">
                  Automatically detects vehicles approaching the gate
                </p>
                
                <button
                  onClick={simulateALPR}
                  disabled={alprScanning}
                  className="px-6 py-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-btn shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 mx-auto w-full max-w-[200px] disabled:opacity-50"
                >
                  {alprScanning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
                      Scanning...
                    </>
                  ) : (
                    <>
                      <ScanLine size={16} /> Simulate Car Arrival
                    </>
                  )}
                </button>

                {/* ALPR Scanning visual effect */}
                {alprScanning && (
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-32 overflow-hidden pointer-events-none opacity-50">
                    <div className="w-full h-1 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)] animate-pulse" />
                    <div className="w-full h-full bg-gradient-to-b from-green-400/20 to-transparent" />
                  </div>
                )}
              </div>
            </div>
          )}
            </div>
          </div>

          {/* Manual Input */}
          <div className="bg-white rounded-card border border-border shadow-card p-4">
            <button
              onClick={() => setShowManual(!showManual)}
              className="flex items-center gap-2 text-sm font-medium text-txt-secondary hover:text-primary transition-colors w-full"
            >
              <Keyboard size={16} />
              Manual QR Input
              <span className="ml-auto text-xs text-txt-muted">{showManual ? 'Hide' : 'Show'}</span>
            </button>
            <AnimatePresence>
              {showManual && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleManualSubmit}
                  className="mt-3 flex gap-2 overflow-hidden"
                >
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Paste QR data here..."
                    className="flex-1 h-10 bg-surface border border-border rounded-btn px-3 text-sm outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all"
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 bg-primary text-white rounded-btn text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-1.5"
                  >
                    <Send size={14} /> Verify
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Result Panel */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {scanResult ? (
              <motion.div
                key={`result-${scanResult.time}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`bg-white rounded-card border-2 shadow-card p-6
                  ${scanResult.type === 'success' ? 'border-success' : 'border-danger'}`}
              >
                {/* Status Icon */}
                <div className="text-center mb-5">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3
                    ${scanResult.type === 'success' ? 'bg-success-50' : 'bg-danger-50'}`}
                  >
                    {scanResult.type === 'success' ? (
                      <CheckCircle size={32} className="text-success" />
                    ) : (
                      <XCircle size={32} className="text-danger" />
                    )}
                  </div>
                  <h2 className={`text-xl font-bold ${scanResult.type === 'success' ? 'text-success' : 'text-danger'}`}>
                    {scanResult.type === 'success' ? 'Access Granted' : 'Access Denied'}
                  </h2>
                  <p className="text-sm text-txt-secondary mt-1">{scanResult.message}</p>
                </div>

                {/* Visitor Details */}
                {scanResult.name && (
                  <div className="bg-surface rounded-btn p-4 space-y-3 mb-5">
                    <DetailRow icon={User} label="Visitor" value={scanResult.name} />
                    <DetailRow icon={Car} label="Vehicle" value={scanResult.vehicleNumber || scanResult.slotId || 'N/A'} highlight />
                    <DetailRow icon={Home} label="Flat" value={scanResult.flat || 'N/A'} />
                    <DetailRow icon={Clock} label="Time" value={scanResult.time} />
                  </div>
                )}

                {/* Reset Button */}
                <button
                  onClick={() => { setScanResult(null); startScanner(); }}
                  className="w-full py-3 border border-border rounded-btn text-sm font-semibold text-txt-secondary hover:bg-surface transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} /> Scan Next
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-card border-2 border-dashed border-border p-10 text-center"
              >
                <Clock size={40} className="text-txt-muted mx-auto mb-3" />
                <h3 className="font-semibold text-txt-primary mb-1">Waiting for Scan</h3>
                <p className="text-sm text-txt-muted">Results will appear here after scanning</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-danger-50 border border-danger/20 rounded-btn p-3 flex items-center gap-2"
            >
              <AlertTriangle size={16} className="text-danger flex-shrink-0" />
              <p className="text-sm text-danger font-medium">{error}</p>
            </motion.div>
          )}

          {/* Recent Scans */}
          {recentScans.length > 0 && (
            <div className="bg-white rounded-card border border-border shadow-card">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-txt-primary text-sm">Recent Scans</h3>
              </div>
              <div className="divide-y divide-border">
                {recentScans.map((scan, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0
                      ${scan.type === 'success' ? 'bg-success-50' : 'bg-danger-50'}`}
                    >
                      {scan.type === 'success' ? (
                        <CheckCircle size={14} className="text-success" />
                      ) : (
                        <XCircle size={14} className="text-danger" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-txt-primary truncate">
                        {scan.name || scan.message}
                      </p>
                      <p className="text-xs text-txt-muted">{scan.time}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                      ${scan.type === 'success' ? 'bg-success-50 text-success' : 'bg-danger-50 text-danger'}`}
                    >
                      {scan.type === 'success' ? 'OK' : 'FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon: Icon, label, value, highlight }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-txt-muted" />
      <span className="text-xs text-txt-muted font-medium">{label}</span>
    </div>
    <span className={`text-sm font-semibold ${highlight ? 'text-primary font-mono' : 'text-txt-primary'}`}>
      {value}
    </span>
  </div>
);

export default GuardScanner;
