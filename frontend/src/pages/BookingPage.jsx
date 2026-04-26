import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Clock, MapPin, Zap, ChevronRight, Calendar, CreditCard, QrCode, CheckCircle, AlertCircle, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listenToAvailableSlots, createBooking, calculatePrice, listenToUserBookings, cancelBooking } from '../services/bookingService';
import { seedParkingSlots } from '../utils/seedSlots';
import QRCode from 'qrcode';

const DURATIONS = [
  { label: '30 min', minutes: 30, icon: '⚡' },
  { label: '1 hour', minutes: 60, icon: '🕐' },
  { label: '2 hours', minutes: 120, icon: '🕑' },
  { label: '4 hours', minutes: 240, icon: '🕓' },
  { label: 'Full Day', minutes: 480, icon: '☀️' },
];

const BookingPage = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1=slot, 2=details, 3=confirm
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [duration, setDuration] = useState(60);
  const [vehicle, setVehicle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [filter, setFilter] = useState('all');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const unsub1 = listenToAvailableSlots((data) => { setSlots(data); setLoading(false); });
    const unsub2 = listenToUserBookings(user.uid, setBookings);
    return () => { unsub1(); unsub2(); };
  }, [user.uid]);

  const freeSlots = slots.filter(s => !s.isOccupied);
  const filteredSlots = filter === 'all' ? slots : filter === 'free' ? freeSlots : slots.filter(s => s.slotType === filter);
  const price = calculatePrice(duration);
  const activeBookings = bookings.filter(b => b.status === 'active');

  const handleSlotSelect = (slot) => {
    if (slot.isOccupied) return;
    setSelectedSlot(slot);
    setStep(2);
    setError('');
  };

  const handleBook = async () => {
    if (!vehicle.trim()) { setError('Please enter your vehicle number'); return; }
    setSubmitting(true);
    setError('');
    const now = new Date();
    const end = new Date(now.getTime() + duration * 60000);

    const result = await createBooking({
      userId: user.uid, userEmail: user.email, userName: user.name,
      slotId: selectedSlot.slotId, slotDocId: selectedSlot.id,
      vehicleNumber: vehicle, duration, startTime: now, endTime: end, amount: price,
    });

    if (result.success) {
      const qrPayload = JSON.stringify({ bookingId: result.bookingId, slot: selectedSlot.slotId, vehicle: vehicle.toUpperCase(), expires: end.toISOString() });
      const qr = await QRCode.toDataURL(qrPayload, { width: 280, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } });
      setQrDataUrl(qr);
      setBookingResult(result);
      setStep(3);
    } else {
      setError(result.error);
    }
    setSubmitting(false);
  };

  const handleCancel = async (booking) => {
    await cancelBooking(booking.id, booking.slotDocId);
  };

  const resetFlow = () => { setStep(1); setSelectedSlot(null); setVehicle(''); setBookingResult(null); setQrDataUrl(''); setError(''); };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="mt-4 text-xs font-black text-slate-500 uppercase tracking-widest">Loading Slots...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            {step > 1 && <button onClick={resetFlow} className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10"><ArrowLeft size={18} /></button>}
            {step === 1 ? '🅿️ Book a Slot' : step === 2 ? '📝 Booking Details' : '✅ Confirmed'}
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">{step === 1 ? `${freeSlots.length} of ${slots.length} slots available` : step === 2 ? `Slot ${selectedSlot?.slotId} • ${selectedSlot?.slotType}` : `Booking #${bookingResult?.bookingId.slice(-6)}`}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowHistory(!showHistory)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${showHistory ? 'bg-primary text-white' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}>
            <Clock size={16} className="inline mr-2" />My Bookings {activeBookings.length > 0 && <span className="ml-1 bg-primary/20 text-primary px-2 py-0.5 rounded-lg text-xs">{activeBookings.length}</span>}
          </button>
        </div>
      </div>

      {/* Active Bookings Banner */}
      {showHistory && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
          {bookings.length === 0 ? (
            <div className="glass-card rounded-2xl p-6 text-center text-slate-500 text-sm">No bookings yet</div>
          ) : bookings.slice(0, 5).map((b) => (
            <div key={b.id} className="glass-card rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${b.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : b.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-slate-500/10 text-slate-400'}`}>
                  <Car size={18} />
                </div>
                <div>
                  <p className="text-sm font-black">Slot {b.slotId} • {b.vehicleNumber}</p>
                  <p className="text-xs text-slate-500">{b.status === 'active' ? `Expires ${b.endTime?.toDate?.().toLocaleTimeString() || '—'}` : b.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-primary">₹{b.amount}</span>
                {b.status === 'active' && (
                  <button onClick={() => handleCancel(b)} className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1.5 rounded-lg">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* STEP 1: Slot Grid */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {[{ id: 'all', label: 'All Slots' }, { id: 'free', label: 'Available' }, { id: 'VIP', label: 'VIP' }, { id: 'Guest', label: 'Standard' }].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filter === f.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {filteredSlots.map((slot, i) => (
              <motion.button
                key={slot.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => handleSlotSelect(slot)}
                disabled={slot.isOccupied}
                className={`relative p-4 rounded-2xl border-2 transition-all group text-center
                  ${slot.isOccupied
                    ? 'bg-red-500/5 border-red-500/20 cursor-not-allowed opacity-60'
                    : slot.slotType === 'VIP'
                      ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-400 hover:bg-amber-500/10 cursor-pointer'
                      : 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-400 hover:bg-emerald-500/10 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5'
                  }`}
              >
                <Car size={20} className={`mx-auto mb-2 ${slot.isOccupied ? 'text-red-400' : slot.slotType === 'VIP' ? 'text-amber-400' : 'text-emerald-400'}`} />
                <p className="text-sm font-black">{slot.slotId}</p>
                <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${slot.isOccupied ? 'text-red-400' : 'text-slate-500'}`}>
                  {slot.isOccupied ? 'Occupied' : slot.slotType}
                </p>
                {!slot.isOccupied && (
                  <div className="absolute inset-0 rounded-2xl bg-primary/0 group-hover:bg-primary/5 transition-all" />
                )}
              </motion.button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-6 mt-6 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-emerald-500/40" />Available</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-amber-500/40" />VIP</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-red-500/40" />Occupied</span>
          </div>

          {/* Empty State — Seed Button */}
          {slots.length === 0 && (
            <div className="text-center py-16 glass-card rounded-[28px] mt-6">
              <p className="text-slate-400 text-sm font-bold mb-4">No parking slots in database yet</p>
              <button
                onClick={async () => { setLoading(true); await seedParkingSlots(); }}
                className="px-6 py-3 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                🌱 Seed 32 Demo Slots
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* STEP 2: Details */}
      {step === 2 && selectedSlot && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl space-y-6">
          {/* Selected Slot Card */}
          <div className="glass-card rounded-[28px] p-6 flex items-center gap-6">
            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-black ${selectedSlot.slotType === 'VIP' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
              {selectedSlot.slotId}
            </div>
            <div>
              <p className="font-black text-lg">{selectedSlot.slotType} Slot</p>
              <p className="text-slate-500 text-sm flex items-center gap-1"><MapPin size={14} /> Zone {selectedSlot.slotId[0]}</p>
            </div>
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Vehicle Number</label>
            <input
              type="text"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value.toUpperCase())}
              placeholder="MH-12-AB-1234"
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold placeholder:text-slate-600 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none tracking-wider text-lg"
            />
          </div>

          {/* Duration Picker */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Select Duration</label>
            <div className="grid grid-cols-5 gap-3">
              {DURATIONS.map((d) => (
                <button
                  key={d.minutes}
                  onClick={() => setDuration(d.minutes)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all ${duration === d.minutes ? 'bg-primary/10 border-primary text-white shadow-lg shadow-primary/10' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
                >
                  <span className="text-xl block mb-1">{d.icon}</span>
                  <span className="text-xs font-black">{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="glass-card rounded-[28px] p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-400 text-sm font-bold">Duration</span>
              <span className="font-black">{duration >= 60 ? `${duration / 60}h` : `${duration}m`}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-400 text-sm font-bold">Rate</span>
              <span className="font-black">₹30/hr</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="text-white font-black text-lg">Total</span>
              <span className="text-primary font-black text-2xl">₹{price}</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm font-bold">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={submitting}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/30 disabled:opacity-50"
          >
            {submitting ? <div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><CreditCard size={20} /> Confirm Booking — ₹{price}</>}
          </button>
        </motion.div>
      )}

      {/* STEP 3: Confirmation */}
      {step === 3 && bookingResult && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center space-y-6">
          <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/30">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black">Booking Confirmed!</h3>
            <p className="text-slate-500 text-sm mt-1">Your spot is reserved. Show this QR at the gate.</p>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-3xl p-6 inline-block shadow-2xl">
            <img src={qrDataUrl} alt="Booking QR" className="w-56 h-56" />
          </div>

          {/* Details */}
          <div className="glass-card rounded-[28px] p-6 text-left space-y-3">
            <DetailRow label="Booking ID" value={`#${bookingResult.bookingId.slice(-8)}`} />
            <DetailRow label="Slot" value={selectedSlot.slotId} />
            <DetailRow label="Vehicle" value={vehicle.toUpperCase()} />
            <DetailRow label="Duration" value={duration >= 60 ? `${duration / 60} hour(s)` : `${duration} min`} />
            <DetailRow label="Amount" value={`₹${price}`} highlight />
          </div>

          <button onClick={resetFlow} className="w-full h-14 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all">
            Book Another Slot
          </button>
        </motion.div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center">
    <span className="text-slate-500 text-sm font-bold">{label}</span>
    <span className={`font-black ${highlight ? 'text-primary text-lg' : ''}`}>{value}</span>
  </div>
);

export default BookingPage;
