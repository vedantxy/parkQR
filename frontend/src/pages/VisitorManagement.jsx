import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, Plus, 
  ExternalLink, Clock, Car, ShieldCheck, MapPin,
  ShieldAlert, MoreHorizontal, Download, ChevronRight, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';
import VisitorEntry from './VisitorEntry';
import toast from 'react-hot-toast';

const VisitorManagement = () => {
    const { user } = useAuth();
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [showEntryForm, setShowEntryForm] = useState(false);
    const [selectedVisitor, setSelectedVisitor] = useState(null);

    const fetchVisitors = async () => {
        if (!user?.token) return;
        try {
            const res = await fetch(`${API_URL}/visitors`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            if (data.success) {
                setVisitors(data.data);
            }
        } catch (err) {
            toast.error("Failed to load visitors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, [user?.token]);

    const filteredVisitors = visitors.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                             v.vehicle.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || v.status.toLowerCase() === filter;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'inside': return 'bg-success/10 text-success border-success/20';
            case 'exited': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
            case 'coming': return 'bg-primary/10 text-primary border-primary/20';
            default: return 'bg-slate-500/10 text-slate-500';
        }
    };

    if (showEntryForm) {
        return (
            <div className="space-y-6">
                <button 
                    onClick={() => { setShowEntryForm(false); fetchVisitors(); }}
                    className="flex items-center gap-2 text-xs font-black text-[var(--txt-secondary)] uppercase tracking-widest hover:text-[var(--accent)] transition-all"
                >
                    <ChevronRight size={14} className="rotate-180" /> Back to Directory
                </button>
                <VisitorEntry />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 animate-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[var(--txt-primary)] tracking-tighter uppercase mb-2">
                        VISITOR<span className="text-[var(--accent)]"> DIRECTORY</span>
                    </h1>
                    <p className="text-[10px] font-bold text-[var(--txt-secondary)] uppercase tracking-[0.4em] opacity-60">
                        Neural Identity Management System
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--txt-secondary)] group-focus-within:text-[var(--accent)] transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by Name or Vehicle..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-14 w-64 xxl:w-80 bg-[var(--surface)] border border-[var(--border)] rounded-2xl pl-12 pr-4 text-xs font-bold outline-none focus:border-[var(--accent)] transition-all shadow-lg shadow-black/5"
                        />
                    </div>
                    <button 
                        onClick={() => setShowEntryForm(true)}
                        className="h-14 px-8 bg-slate-900 text-white dark:bg-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus size={16} /> Register New
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Logged" value={visitors.length} icon={Users} color="text-[var(--txt-primary)]" />
                <StatCard label="Inside Now" value={visitors.filter(v => v.status === 'inside').length} icon={ShieldCheck} color="text-success" />
                <StatCard label="Expected" value={visitors.filter(v => v.status === 'coming').length} icon={Clock} color="text-primary" />
                <StatCard label="Completed" value={visitors.filter(v => v.status === 'exited').length} icon={ExternalLink} color="text-slate-500" />
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-4 bg-[var(--surface)] p-2 rounded-[24px] border border-[var(--border)] shadow-xl overflow-x-auto">
                {['all', 'inside', 'coming', 'exited'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap
                        ${filter === f 
                            ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' 
                            : 'text-[var(--txt-secondary)] hover:bg-[var(--bg)]'
                        }`}
                    >
                        {f === 'all' ? 'Full Audit' : f}
                    </button>
                ))}
            </div>

            {/* Table Section */}
            <div className="bg-[var(--surface)] rounded-[32px] border border-[var(--border)] shadow-2xl overflow-hidden relative group">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.3em]">Synchronizing Registry...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                                    <th className="px-8 py-5 text-left text-[9px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.3em]">Identity Profile</th>
                                    <th className="px-8 py-5 text-left text-[9px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.3em]">Vehicle ID</th>
                                    <th className="px-8 py-5 text-left text-[9px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.3em]">Temporal Status</th>
                                    <th className="px-8 py-5 text-left text-[9px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.3em]">Assigned Zone</th>
                                    <th className="px-8 py-5 text-right text-[9px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.3em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {filteredVisitors.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <p className="text-xs font-bold text-[var(--txt-secondary)] opacity-40 uppercase tracking-widest">No matching identities found in registry</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVisitors.map((v) => (
                                        <motion.tr 
                                            key={v._id} 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-[var(--bg)]/50 transition-colors group/row cursor-pointer"
                                            onClick={() => setSelectedVisitor(v)}
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${v.name}`} alt="avatar" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-[var(--txt-primary)] tracking-tight uppercase">{v.name}</p>
                                                        <p className="text-[10px] text-[var(--txt-secondary)] font-bold">{v.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-black text-[var(--txt-primary)] bg-[var(--bg)] px-3 py-1.5 rounded-lg border border-[var(--border)] group-hover/row:border-[var(--accent)]/30 transition-all">
                                                    {v.vehicle}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[9px] font-black px-3 py-1.5 rounded-full border uppercase tracking-widest ${getStatusColor(v.status)}`}>
                                                    {v.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={12} className="text-[var(--accent)]" />
                                                    <span className="text-[10px] font-black text-[var(--txt-primary)] uppercase">{v.flatNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="h-10 w-10 bg-[var(--bg)] border border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--txt-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Overlay */}
            <AnimatePresence>
                {selectedVisitor && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedVisitor(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--surface)] shadow-2xl z-[101] flex flex-col border-l border-[var(--border)]"
                        >
                            <div className="p-8 border-b border-[var(--border)] flex items-center justify-between">
                                <h3 className="text-xl font-black text-[var(--txt-primary)] uppercase tracking-tight">Identity Details</h3>
                                <button onClick={() => setSelectedVisitor(null)} className="h-12 w-12 bg-[var(--bg)] rounded-2xl flex items-center justify-center border border-[var(--border)] hover:bg-danger/10 hover:text-danger transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 space-y-8 overflow-y-auto">
                                <div className="text-center">
                                    <div className="h-32 w-32 rounded-[40px] bg-[var(--bg)] border-2 border-[var(--border)] mx-auto mb-6 p-1">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedVisitor.name}`} alt="avatar" className="rounded-[36px]" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[var(--txt-primary)] tracking-tighter uppercase">{selectedVisitor.name}</h2>
                                    <p className={`text-[10px] font-black px-4 py-1.5 rounded-full border inline-block mt-3 uppercase tracking-widest ${getStatusColor(selectedVisitor.status)}`}>
                                        {selectedVisitor.status} STATUS
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <DetailBox label="Vehicle" value={selectedVisitor.vehicle} icon={Car} />
                                    <DetailBox label="Unit" value={selectedVisitor.flatNumber} icon={MapPin} />
                                    <DetailBox label="Check-in" value={new Date(selectedVisitor.createdAt).toLocaleTimeString()} icon={Clock} />
                                    <DetailBox label="Pass ID" value={selectedVisitor._id.slice(-6).toUpperCase()} icon={ShieldCheck} />
                                </div>

                                <div className="bg-[var(--bg)] rounded-[24px] p-6 border border-[var(--border)]">
                                    <h4 className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-widest mb-4">Security Assessment</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-[var(--txt-primary)] uppercase">Verified Identity</p>
                                            <p className="text-[10px] text-[var(--txt-secondary)] font-bold">Standard access protocols applied.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-[var(--surface)] rounded-[24px] border border-[var(--border)] p-6 shadow-xl flex items-center gap-5 group hover:border-[var(--accent)]/30 transition-all">
        <div className="h-12 w-12 bg-[var(--bg)] rounded-xl flex items-center justify-center border border-[var(--border)]">
            <Icon size={20} className={color} />
        </div>
        <div>
            <p className="text-2xl font-black text-[var(--txt-primary)] tracking-tight">{value}</p>
            <p className="text-[9px] font-black text-[var(--txt-secondary)] uppercase tracking-widest opacity-60">{label}</p>
        </div>
    </div>
);

const DetailBox = ({ label, value, icon: Icon }) => (
    <div className="bg-[var(--bg)] rounded-[20px] p-4 border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-2 opacity-40">
            <Icon size={12} className="text-[var(--txt-primary)]" />
            <span className="text-[8px] font-black text-[var(--txt-secondary)] uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-xs font-black text-[var(--txt-primary)] uppercase truncate">{value}</p>
    </div>
);

export default VisitorManagement;
