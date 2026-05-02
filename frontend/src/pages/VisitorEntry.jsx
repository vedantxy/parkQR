import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  UserPlus, Phone, Car, Home, Clock, Star, Send,
  QrCode, Printer, Timer, CheckCircle, AlertCircle, X, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import API_URL from '../apiConfig';

const VisitorEntry = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '', phone: '', vehicle: '', flat: '', duration: '60', priority: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [qrImage, setQrImage] = useState('');
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (!countdown) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [qrData]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) errs.phone = 'Valid 10-digit number required';
    if (!form.vehicle.trim()) errs.vehicle = 'Vehicle number required';
    if (!form.flat.trim()) errs.flat = 'Flat is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/visitors/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          vehicle: form.vehicle.trim().toUpperCase(),
          flatNumber: form.flat.trim().toUpperCase(),
          duration: parseInt(form.duration),
          isPriority: form.priority,
        })
      });

      const data = await res.json();

      if (data.success) {
        setQrImage(data.qrCode);
        setQrData({
          name: form.name,
          vehicle: form.vehicle.toUpperCase(),
          flat: form.flat.toUpperCase(),
          duration: form.duration,
          priority: form.priority,
        });
        setCountdown(parseInt(form.duration) * 60);
        toast.success('Visitor pass generated!');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error('Backend connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Pass - ${qrData?.name}</title></head>
        <body style="font-family:Inter,sans-serif;text-align:center;padding:40px">
          <h2>PARKORA AI PASS</h2>
          <img src="${qrImage}" style="width:200px;height:200px;margin:20px"/>
          <p><strong>${qrData?.name}</strong></p>
          <p>Vehicle: ${qrData?.vehicle}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const resetForm = () => {
    setForm({ name: '', phone: '', vehicle: '', flat: '', duration: '60', priority: false });
    setQrData(null);
    setQrImage('');
    setCountdown(null);
    setErrors({});
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent)] opacity-[0.03] blur-[150px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[var(--txt-primary)] tracking-tighter uppercase mb-2">
            VISITOR<span className="text-[var(--accent)]"> ENTRY</span>
          </h1>
          <p className="text-[10px] font-bold text-[var(--txt-secondary)] uppercase tracking-[0.4em] opacity-60">
            Neural Registration System 2.0
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Registration Form */}
        <div className="lg:col-span-7 bg-[var(--surface)] rounded-[32px] border border-[var(--border)] p-8 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)] opacity-20" />
           
           <div className="flex items-center gap-4 mb-8">
             <div className="h-12 w-12 bg-[var(--bg)] rounded-2xl flex items-center justify-center border border-[var(--border)] accent-glow">
                <UserPlus size={20} className="text-[var(--accent)]" />
             </div>
             <div>
               <h2 className="text-lg font-black text-[var(--txt-primary)] uppercase tracking-tight">Visitor Details</h2>
               <p className="text-xs text-[var(--txt-secondary)] opacity-60">Complete the authentication profile</p>
             </div>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField 
                  icon={UserPlus} label="FULL NAME" placeholder="e.g. John Doe"
                  value={form.name} onChange={(v) => handleChange('name', v)} error={errors.name}
                />
                <FormField 
                  icon={Phone} label="PHONE NUMBER" placeholder="e.g. 9876543210" type="tel"
                  value={form.phone} onChange={(v) => handleChange('phone', v)} error={errors.phone}
                />
                <FormField 
                  icon={Car} label="VEHICLE NUMBER" placeholder="e.g. MH 02 AB 1234"
                  value={form.vehicle} onChange={(v) => handleChange('vehicle', v)} error={errors.vehicle}
                />
                <FormField 
                  icon={Home} label="TARGET UNIT" placeholder="e.g. A-401"
                  value={form.flat} onChange={(v) => handleChange('flat', v)} error={errors.flat}
                />
             </div>

             {/* Duration Selector */}
             <div className="space-y-4">
                <label className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-widest block">
                  Parking Duration
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {['30', '60', '120', '240'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleChange('duration', d)}
                      className={`h-14 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
                        ${form.duration === d 
                          ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' 
                          : 'bg-[var(--bg)] text-[var(--txt-secondary)] border border-[var(--border)] hover:border-[var(--accent)]/30'
                        }`}
                    >
                      {d >= 60 ? `${d / 60}H` : `${d}M`}
                    </button>
                  ))}
                </div>
             </div>

             {/* VIP Priority Toggle */}
             <div className="bg-[var(--bg)] rounded-[24px] p-6 border border-[var(--border)] flex items-center justify-between group/vip cursor-pointer hover:border-[var(--accent)]/30 transition-all" onClick={() => handleChange('priority', !form.priority)}>
                <div className="flex items-center gap-4">
                   <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${form.priority ? 'bg-[var(--accent)]/20' : 'bg-[var(--surface)] opacity-40'}`}>
                      <Star size={18} className={form.priority ? 'text-[var(--accent)] fill-[var(--accent)]' : 'text-[var(--txt-secondary)]'} />
                   </div>
                   <div>
                     <p className="text-sm font-black text-[var(--txt-primary)] uppercase tracking-tight">VIP Priority Pass</p>
                     <p className="text-[10px] text-[var(--txt-secondary)] opacity-60">Reserved premium parking bay</p>
                   </div>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-all ${form.priority ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}>
                   <div className={`h-4 w-4 bg-white rounded-full transition-all ${form.priority ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
             </div>

             <button
               type="submit"
               disabled={loading}
               className="w-full h-16 bg-slate-900 text-white dark:bg-white dark:text-black rounded-[24px] font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
             >
               {loading ? (
                 <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
               ) : (
                 <>
                   <ShieldCheck size={18} />
                   Authorize Entry
                 </>
               )}
             </button>
           </form>
        </div>

        {/* QR Preview / Result */}
        <div className="lg:col-span-5 sticky top-8">
           <AnimatePresence mode="wait">
             {qrData ? (
               <motion.div
                 key="result"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="bg-[var(--surface)] rounded-[32px] border border-[var(--border)] p-8 shadow-2xl text-center relative"
               >
                  <div className="absolute -top-3 -right-3 h-10 w-10 bg-success text-white rounded-full flex items-center justify-center shadow-lg">
                     <CheckCircle size={20} />
                  </div>

                  <h3 className="text-xs font-black text-[var(--txt-secondary)] uppercase tracking-[0.3em] mb-8">Access Pass Generated</h3>
                  
                  <div className="bg-white p-6 rounded-[24px] mb-8 inline-block shadow-inner">
                     <img src={qrImage} alt="QR Code" className="w-48 h-48" />
                  </div>

                  <div className="space-y-4 text-left mb-8">
                     <ResultRow label="VISITOR" value={qrData.name} />
                     <ResultRow label="VEHICLE" value={qrData.vehicle} highlight />
                     <ResultRow label="UNIT" value={qrData.flat} />
                     <ResultRow label="VALIDITY" value={`${qrData.duration} MINUTES`} />
                  </div>

                  {countdown !== null && (
                    <div className="bg-[var(--bg)] rounded-[20px] p-4 border border-[var(--border)] flex items-center justify-between mb-8">
                       <p className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-widest">Expires In</p>
                       <span className={`text-xl font-mono font-black ${countdown < 300 ? 'text-danger' : 'text-[var(--accent)]'}`}>
                         {formatTime(countdown)}
                       </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                     <button onClick={handlePrint} className="h-14 bg-[var(--bg)] border border-[var(--border)] rounded-[20px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--surface)] transition-all">
                        <Printer size={16} /> Print Pass
                     </button>
                     <button onClick={resetForm} className="h-14 bg-[var(--accent)] text-black rounded-[20px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all">
                        <UserPlus size={16} /> New Entry
                     </button>
                  </div>
               </motion.div>
             ) : (
               <div className="bg-[var(--surface)] rounded-[32px] border-2 border-dashed border-[var(--border)] p-12 text-center opacity-40">
                  <div className="h-20 w-20 bg-[var(--bg)] rounded-[24px] flex items-center justify-center mx-auto mb-6">
                     <QrCode size={32} className="text-[var(--txt-secondary)]" />
                  </div>
                  <h3 className="text-sm font-black text-[var(--txt-primary)] uppercase tracking-widest mb-2">System Waiting</h3>
                  <p className="text-xs text-[var(--txt-secondary)] max-w-[200px] mx-auto leading-relaxed">Fill the authentication profile to generate access pass</p>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const FormField = ({ icon: Icon, label, placeholder, value, onChange, error, type = 'text' }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--txt-secondary)] opacity-40" size={16} />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-14 bg-[var(--bg)] border rounded-[20px] pl-12 pr-4 text-sm text-[var(--txt-primary)] placeholder:opacity-30 outline-none transition-all
          ${error ? 'border-danger focus:ring-2 focus:ring-danger/10' : 'border-[var(--border)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10'}`}
      />
    </div>
    {error && <p className="text-[9px] font-bold text-danger uppercase tracking-widest ml-1">{error}</p>}
  </div>
);

const ResultRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0">
    <span className="text-[9px] font-black text-[var(--txt-secondary)] uppercase tracking-widest opacity-60">{label}</span>
    <span className={`text-sm font-black uppercase tracking-tight ${highlight ? 'text-[var(--accent)]' : 'text-[var(--txt-primary)]'}`}>{value}</span>
  </div>
);

export default VisitorEntry;
