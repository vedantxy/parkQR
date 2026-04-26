import React, { useState, useEffect } from 'react';
import { listenToAvailableSlots } from '../services/bookingService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ParkingSquare, Car, Clock, AlertTriangle, Filter,
  X, User, Phone, Home, Timer, MapPin, ChevronRight
} from 'lucide-react';
import ParkingMap from '../components/ParkingMap';

const mockSlots = Array.from({ length: 32 }, (_, i) => ({
  id: `slot-${i + 1}`,
  slotId: `P-${String(i + 1).padStart(2, '0')}`,
  type: i < 8 ? 'A' : i < 16 ? 'B' : i < 24 ? 'C' : 'D',
  floor: i < 16 ? 'Ground' : 'Level 1',
  isOccupied: Math.random() > 0.55,
  isOverstayed: Math.random() > 0.85,
  vehicle: null,
  visitorName: null,
  entryTime: null,
}));

// Add realistic data to occupied slots
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
    try {
      const unsub = listenToAvailableSlots((firebaseSlots) => {
        if (firebaseSlots.length > 0) setSlots(firebaseSlots);
      });
      return () => unsub && unsub();
    } catch (e) {
      console.warn('Using mock parking data');
    }
  }, []);

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

  const filters = [
    { id: 'all', label: 'All Slots', count: stats.total },
    { id: 'available', label: 'Available', count: stats.available, color: 'text-success' },
    { id: 'occupied', label: 'Occupied', count: stats.occupied, color: 'text-primary' },
    { id: 'overstay', label: 'Overstayed', count: stats.overstay, color: 'text-danger' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">Parking Map</h1>
          <p className="text-sm text-txt-secondary mt-0.5">Real-time parking slot overview</p>
        </div>
      </div>

      {/* 🗺️ Live Parking Map Integration */}
      <div className="bg-white rounded-card border border-border shadow-card p-4">
        <ParkingMap 
          availableSlots={stats.available} 
          occupiedSlots={stats.occupied} 
        />
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatPill label="Total" value={stats.total} icon={ParkingSquare} color="bg-surface text-txt-primary" />
        <StatPill label="Available" value={stats.available} icon={ParkingSquare} color="bg-success-50 text-success" />
        <StatPill label="Occupied" value={stats.occupied} icon={Car} color="bg-primary-50 text-primary" />
        <StatPill label="Overstayed" value={stats.overstay} icon={AlertTriangle} color="bg-danger-50 text-danger" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-card border border-border shadow-card p-3 flex items-center gap-2 overflow-x-auto">
        <Filter size={16} className="text-txt-muted flex-shrink-0 ml-1" />
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-btn text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2
              ${filter === f.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-txt-secondary hover:bg-surface-hover'
              }`}
          >
            {f.label}
            <span className={`text-xs font-bold ${filter === f.id ? 'text-white/70' : 'text-txt-muted'}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Slot Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredSlots.map((slot, i) => (
          <motion.div
            key={slot.id || i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => slot.isOccupied && setSelectedSlot(slot)}
            className={`relative rounded-card border-2 p-4 transition-all duration-200 cursor-pointer
              ${slot.isOccupied && slot.isOverstayed
                ? 'bg-danger-50 border-danger/30 hover:border-danger hover:shadow-md'
                : slot.isOccupied
                  ? 'bg-primary-50 border-primary/20 hover:border-primary hover:shadow-md'
                  : 'bg-white border-border hover:border-success/50 hover:shadow-card-hover'
              }`}
          >
            {/* Overstay pulse */}
            {slot.isOverstayed && (
              <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-danger rounded-full animate-pulse" />
            )}

            <div className="flex items-center justify-between mb-2">
              <span className={`text-lg font-bold ${
                slot.isOverstayed ? 'text-danger' : slot.isOccupied ? 'text-primary' : 'text-txt-primary'
              }`}>
                {slot.slotId}
              </span>
              <span className="text-[10px] font-medium text-txt-muted bg-white/50 px-1.5 py-0.5 rounded">
                {slot.type}
              </span>
            </div>

            {slot.isOccupied ? (
              <div className="space-y-1.5">
                <p className="text-xs font-mono font-semibold text-txt-primary truncate">{slot.vehicle}</p>
                <div className="flex items-center gap-1 text-xs text-txt-muted">
                  <Clock size={10} />
                  <span>{slot.entryTime}</span>
                </div>
                {slot.isOverstayed && (
                  <div className="flex items-center gap-1 text-xs text-danger font-semibold">
                    <AlertTriangle size={10} />
                    <span>Overstayed</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-success">
                <ParkingSquare size={14} />
                <span className="text-xs font-semibold">Available</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Side Drawer for Slot Details */}
      <AnimatePresence>
        {selectedSlot && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSlot(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-modal z-50 flex flex-col"
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-txt-primary text-lg">Slot Details</h3>
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="p-2 hover:bg-surface rounded-btn transition-colors"
                >
                  <X size={18} className="text-txt-muted" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Slot Badge */}
                <div className={`rounded-card p-5 text-center ${
                  selectedSlot.isOverstayed ? 'bg-danger-50' : 'bg-primary-50'
                }`}>
                  <span className={`text-3xl font-bold ${
                    selectedSlot.isOverstayed ? 'text-danger' : 'text-primary'
                  }`}>
                    {selectedSlot.slotId}
                  </span>
                  <p className="text-sm text-txt-secondary mt-1">{selectedSlot.floor} · Section {selectedSlot.type}</p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {selectedSlot.isOverstayed ? (
                    <span className="bg-danger-50 text-danger border border-danger/20 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-danger rounded-full animate-pulse" /> Overstayed
                    </span>
                  ) : (
                    <span className="bg-primary-50 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-semibold">
                      Occupied
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <DrawerRow icon={User} label="Visitor" value={selectedSlot.visitorName || 'Unknown'} />
                  <DrawerRow icon={Car} label="Vehicle" value={selectedSlot.vehicle} highlight />
                  <DrawerRow icon={Clock} label="Entry Time" value={selectedSlot.entryTime} />
                  <DrawerRow icon={Timer} label="Duration" value={`${selectedSlot.minutesParked || 0} min`} />
                  <DrawerRow icon={MapPin} label="Location" value={`${selectedSlot.floor}, Zone ${selectedSlot.type}`} />
                </div>

                {/* Actions */}
                {selectedSlot.isOverstayed && (
                  <div className="bg-danger-50 border border-danger/20 rounded-btn p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={16} className="text-danger" />
                      <span className="text-sm font-semibold text-danger">Overstay Alert</span>
                    </div>
                    <p className="text-xs text-danger/70">This visitor has exceeded their allocated parking time. Consider sending a notification.</p>
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-border">
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="w-full py-3 bg-primary text-white rounded-btn font-semibold hover:bg-primary-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatPill = ({ label, value, icon: Icon, color }) => (
  <div className={`${color} rounded-card p-3 flex items-center gap-3 border border-transparent`}>
    <Icon size={18} />
    <div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs opacity-70 font-medium">{label}</p>
    </div>
  </div>
);

const DrawerRow = ({ icon: Icon, label, value, highlight }) => (
  <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-txt-muted" />
      <span className="text-sm text-txt-muted">{label}</span>
    </div>
    <span className={`text-sm font-semibold ${highlight ? 'text-primary font-mono' : 'text-txt-primary'}`}>
      {value}
    </span>
  </div>
);

export default BookingPage;
