import React, { useState, useEffect } from 'react';
import { listenToAvailableSlots } from '../services/bookingService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ParkingSquare, Car, Clock, AlertTriangle, Filter,
  X, User, Phone, Home, Timer, MapPin, ChevronRight, Activity, Layers, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';
import ParkingMap from '../components/ParkingMap';

const mockSlots = Array.from({ length: 32 }, (_, i) => ({
  id: `slot-${i + 1}`,
  slotId: `P-${String(i + 1).padStart(2, '0')}`,
  type: i < 8 ? 'VIP' : i < 16 ? 'RESIDENT' : 'GUEST',
  floor: i < 16 ? 'GROUND FLOOR' : 'LEVEL 1',
  isOccupied: Math.random() > 0.55,
  isOverstayed: Math.random() > 0.85,
  vehicle: null,
  visitorName: null,
  entryTime: null,
}));

mockSlots.forEach(slot => {
  if (slot.isOccupied) {
    const names = ['Rahul S.', 'Priya P.', 'Amit K.', 'Neha S.', 'Ravi J.', 'Sonia M.', 'Karan T.', 'Meera D.'];
    const vehicles = ['MH 02 AB 1234', 'MH 04 CD 5678', 'MH 01 EF 9012', 'MH 03 GH 3456', 'DL 01 XY 7890', 'KA 05 MN 2345'];
    slot.vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    slot.visitorName = names[Math.floor(Math.random() * names.length)];
    const minutesAgo = Math.floor(Math.random() * 180) + 10;
    slot.entryTime = new Date(Date.now() - minutesAgo * 60000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    slot.minutesParked = minutesAgo;
  }
});

const BookingPage = () => {
  const [slots, setSlots] = useState(mockSlots);
  const [filter, setFilter] = useState('all');
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch(`${API_URL}/parking/slots`, {
          headers: { 'Authorization': `Bearer ${user?.token}` }
        });
        const data = await res.json();
        if (data.success) setSlots(data.data);
      } catch (e) {
        console.warn('Using mock/cache parking data');
      }
    };

    fetchSlots();

    try {
      const unsub = listenToAvailableSlots((firebaseSlots) => {
        if (firebaseSlots.length > 0) setSlots(firebaseSlots);
      });
      return () => unsub && unsub();
    } catch (e) {}
  }, [user?.token]);

  const filteredSlots = slots.filter(slot => {
    if (filter === 'available') return !slot.isOccupied;
    if (filter === 'occupied') return slot.isOccupied && !slot.isOverstayed;
    if (filter === 'overstay') return slot.isOccupied && slot.isOverstayed;
    return true;
  });

  const stats = {
    total: slots.length,
    available: slots.filter(s => !s.isOccupied).length,
    occupied: slots.filter(s => s.isOccupied && !s.isOverstayed).length,
    overstay: slots.filter(s => s.isOccupied && s.isOverstayed).length,
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[var(--txt-primary)] tracking-tighter uppercase mb-2">
            PARKING<span className="text-[var(--accent)]"> CONTROL</span>
          </h1>
          <p className="text-[10px] font-bold text-[var(--txt-secondary)] uppercase tracking-[0.4em] opacity-60">
            Real-time Spatial Monitoring
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-full px-6 py-3 shadow-xl">
           <Activity size={14} className="text-[var(--accent)] animate-pulse" />
           <span className="text-[10px] font-black text-[var(--txt-primary)] uppercase tracking-widest">System Online</span>
        </div>
      </div>

      {/* 🗺️ Premium Map Integration */}
      <div className="bg-[var(--surface)] rounded-[32px] border border-[var(--border)] shadow-2xl p-2 overflow-hidden relative group">
        <div className="absolute top-6 left-6 z-10">
           <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
              <div className="h-10 w-10 bg-[var(--accent)] text-black rounded-xl flex items-center justify-center">
                 <MapPin size={20} />
              </div>
              <div>
                 <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Current Location</p>
                 <p className="text-xs font-black text-white uppercase tracking-tight">Main Sector Alpha-01</p>
              </div>
           </div>
        </div>
        <ParkingMap availableSlots={stats.available} occupiedSlots={stats.occupied} />
      </div>

      {/* Control Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ControlStat label="Total Units" value={stats.total} icon={Layers} color="text-[var(--txt-primary)]" />
        <ControlStat label="Available" value={stats.available} icon={ParkingSquare} color="text-success" />
        <ControlStat label="Occupied" value={stats.occupied} icon={Car} color="text-[var(--accent)]" />
        <ControlStat label="Overstay" value={stats.overstay} icon={AlertTriangle} color="text-danger" />
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-[var(--surface)] p-2 rounded-[24px] border border-[var(--border)] shadow-xl overflow-x-auto">
        {['all', 'available', 'occupied', 'overstay'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap
              ${filter === f 
                ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' 
                : 'text-[var(--txt-secondary)] hover:bg-[var(--bg)]'
              }`}
          >
            {f === 'all' ? 'All Units' : f}
          </button>
        ))}
      </div>

      {/* Spatial Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredSlots.map((slot, i) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            onClick={() => slot.isOccupied && setSelectedSlot(slot)}
            className={`relative rounded-[24px] border-2 p-5 transition-all cursor-pointer group overflow-hidden
              ${slot.isOccupied && slot.isOverstayed
                ? 'bg-danger/5 border-danger/20 hover:border-danger'
                : slot.isOccupied
                  ? 'bg-[var(--accent)]/5 border-[var(--accent)]/20 hover:border-[var(--accent)]'
                  : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--accent)]/40 shadow-sm hover:shadow-xl'
              }`}
          >
            {slot.isOverstayed && (
              <div className="absolute top-0 right-0 h-1.5 w-full bg-danger animate-pulse" />
            )}

            <div className="flex items-center justify-between mb-6">
              <span className={`text-xs font-black tracking-widest ${
                slot.isOverstayed ? 'text-danger' : slot.isOccupied ? 'text-[var(--accent)]' : 'text-[var(--txt-secondary)]'
              }`}>
                {slot.slotId}
              </span>
              <div className="h-6 px-2 bg-[var(--bg)] rounded-md border border-[var(--border)] flex items-center">
                 <span className="text-[8px] font-black text-[var(--txt-secondary)] opacity-60 uppercase">{slot.type}</span>
              </div>
            </div>

            {slot.isOccupied ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                   <Car size={12} className="text-[var(--txt-secondary)] opacity-40" />
                   <p className="text-[10px] font-black text-[var(--txt-primary)] uppercase tracking-tight truncate">{slot.vehicle}</p>
                </div>
                <div className="flex items-center gap-2">
                   <Clock size={12} className="text-[var(--txt-secondary)] opacity-40" />
                   <p className="text-[10px] font-bold text-[var(--txt-secondary)] uppercase tracking-widest">{slot.entryTime}</p>
                </div>
              </div>
            ) : (
              <div className="h-10 flex items-center gap-3 text-success opacity-40 group-hover:opacity-100 transition-all">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Ready</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Spatial Detail Overlay */}
      <AnimatePresence>
        {selectedSlot && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedSlot(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--surface)] shadow-2xl z-[101] flex flex-col border-l border-[var(--border)]"
            >
              <div className="p-8 border-b border-[var(--border)] flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black text-[var(--txt-primary)] uppercase tracking-tight">Unit Analytics</h3>
                   <p className="text-[10px] font-bold text-[var(--txt-secondary)] uppercase tracking-[0.2em]">Spatial ID: {selectedSlot.slotId}</p>
                </div>
                <button onClick={() => setSelectedSlot(null)} className="h-12 w-12 bg-[var(--bg)] rounded-2xl flex items-center justify-center border border-[var(--border)] hover:bg-danger/10 hover:text-danger transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className={`rounded-[32px] p-8 text-center relative overflow-hidden ${
                  selectedSlot.isOverstayed ? 'bg-danger/10' : 'bg-[var(--accent)]/10'
                }`}>
                   <div className="relative z-10">
                      <span className={`text-6xl font-black tracking-tighter ${
                        selectedSlot.isOverstayed ? 'text-danger' : 'text-[var(--accent)]'
                      }`}>
                        {selectedSlot.slotId}
                      </span>
                      <p className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.4em] mt-4">
                        {selectedSlot.floor} · {selectedSlot.type} ZONE
                      </p>
                   </div>
                </div>

                <div className="space-y-6">
                  <DrawerRow icon={User} label="Authorized Entity" value={selectedSlot.visitorName || 'SYSTEM_GUEST'} />
                  <DrawerRow icon={Car} label="Vehicle Signature" value={selectedSlot.vehicle} highlight />
                  <DrawerRow icon={Clock} label="Authorization Start" value={selectedSlot.entryTime} />
                  <DrawerRow icon={Timer} label="Active Session" value={`${selectedSlot.minutesParked || 0} MINUTES`} />
                  <DrawerRow icon={MapPin} label="Spatial Zone" value={`${selectedSlot.floor}, ${selectedSlot.type}`} />
                </div>

                {selectedSlot.isOverstayed && (
                  <div className="bg-danger/10 border border-danger/20 rounded-[24px] p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle size={20} className="text-danger" />
                      <span className="text-sm font-black text-danger uppercase tracking-widest">Protocol Breach</span>
                    </div>
                    <p className="text-[10px] text-danger/70 leading-relaxed uppercase tracking-tighter font-bold">The entity has exceeded the allocated spatial duration. Immediate notification required.</p>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-[var(--border)]">
                <button onClick={() => setSelectedSlot(null)} className="w-full h-16 bg-slate-900 text-white dark:bg-white dark:text-black rounded-[24px] font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:scale-105 transition-all">
                  Terminate View
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const ControlStat = ({ label, value, icon: Icon, color }) => (
  <div className="bg-[var(--surface)] rounded-[24px] border border-[var(--border)] p-6 shadow-xl flex items-center gap-6 group hover:border-[var(--accent)]/30 transition-all">
    <div className={`h-12 w-12 bg-[var(--bg)] rounded-2xl flex items-center justify-center border border-[var(--border)] accent-glow`}>
       <Icon size={20} className={color} />
    </div>
    <div>
      <p className="text-2xl font-black text-[var(--txt-primary)] tracking-tight">{value}</p>
      <p className="text-[9px] font-black text-[var(--txt-secondary)] uppercase tracking-widest opacity-60">{label}</p>
    </div>
  </div>
);

const DrawerRow = ({ icon: Icon, label, value, highlight }) => (
  <div className="flex items-center justify-between py-4 border-b border-[var(--border)] last:border-0">
    <div className="flex items-center gap-4">
      <Icon size={16} className="text-[var(--txt-secondary)] opacity-40" />
      <span className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-widest">{label}</span>
    </div>
    <span className={`text-sm font-black uppercase tracking-tight ${highlight ? 'text-[var(--accent)]' : 'text-[var(--txt-primary)]'}`}>
      {value}
    </span>
  </div>
);

export default BookingPage;
