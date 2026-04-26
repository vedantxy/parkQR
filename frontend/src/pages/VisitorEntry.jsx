import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  UserPlus, Phone, Car, Home, Clock, Star, Send,
  QrCode, Printer, Timer, CheckCircle, AlertCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

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
  const canvasRef = useRef(null);

  // Countdown timer
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
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) errs.phone = 'Valid 10-digit phone required';
    if (!form.vehicle.trim()) errs.vehicle = 'Vehicle number is required';
    if (!form.flat.trim()) errs.flat = 'Flat number is required';
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
      const res = await fetch('http://localhost:5000/api/visitors/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          vehicleNumber: form.vehicle.trim().toUpperCase(),
          flatNumber: form.flat.trim().toUpperCase(),
          duration: parseInt(form.duration),
          priority: form.priority ? 'vip' : 'normal',
        })
      });

      const data = await res.json();

      if (data.success) {
        const qrPayload = JSON.stringify({
          id: data.data?._id || data.data?.id,
          name: form.name,
          vehicle: form.vehicle.toUpperCase(),
          flat: form.flat.toUpperCase(),
          ts: Date.now()
        });

        const qrImg = await QRCode.toDataURL(qrPayload, {
          width: 280,
          margin: 2,
          color: { dark: '#0F172A', light: '#FFFFFF' }
        });

        setQrImage(qrImg);
        setQrData({
          name: form.name,
          vehicle: form.vehicle.toUpperCase(),
          flat: form.flat.toUpperCase(),
          duration: form.duration,
          priority: form.priority,
        });
        setCountdown(parseInt(form.duration) * 60);
        toast.success('Visitor registered successfully!');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Visitor Pass - ${qrData?.name}</title></head>
        <body style="font-family:Inter,sans-serif;text-align:center;padding:40px">
          <h2>ParkSmart AI - Visitor Pass</h2>
          <img src="${qrImage}" style="width:200px;height:200px;margin:20px"/>
          <p><strong>${qrData?.name}</strong></p>
          <p>Vehicle: ${qrData?.vehicle}</p>
          <p>Flat: ${qrData?.flat}</p>
          <p>Duration: ${qrData?.duration} min</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-txt-primary">Visitor Entry</h1>
        <p className="text-sm text-txt-secondary mt-0.5">Register visitors and generate QR passes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form - 60% */}
        <div className="lg:col-span-3 bg-white rounded-card border border-border shadow-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-primary-50 rounded-card flex items-center justify-center">
              <UserPlus size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-txt-primary">Registration Form</h2>
              <p className="text-xs text-txt-muted">Fill in visitor details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                icon={UserPlus} label="Full Name" placeholder="Rahul Sharma"
                value={form.name} onChange={(v) => handleChange('name', v)} error={errors.name}
              />
              <FormField
                icon={Phone} label="Phone Number" placeholder="9876543210" type="tel"
                value={form.phone} onChange={(v) => handleChange('phone', v)} error={errors.phone}
              />
              <FormField
                icon={Car} label="Vehicle Number" placeholder="MH 02 AB 1234"
                value={form.vehicle} onChange={(v) => handleChange('vehicle', v)} error={errors.vehicle}
              />
              <FormField
                icon={Home} label="Flat Number" placeholder="A-401"
                value={form.flat} onChange={(v) => handleChange('flat', v)} error={errors.flat}
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-1.5">
                <Clock size={14} className="inline mr-1.5" />
                Expected Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['30', '60', '120', '240'].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleChange('duration', d)}
                    className={`py-2 rounded-btn text-sm font-medium border transition-all duration-200
                      ${form.duration === d
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-txt-secondary border-border hover:border-primary-300 hover:text-primary'
                      }`}
                  >
                    {d >= 60 ? `${d / 60}h` : `${d}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* VIP Toggle */}
            <div className="flex items-center justify-between bg-surface rounded-btn p-4 border border-border">
              <div className="flex items-center gap-3">
                <Star size={18} className={form.priority ? 'text-warning fill-warning' : 'text-txt-muted'} />
                <div>
                  <p className="text-sm font-medium text-txt-primary">VIP Priority</p>
                  <p className="text-xs text-txt-muted">Assign a premium parking spot</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleChange('priority', !form.priority)}
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative
                  ${form.priority ? 'bg-primary' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 h-5 w-5 bg-white rounded-full shadow-sm transition-transform duration-200
                  ${form.priority ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
                />
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary-600 text-white font-semibold rounded-btn transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} />
                  Register & Generate QR
                </>
              )}
            </button>
          </form>
        </div>

        {/* QR Preview - 40% */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {qrData ? (
              <motion.div
                key="qr-result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-card border border-border shadow-card p-6 text-center sticky top-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success" />
                    <span className="text-sm font-semibold text-success">Pass Generated</span>
                  </div>
                  <button onClick={resetForm} className="p-1.5 hover:bg-surface rounded-btn transition-colors">
                    <X size={16} className="text-txt-muted" />
                  </button>
                </div>

                {/* QR Code */}
                <div className="bg-surface rounded-card p-6 mb-4">
                  <img src={qrImage} alt="QR Code" className="w-56 h-56 mx-auto" />
                </div>

                {/* Visitor Info */}
                <div className="space-y-2.5 text-left mb-4">
                  <InfoRow label="Visitor" value={qrData.name} />
                  <InfoRow label="Vehicle" value={qrData.vehicle} highlight />
                  <InfoRow label="Flat" value={qrData.flat} />
                  <InfoRow label="Duration" value={`${qrData.duration} min`} />
                  {qrData.priority && (
                    <div className="flex items-center gap-1.5 text-warning">
                      <Star size={14} className="fill-warning" />
                      <span className="text-xs font-semibold">VIP Priority Pass</span>
                    </div>
                  )}
                </div>

                {/* Countdown */}
                {countdown !== null && (
                  <div className="bg-surface rounded-btn p-3 mb-4 flex items-center justify-center gap-2">
                    <Timer size={16} className={countdown < 300 ? 'text-danger' : 'text-primary'} />
                    <span className={`text-lg font-bold font-mono ${countdown < 300 ? 'text-danger' : 'text-primary'}`}>
                      {formatTime(countdown)}
                    </span>
                    <span className="text-xs text-txt-muted ml-1">remaining</span>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handlePrint}
                    className="py-2.5 border border-border rounded-btn text-sm font-medium text-txt-secondary hover:bg-surface transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Printer size={14} /> Print
                  </button>
                  <button
                    onClick={resetForm}
                    className="py-2.5 bg-primary text-white rounded-btn text-sm font-medium hover:bg-primary-600 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <UserPlus size={14} /> New Entry
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="qr-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-card border-2 border-dashed border-border p-10 text-center sticky top-6"
              >
                <div className="h-16 w-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <QrCode size={28} className="text-txt-muted" />
                </div>
                <h3 className="font-semibold text-txt-primary mb-1">QR Pass Preview</h3>
                <p className="text-sm text-txt-muted">Fill the form and submit to generate a visitor pass with QR code</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const FormField = ({ icon: Icon, label, placeholder, value, onChange, error, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-txt-secondary mb-1.5">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-muted" size={16} />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-11 bg-surface border rounded-btn pl-10 pr-4 text-sm text-txt-primary placeholder:text-txt-muted outline-none transition-all duration-200
          ${error ? 'border-danger focus:ring-2 focus:ring-danger/20' : 'border-border focus:ring-2 focus:ring-primary-200 focus:border-primary'}`}
      />
    </div>
    {error && (
      <p className="text-xs text-danger mt-1 flex items-center gap-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

const InfoRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
    <span className="text-xs text-txt-muted font-medium">{label}</span>
    <span className={`text-sm font-semibold ${highlight ? 'text-primary font-mono' : 'text-txt-primary'}`}>{value}</span>
  </div>
);

export default VisitorEntry;
