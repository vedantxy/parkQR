import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, LayoutGrid, MessageSquare, 
  Calendar, MapPin, TrendingUp, TrendingDown,
  Clock, MoreHorizontal, ChevronRight, Navigation
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Cell, LineChart, Line 
} from 'recharts';

const AdminPanel = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState('A3');
  const [activeZone, setActiveZone] = useState('Zone A');

  // Mock Data
  const stats = [
    { label: 'Active Users', value: '2,840', growth: '+12.5%', isUp: true },
    { label: 'Bookings Today', value: '482', growth: '+3.1%', isUp: true },
    { label: 'Available Spaces', value: '156', growth: '-2.4%', isUp: false },
  ];

  const parkingSlots = [
    { id: 'A1', status: 'occupied', carColor: '#3B82F6' },
    { id: 'A2', status: 'occupied', carColor: '#EF4444' },
    { id: 'A3', status: 'selected', carColor: '#F59E0B' },
    { id: 'A4', status: 'available' },
    { id: 'A5', status: 'occupied', carColor: '#10B981' },
    { id: 'A6', status: 'available' },
    { id: 'A7', status: 'occupied', carColor: '#6366F1' },
    { id: 'A8', status: 'available' },
  ];

  const chartData = [
    { name: 'Jan', value: 400 }, { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 }, { name: 'Apr', value: 800 },
    { name: 'May', value: 500 }, { name: 'Jun', value: 900 },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* A. Info Cards Section (Top Section) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <InfoTag label="Area Name" value="Downtown" />
        <InfoTag label="Customer" value="Plaza Corp" />
        <InfoTag label="City" value="San Francisco" />
        <InfoTag label="Code" value="PRK-902" />
        <InfoTag label="Address" value="5th Ave, 102" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols) */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* B. Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-automotive p-6 flex flex-col justify-between h-40"
              >
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.2em]">{stat.label}</p>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.isUp ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                    {stat.growth}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <h2 className="text-3xl font-black text-[var(--txt-primary)] tracking-tighter">{stat.value}</h2>
                  <div className="flex gap-1 h-8 items-end">
                    {[0.4, 0.7, 0.5, 0.9, 0.6, 1].map((h, j) => (
                      <div key={j} className="w-1 bg-[var(--accent)] opacity-20 rounded-full" style={{ height: `${h * 100}%` }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* C. Parking Grid */}
          <div className="card-automotive p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-lg font-black text-[var(--txt-primary)]">Downtown Plaza Parking</h3>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin size={12} className="text-[var(--accent)]" />
                  <span className="text-xs text-[var(--txt-secondary)] font-bold uppercase tracking-wider">Zone A · Level 1</span>
                </div>
              </div>
              
              <div className="flex p-1 bg-[var(--bg)] rounded-xl border border-[var(--border)] self-start">
                {['Zone A', 'Zone B', 'Zone C'].map((zone) => (
                  <button 
                    key={zone}
                    onClick={() => setActiveZone(zone)}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                      activeZone === zone ? 'bg-[var(--surface)] text-[var(--accent)] shadow-sm' : 'text-[var(--txt-secondary)] hover:text-[var(--txt-primary)]'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 bg-[var(--bg)] rounded-[var(--radius-xl)] border border-[var(--border)] relative overflow-hidden">
              {/* Road Visual Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-full border-x-2 border-dashed border-white" />
              </div>

              {parkingSlots.map((slot) => (
                <ParkingSlot 
                  key={slot.id} 
                  {...slot} 
                  isSelected={selectedSlot === slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                />
              ))}
            </div>
          </div>

          {/* D. Analytics KPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-automotive p-8 flex flex-col justify-between h-64">
              <div>
                <h3 className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.2em] mb-1">Total KPI</h3>
                <p className="text-4xl font-black text-[var(--txt-primary)] tracking-tighter">87.4%</p>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={chartData}>
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 5 ? 'var(--accent)' : 'var(--border)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card-automotive p-8 flex flex-col justify-between h-64">
               <div className="flex justify-between items-start">
                <h3 className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.2em]">Performance</h3>
                <TrendingUp size={20} className="text-[var(--accent)]" />
               </div>
               <div className="space-y-4">
                 <PerformanceRow label="Occupancy Rate" value="92%" />
                 <PerformanceRow label="Avg. Revenue" value="$4,280" />
                 <PerformanceRow label="Turnover" value="12.5x" />
               </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* E. Parking Overview (Right Panel) */}
          <div className="card-automotive p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-[var(--txt-primary)]">Overview</h3>
              <MoreHorizontal size={20} className="text-[var(--txt-secondary)] cursor-pointer" />
            </div>
            
            <div className="relative h-64 flex items-center justify-center">
              <svg className="w-48 h-48 -rotate-90">
                <circle cx="96" cy="96" r="80" className="stroke-[var(--border)] fill-none stroke-[12]" />
                <circle 
                  cx="96" cy="96" r="80" 
                  className="stroke-[var(--accent)] fill-none stroke-[12] accent-glow" 
                  strokeDasharray="502" 
                  strokeDashoffset="60"
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-4xl font-black text-[var(--txt-primary)] tracking-tighter">87%</p>
                <p className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.2em] mt-1">Fullness</p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <OverviewItem icon={MapPin} label="Most Used Zone" sub="Zone A · Entrance" type="success" />
              <OverviewItem icon={Clock} label="Avg. Parking Time" sub="2h 45m · Weekdays" type="primary" />
            </div>
          </div>

          {/* F. Booking Panel */}
          <div className="card-automotive p-8 bg-[var(--surface)] border-[var(--accent)] border-opacity-30">
            <h3 className="text-lg font-black text-[var(--txt-primary)] mb-6 uppercase tracking-tighter">Create Booking</h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.2em]">Parking Date</label>
                <div className="h-12 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex items-center px-4 gap-3">
                  <Calendar size={16} className="text-[var(--txt-secondary)]" />
                  <span className="text-sm font-bold text-[var(--txt-primary)]">Oct 24, 2026</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.2em]">Arrival</label>
                  <div className="h-12 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex items-center px-4 gap-3 font-mono text-sm font-bold">10:30 AM</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.2em]">Exit</label>
                  <div className="h-12 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex items-center px-4 gap-3 font-mono text-sm font-bold">02:15 PM</div>
                </div>
              </div>

              <button className="w-full h-14 bg-[var(--accent)] text-black font-black text-xs rounded-2xl shadow-lg shadow-[var(--accent)]/20 mt-4 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em]">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const InfoTag = ({ label, value }) => (
  <div className="card-automotive p-4 flex flex-col gap-1 min-w-0">
    <span className="text-[9px] font-black text-[var(--txt-secondary)] uppercase tracking-widest truncate">{label}</span>
    <span className="text-xs font-black text-[var(--txt-primary)] truncate">{value}</span>
  </div>
);

const PerformanceRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
    <span className="text-xs font-bold text-[var(--txt-secondary)]">{label}</span>
    <span className="text-sm font-black text-[var(--txt-primary)]">{value}</span>
  </div>
);

const OverviewItem = ({ icon: Icon, label, sub, type }) => (
  <div className="flex items-center justify-between group cursor-pointer">
    <div className="flex items-center gap-3">
      <div className={`h-10 w-10 bg-${type}/10 rounded-xl flex items-center justify-center text-${type}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-bold text-[var(--txt-primary)]">{label}</p>
        <p className="text-[10px] text-[var(--txt-secondary)] uppercase font-black tracking-widest">{sub}</p>
      </div>
    </div>
    <ChevronRight size={16} className="text-[var(--txt-secondary)] group-hover:translate-x-1 transition-transform" />
  </div>
);

const ParkingSlot = ({ id, status, carColor, isSelected, onClick }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`aspect-[4/6] rounded-[24px] border-2 transition-all cursor-pointer flex flex-col items-center justify-between p-4 relative group
        ${isSelected ? 'bg-[var(--accent)] bg-opacity-[0.08] border-[var(--accent)] shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)]' : 'bg-[var(--surface)] border-[var(--border)]'}
        ${status === 'available' ? 'border-dashed opacity-60' : ''}
      `}
    >
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--txt-secondary)]'}`}>
        {id}
      </span>
      
      {status !== 'available' ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full flex-1 flex items-center justify-center relative px-2"
        >
          {/* Realistic Car Container */}
          <div className="relative w-full h-full max-h-[120px] flex items-center justify-center drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)]">
            {/* Soft Shadow Layer */}
            <div className="absolute bottom-[-10px] w-[80%] h-[20%] bg-black/30 blur-[15px] rounded-full" />
            
            {/* SVG Highly Realistic Car Top View */}
            <svg viewBox="0 0 100 180" className="w-full h-full max-w-[60px]">
              {/* Car Body with Gradient */}
              <defs>
                <linearGradient id={`carGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: carColor, stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0.2)', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: carColor, stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              
              {/* Main Chassis */}
              <path d="M15,20 Q15,10 50,10 Q85,10 85,20 L85,160 Q85,170 50,170 Q15,170 15,160 Z" fill={carColor} />
              
              {/* Windshields & Glass */}
              <rect x="25" y="40" width="50" height="35" rx="10" fill="rgba(0,0,0,0.6)" /> {/* Front */}
              <rect x="25" y="110" width="50" height="25" rx="5" fill="rgba(0,0,0,0.6)" /> {/* Rear */}
              
              {/* Side Mirrors */}
              <rect x="5" y="45" width="10" height="5" rx="2" fill={carColor} />
              <rect x="85" y="45" width="10" height="5" rx="2" fill={carColor} />
              
              {/* Lights */}
              <circle cx="25" cy="15" r="3" fill="#FFF" className="animate-pulse" />
              <circle cx="75" cy="15" r="3" fill="#FFF" className="animate-pulse" />
              <rect x="20" y="165" width="10" height="3" fill="#F00" />
              <rect x="70" y="165" width="10" height="3" fill="#F00" />
            </svg>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 w-full border-2 border-dashed border-[var(--border)] rounded-[16px] flex items-center justify-center group-hover:border-[var(--accent)]/30 transition-colors">
          <Plus size={16} className="text-[var(--border)] group-hover:text-[var(--accent)] transition-colors" />
        </div>
      )}
    </motion.div>
  );
};

export default AdminPanel;
