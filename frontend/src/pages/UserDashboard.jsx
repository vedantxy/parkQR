import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, UserPlus, Clock, Search, Filter,
  ChevronDown, Eye, X, Car, Phone, Calendar,
  CheckCircle, AlertCircle, ArrowRight, ShieldCheck, Activity
} from 'lucide-react';
import ParkingMap from '../components/ParkingMap';

const myVisitors = [
  { id: 1, name: 'Rahul Sharma', phone: '9876543210', vehicle: 'MH 02 AB 1234', date: '2026-04-26', time: '10:30 AM', status: 'inside', duration: '45 min' },
  { id: 2, name: 'Priya Patel', phone: '9876543211', vehicle: 'MH 04 CD 5678', date: '2026-04-26', time: '09:15 AM', status: 'exited', duration: '1h 20m' },
  { id: 3, name: 'Amit Kumar', phone: '9876543212', vehicle: 'MH 01 EF 9012', date: '2026-04-25', time: '02:45 PM', status: 'exited', duration: '55 min' },
  { id: 4, name: 'Neha Singh', phone: '9876543213', vehicle: 'MH 03 GH 3456', date: '2026-04-25', time: '11:00 AM', status: 'exited', duration: '2h 10m' },
];

const UserDashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const activeVisitors = myVisitors.filter(v => v.status === 'inside');

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Engine */}
      <div className="bg-[var(--surface)] rounded-[40px] border border-[var(--border)] p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] opacity-[0.05] blur-[100px] -mr-32 -mt-32" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-black dark:bg-white text-white dark:text-black rounded-[28px] flex items-center justify-center text-3xl font-black shadow-xl">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.4em] mb-1">Authorization Confirmed</p>
              <h1 className="text-3xl font-black text-[var(--txt-primary)] uppercase tracking-tight">WELCOME, {user?.name || 'USER'}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] font-bold text-[var(--txt-secondary)] uppercase tracking-widest flex items-center gap-2">
                  <Home size={12} className="text-[var(--accent)]" /> Unit A-401
                </span>
                <span className="text-[10px] text-[var(--border)] font-black">|</span>
                <span className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-widest">{user?.role || 'Resident'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="h-16 px-10 bg-[var(--accent)] text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <UserPlus size={18} /> Quick Invite
          </button>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard icon={Users} label="GLOBAL VISITS" value={myVisitors.length} />
        <StatsCard icon={ShieldCheck} label="ACTIVE NOW" value={activeVisitors.length} highlight />
        <StatsCard icon={Activity} label="MONTHLY LOAD" value={myVisitors.length + 8} />
      </div>

      {/* Primary Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Visit History Console */}
        <div className="lg:col-span-8 bg-[var(--surface)] rounded-[40px] border border-[var(--border)] overflow-hidden shadow-2xl">
           <div className="p-8 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 bg-[var(--bg)] rounded-xl flex items-center justify-center border border-[var(--border)]">
                    <Clock size={18} className="text-[var(--accent)]" />
                 </div>
                 <h2 className="text-sm font-black text-[var(--txt-primary)] uppercase tracking-widest">Entry History</h2>
              </div>
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--txt-secondary)] opacity-40" size={14} />
                    <input 
                      type="text" 
                      placeholder="SEARCH..."
                      className="h-12 bg-[var(--bg)] border border-[var(--border)] rounded-full pl-10 pr-6 text-[10px] font-black tracking-widest outline-none focus:border-[var(--accent)] w-48"
                    />
                 </div>
              </div>
           </div>

           <div className="divide-y divide-[var(--border)]">
              {myVisitors.map(v => (
                <div key={v.id} className="p-6 flex items-center justify-between hover:bg-[var(--bg)] transition-all group">
                   <div className="flex items-center gap-6">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all ${v.status === 'inside' ? 'bg-success/10 border-success/30 text-success' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--txt-secondary)]'}`}>
                         <Car size={20} />
                      </div>
                      <div>
                         <p className="text-sm font-black text-[var(--txt-primary)] uppercase tracking-tight">{v.name}</p>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-mono font-black text-[var(--accent)] uppercase">{v.vehicle}</span>
                            <span className="text-[10px] text-[var(--txt-secondary)] opacity-40 uppercase tracking-widest">{v.date}</span>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-[var(--txt-primary)] uppercase tracking-widest">{v.duration}</p>
                      <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border mt-2 inline-block ${v.status === 'inside' ? 'bg-success/10 text-success border-success/20' : 'bg-[var(--border)] text-[var(--txt-secondary)]'}`}>
                         {v.status}
                      </span>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="p-6 bg-[var(--bg)] text-center">
              <button className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.3em] hover:text-[var(--accent)] transition-all flex items-center gap-2 mx-auto">
                 VIEW ARCHIVED DATA <ArrowRight size={14} />
              </button>
           </div>
        </div>

        {/* Spatial Intelligence (Map) */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-[var(--surface)] rounded-[40px] border border-[var(--border)] p-6 shadow-2xl overflow-hidden relative">
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-10 w-10 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center text-[var(--accent)]">
                    <Activity size={20} />
                 </div>
                 <h3 className="text-sm font-black text-[var(--txt-primary)] uppercase tracking-widest">Spatial Sync</h3>
              </div>
              <div className="rounded-[24px] overflow-hidden border border-[var(--border)]">
                <ParkingMap availableSlots={28} occupiedSlots={4} />
              </div>
           </div>

           {/* Security Status */}
           <div className="bg-[var(--surface)] rounded-[40px] border border-[var(--border)] p-8 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-10 w-10 bg-success/10 rounded-xl flex items-center justify-center text-success">
                    <ShieldCheck size={20} />
                 </div>
                 <h3 className="text-sm font-black text-[var(--txt-primary)] uppercase tracking-widest">Protocol Status</h3>
              </div>
              <p className="text-[10px] font-bold text-[var(--txt-secondary)] uppercase tracking-widest leading-loose mb-6">
                 Your residential unit is secured. 4 authorized visits confirmed today. No unauthorized breaches detected.
              </p>
              <div className="h-1 w-full bg-[var(--bg)] rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} className="h-full bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              </div>
           </div>
        </div>

      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-[101] p-4"
            >
              <div className="bg-[var(--surface)] rounded-[40px] shadow-2xl border border-[var(--border)] w-full max-w-lg p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--accent)]" />
                <div className="flex items-center justify-between mb-10">
                   <div>
                      <h3 className="text-2xl font-black text-[var(--txt-primary)] uppercase tracking-tight">Quick Authorization</h3>
                      <p className="text-[10px] font-bold text-[var(--txt-secondary)] uppercase tracking-[0.2em] mt-1">Generate Instant Access Pass</p>
                   </div>
                   <button onClick={() => setShowInviteModal(false)} className="h-12 w-12 bg-[var(--bg)] rounded-2xl flex items-center justify-center border border-[var(--border)] hover:bg-danger/10 hover:text-danger transition-all">
                      <X size={20} />
                   </button>
                </div>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowInviteModal(false); }}>
                  <ModalField icon={UserPlus} label="VISITOR NAME" placeholder="e.g. John Doe" />
                  <div className="grid grid-cols-2 gap-6">
                    <ModalField icon={Car} label="VEHICLE IDENTITY" placeholder="e.g. MH 01 AB 1234" />
                    <ModalField icon={Clock} label="ARRIVAL TIME" placeholder="e.g. 15:00" />
                  </div>
                  <button type="submit" className="w-full h-16 bg-slate-900 text-white dark:bg-white dark:text-black rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 mt-6">
                    <ShieldCheck size={18} /> GENERATE PASS
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatsCard = ({ icon: Icon, label, value, highlight }) => (
  <div className={`bg-[var(--surface)] rounded-[32px] border border-[var(--border)] p-8 shadow-2xl group hover:border-[var(--accent)]/30 transition-all ${highlight ? 'relative overflow-hidden' : ''}`}>
     {highlight && <div className="absolute top-0 right-0 h-24 w-24 bg-[var(--accent)]/10 -mr-12 -mt-12 rounded-full blur-3xl animate-pulse" />}
     <div className="flex items-center gap-6">
        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border border-[var(--border)] accent-glow ${highlight ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-[var(--bg)] text-[var(--txt-secondary)]'}`}>
           <Icon size={24} />
        </div>
        <div>
           <p className="text-3xl font-black text-[var(--txt-primary)] tracking-tighter">{value}</p>
           <p className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-widest opacity-60">{label}</p>
        </div>
     </div>
  </div>
);

const ModalField = ({ icon: Icon, label, placeholder, type = 'text' }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--txt-secondary)] opacity-40" size={16} />
      <input
        type={type}
        placeholder={placeholder}
        className="w-full h-14 bg-[var(--bg)] border border-[var(--border)] rounded-[20px] pl-12 pr-6 text-xs font-black uppercase tracking-widest outline-none focus:border-[var(--accent)] transition-all"
      />
    </div>
  </div>
);

export default UserDashboard;
