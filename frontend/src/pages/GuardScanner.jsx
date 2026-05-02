import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanLine, ShieldCheck, AlertTriangle, CheckCircle, XCircle,
  Clock, MapPin, RotateCcw, Zap, Keyboard, Send, User, Car, Home, Camera,
  ShieldAlert, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../apiConfig';

const GuardScanner = () => {
  const { user } = useAuth();
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [scanMode, setScanMode] = useState('qr');
  const [alprScanning, setAlprScanning] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setError(null);
    setScanResult(null);

    try {
      const html5QrCode = new Html5Qrcode("reader");
      const qrData = await html5QrCode.scanFileV2(file, true);
      setIsScanning(false);
      onScanSuccess(qrData.decodedText);
    } catch (err) {
      setError("NO VALID CODE DETECTED");
      setIsScanning(false);
    }
  };

  const resetScanner = () => {
    setIsScanning(false);
    setScanResult(null);
    setError(null);
  };

  const processQR = async (qrData) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/visitors/scan-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ qrData, gateName: 'MAIN-GATE-ALPHA' })
      });

      const data = await res.json();

      if (data.success) {
        const result = { ...data.data, message: data.message, type: 'success', time: new Date().toLocaleTimeString() };
        setScanResult(result);
        setRecentScans(prev => [result, ...prev].slice(0, 5));
        toast.success('ACCESS GRANTED');
      } else {
        const result = { message: data.message, type: 'error', time: new Date().toLocaleTimeString() };
        setScanResult(result);
        setRecentScans(prev => [result, ...prev].slice(0, 5));
        toast.error('ACCESS DENIED');
      }
    } catch (e) {
      setError('OFFLINE MODE ACTIVE');
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
    
    setTimeout(() => {
      setAlprScanning(false);
      const mockResult = {
        name: 'VIP RESIDENT',
        vehicleNumber: 'MH 12 PK 0001',
        flat: 'PENTHOUSE B',
        message: 'VEHICLE REGISTERED: GATE OPENING',
        type: 'success',
        time: new Date().toLocaleTimeString(),
        slotId: 'P-01'
      };
      setScanResult(mockResult);
      setRecentScans(prev => [mockResult, ...prev].slice(0, 5));
      toast.success('ALPR MATCH FOUND');
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[var(--txt-primary)] tracking-tighter uppercase mb-2">
            GUARD<span className="text-[var(--accent)]"> SCANNER</span>
          </h1>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-[var(--accent)]/10 px-3 py-1 rounded-full border border-[var(--accent)]/20">
                <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest">GATE-ALPHA-01 ACTIVE</span>
             </div>
             <p className="text-[10px] font-bold text-[var(--txt-secondary)] uppercase tracking-[0.4em] opacity-60">
               NEURAL VERIFICATION
             </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Scanner Engine */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Mode Selector */}
          <div className="flex p-2 bg-[var(--surface)] border border-[var(--border)] rounded-[24px] shadow-xl">
            <button
              onClick={() => { setScanMode('qr'); resetScanner(); }}
              className={`flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2
                ${scanMode === 'qr' ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'text-[var(--txt-secondary)] hover:bg-[var(--bg)]'}`}
            >
              <ScanLine size={16} /> QR PASS
            </button>
            <button
              onClick={() => { setScanMode('alpr'); resetScanner(); }}
              className={`flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2
                ${scanMode === 'alpr' ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'text-[var(--txt-secondary)] hover:bg-[var(--bg)]'}`}
            >
              <Camera size={16} /> ALPR SCAN
            </button>
          </div>

          {/* Scanner Window */}
          <div className="bg-[var(--surface)] rounded-[32px] border border-[var(--border)] shadow-2xl overflow-hidden relative group">
             <div className="aspect-square relative flex items-center justify-center bg-black">
                {/* Background Grid Layer */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                {scanMode === 'qr' ? (
                  <div className="relative z-10 text-center w-full p-12">
                     {!isScanning && !scanResult && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                           <div className="h-24 w-24 bg-[var(--accent)]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[var(--accent)]/30 accent-glow">
                              <ScanLine size={40} className="text-[var(--accent)]" />
                           </div>
                           <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">Scanner Ready</h3>
                           <p className="text-xs text-white/40 mb-10 max-w-[240px] mx-auto uppercase tracking-tighter leading-relaxed">
                             Position visitor QR pass within the authentication frame
                           </p>
                           <label className="h-16 px-10 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto cursor-pointer w-fit">
                              <Zap size={16} /> Upload Image
                              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                           </label>
                        </motion.div>
                     )}

                     {/* Hidden reader div */}
                     <div id="reader" style={{ display: 'none' }}></div>

                     {/* Scanning Animation */}
                     {isScanning && (
                        <div className="absolute inset-12 pointer-events-none">
                           <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[var(--accent)] rounded-tl-2xl shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]" />
                           <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[var(--accent)] rounded-tr-2xl" />
                           <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[var(--accent)] rounded-bl-2xl" />
                           <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[var(--accent)] rounded-br-2xl" />
                           
                           <motion.div 
                             animate={{ top: ['10%', '90%', '10%'] }} 
                             transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                             className="absolute left-0 right-0 h-1 bg-[var(--accent)]/50 shadow-[0_0_20px_rgba(var(--accent-rgb),1)] z-20" 
                           />
                        </div>
                     )}

                     {loading && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-30">
                           <Activity size={48} className="text-[var(--accent)] animate-pulse mb-6" />
                           <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Verifying Data...</p>
                        </div>
                     )}
                  </div>
                ) : (
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">
                     <div className="absolute inset-0 opacity-40 bg-gradient-to-t from-black to-transparent" />
                     <div className="relative z-20 text-center">
                        <div className="h-24 w-24 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/10 backdrop-blur-xl">
                           <Camera size={40} className="text-white" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">Neural ALPR</h3>
                        <p className="text-xs text-white/30 mb-10 max-w-[240px] mx-auto uppercase tracking-tighter">
                          Autonomous License Plate Recognition Engine
                        </p>
                        
                        <button
                          onClick={simulateALPR}
                          disabled={alprScanning}
                          className="h-16 px-10 bg-[var(--accent)] text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto w-full max-w-[240px] disabled:opacity-50"
                        >
                          {alprScanning ? 'System Scanning...' : 'Simulate Arrival'}
                        </button>
                     </div>

                     {alprScanning && (
                        <div className="absolute inset-0 z-10 pointer-events-none">
                           <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--accent)] shadow-[0_0_30px_rgba(var(--accent-rgb),1)] animate-pulse" />
                           <div className="absolute inset-0 bg-[var(--accent)]/5 animate-pulse" />
                        </div>
                     )}
                  </div>
                )}
             </div>
          </div>

          {/* Manual Console */}
          <div className="bg-[var(--surface)] rounded-[24px] border border-[var(--border)] p-6 shadow-xl">
             <button onClick={() => setShowManual(!showManual)} className="flex items-center gap-3 w-full group">
                <div className="h-10 w-10 bg-[var(--bg)] rounded-xl flex items-center justify-center border border-[var(--border)] group-hover:border-[var(--accent)]/40 transition-all">
                   <Keyboard size={18} className="text-[var(--txt-secondary)]" />
                </div>
                <div className="text-left flex-1">
                   <p className="text-[10px] font-black text-[var(--txt-primary)] uppercase tracking-widest">Manual Command Console</p>
                   <p className="text-[9px] text-[var(--txt-secondary)] opacity-50 uppercase">Direct code entry</p>
                </div>
                <XCircle size={16} className={`text-[var(--txt-secondary)] transition-all ${showManual ? 'rotate-0' : 'rotate-45 opacity-0'}`} />
             </button>

             <AnimatePresence>
                {showManual && (
                  <motion.form
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    onSubmit={handleManualSubmit}
                    className="flex gap-3"
                  >
                     <input
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        placeholder="ENTER AUTH CODE..."
                        className="flex-1 h-14 bg-[var(--bg)] border border-[var(--border)] rounded-2xl px-6 text-xs font-mono uppercase tracking-widest outline-none focus:border-[var(--accent)] transition-all"
                     />
                     <button type="submit" className="h-14 px-8 bg-slate-900 text-white dark:bg-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                        VERIFY
                     </button>
                  </motion.form>
                )}
             </AnimatePresence>
          </div>
        </div>

        {/* Intelligence / Result Panel */}
        <div className="lg:col-span-5 space-y-6 sticky top-8">
           <AnimatePresence mode="wait">
             {scanResult ? (
               <motion.div
                 key={scanResult.time}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className={`bg-[var(--surface)] rounded-[32px] border-2 p-8 shadow-2xl relative overflow-hidden
                   ${scanResult.type === 'success' ? 'border-success/30' : 'border-danger/30'}`}
               >
                  <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.05] -mr-8 -mt-8 rounded-full blur-3xl 
                    ${scanResult.type === 'success' ? 'bg-success' : 'bg-danger'}`} />

                  <div className="text-center mb-8">
                     <div className={`h-20 w-20 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-xl
                        ${scanResult.type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}`}
                     >
                        {scanResult.type === 'success' ? <ShieldCheck size={40} /> : <ShieldAlert size={40} />}
                     </div>
                     <h2 className={`text-2xl font-black uppercase tracking-tighter ${scanResult.type === 'success' ? 'text-success' : 'text-danger'}`}>
                        {scanResult.type === 'success' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                     </h2>
                     <p className="text-[10px] font-bold text-[var(--txt-secondary)] uppercase tracking-[0.3em] mt-2 opacity-60">
                        {scanResult.message}
                     </p>
                  </div>

                  {scanResult.name && (
                    <div className="bg-[var(--bg)] rounded-[24px] p-6 border border-[var(--border)] space-y-4 mb-8">
                       <ResultRow icon={User} label="AUTHORIZED PERSON" value={scanResult.name} />
                       <ResultRow icon={Car} label="VEHICLE IDENTITY" value={scanResult.vehicleNumber || 'NOT-LISTED'} highlight />
                       <ResultRow icon={Home} label="DESTINATION UNIT" value={scanResult.flat || 'GUEST-AREA'} />
                       <ResultRow icon={Clock} label="VERIFICATION TIME" value={scanResult.time} />
                    </div>
                  )}

                  <button onClick={resetScanner} className="w-full h-16 bg-[var(--bg)] border border-[var(--border)] rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[var(--surface)] transition-all group">
                     <RotateCcw size={16} className="group-hover:rotate-180 transition-all duration-500" />
                     INITIALIZE NEXT SCAN
                  </button>
               </motion.div>
             ) : (
               <div className="bg-[var(--surface)] rounded-[32px] border-2 border-dashed border-[var(--border)] p-12 text-center opacity-40">
                  <Activity size={40} className="text-[var(--txt-secondary)] mx-auto mb-6" />
                  <h3 className="text-sm font-black text-[var(--txt-primary)] uppercase tracking-widest mb-2">AWAITING SCAN</h3>
                  <p className="text-[10px] text-[var(--txt-secondary)] uppercase tracking-tighter leading-relaxed">System standby: Waiting for input from gate sensors</p>
               </div>
             )}
           </AnimatePresence>

           {/* Performance Log */}
           {recentScans.length > 0 && (
             <div className="bg-[var(--surface)] rounded-[32px] border border-[var(--border)] overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                   <h3 className="text-[10px] font-black text-[var(--txt-primary)] uppercase tracking-widest">Recent Activity</h3>
                   <span className="text-[8px] font-bold bg-[var(--bg)] px-2 py-1 rounded border border-[var(--border)]">LOG_012</span>
                </div>
                <div className="divide-y divide-[var(--border)]">
                   {recentScans.map((scan, i) => (
                     <div key={i} className="p-4 flex items-center gap-4 hover:bg-[var(--bg)] transition-all">
                        <div className={`h-2 w-2 rounded-full ${scan.type === 'success' ? 'bg-success' : 'bg-danger'} shadow-lg`} />
                        <div className="flex-1">
                           <p className="text-[11px] font-black text-[var(--txt-primary)] uppercase tracking-tight truncate">{scan.name || 'ANONYMOUS'}</p>
                           <p className="text-[9px] text-[var(--txt-secondary)] opacity-50">{scan.time}</p>
                        </div>
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full border
                          ${scan.type === 'success' ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
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

const ResultRow = ({ icon: Icon, label, value, highlight }) => (
  <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/50 last:border-0">
    <div className="flex items-center gap-3">
      <Icon size={14} className="text-[var(--txt-secondary)] opacity-40" />
      <span className="text-[9px] font-black text-[var(--txt-secondary)] uppercase tracking-widest">{label}</span>
    </div>
    <span className={`text-sm font-black uppercase tracking-tight ${highlight ? 'text-[var(--accent)]' : 'text-[var(--txt-primary)]'}`}>
      {value}
    </span>
  </div>
);

export default GuardScanner;
