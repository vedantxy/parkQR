import React, { useState, useEffect } from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Zap, Download, Activity, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';

const AnalyticsDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.token) return;
            try {
                const res = await fetch(`${API_URL}/api/analytics`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const json = await res.json();
                if (json.success) setData(json.data);
            } catch (e) {
                console.error("Analytics fetch failed");
            } finally { setLoading(false); }
        };
        fetchData();
    }, [user?.token]);

    const exportToCSV = () => {
        if (!data) return;
        const headers = ["Date", "Visitors"];
        const rows = data.dailyStats.map(s => `${s._id},${s.count}`);
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `parksmart_audit_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    if (loading || !data) return (
        <div className="flex flex-col items-center justify-center h-64">
             <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
             <p className="mt-4 text-xs font-black text-slate-500 uppercase tracking-widest">Aggregating AI Data...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <Zap className="text-primary fill-primary/20" /> Intelligence Engine
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">Predictive load modeling and visitor velocity</p>
                </div>
                <button 
                    onClick={exportToCSV}
                    className="px-6 py-3 bg-white text-slate-950 font-black text-xs rounded-2xl flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5"
                >
                    <Download size={14} /> EXPORT CLOUD AUDIT
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Prediction Gauge */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-6">
                            <Activity size={14}/> System Prediction
                        </div>
                        <h3 className="text-5xl font-black text-white">{data.occupancy.prediction}%</h3>
                        <p className="text-slate-500 text-sm mt-2 font-medium">Estimated Peak Capacity</p>
                    </div>
                    <div className="mt-10">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${data.occupancy.prediction}%` }}
                                className="h-full bg-primary shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                            />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest italic flex items-center gap-2">
                             <Clock size={10} className="text-primary" /> Expect bottleneck inflow at 18:00 HR
                        </p>
                    </div>
                </div>

                {/* Velocity Trends */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[32px] p-8">
                     <div className="flex items-center justify-between mb-10">
                        <h3 className="text-lg font-black flex items-center gap-2">
                            <Users size={18} className="text-primary" /> Traffic Velocity
                        </h3>
                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase">
                             <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-primary" /> Current Period</span>
                             <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-slate-700" /> Historical</span>
                        </div>
                     </div>
                     <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.dailyStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="_id" stroke="#475569" fontSize={10} fontWeight={800} axisLine={false} tickLine={false} />
                                <YAxis stroke="#475569" fontSize={10} fontWeight={800} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#2563eb" 
                                    strokeWidth={4} 
                                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#020617' }} 
                                    activeDot={{ r: 8, stroke: '#2563eb', strokeWidth: 4, fill: '#fff' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            </div>

            {/* Bottom Feed */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 mt-8">
                <h3 className="text-sm font-black uppercase tracking-[3px] text-slate-500 mb-8">Intelligence Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.timeline.slice(0, 6).map((item, i) => (
                        <div key={i} className="flex flex-col gap-3 p-4 bg-white/3 border border-white/5 rounded-2xl hover:bg-white/5 transition-all">
                             <div className="flex justify-between items-center">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${item.type === 'ENTRY' ? 'bg-success text-white' : 'bg-red-500 text-white'}`}>
                                    {item.type}
                                </span>
                                <span className="text-[10px] font-black text-slate-500 italic">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                             </div>
                             <p className="text-xs font-bold text-slate-300 leading-relaxed font-mono truncate">{item.message}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
