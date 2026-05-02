import React, { useState } from 'react';
import {
  BarChart3, Calendar, Download, Users, Clock, Zap, TrendingUp,
  ArrowUpRight, ArrowDownRight, Activity, PieChart as PieIcon, BarChart as BarIcon
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, Legend,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const visitorsPerDay = [
  { date: 'APR 20', visitors: 42 },
  { date: 'APR 21', visitors: 58 },
  { date: 'APR 22', visitors: 35 },
  { date: 'APR 23', visitors: 71 },
  { date: 'APR 24', visitors: 63 },
  { date: 'APR 25', visitors: 89 },
  { date: 'APR 26', visitors: 47 },
];

const gateData = [
  { name: 'MAIN ALPHA', value: 45, color: 'var(--accent)' },
  { name: 'NORTH BRAVO', value: 30, color: '#10B981' },
  { name: 'EAST CHARLIE', value: 15, color: '#F59E0B' },
  { name: 'SERVICE', value: 10, color: '#64748B' },
];

const hourlyData = [
  { hour: '06:00', visitors: 5 },
  { hour: '09:00', visitors: 38 },
  { hour: '12:00', visitors: 50 },
  { hour: '15:00', visitors: 35 },
  { hour: '18:00', visitors: 55 },
  { hour: '21:00', visitors: 8 },
];

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('week');

  const kpis = [
    { label: 'TOTAL ENTRIES', value: '1,247', change: '+12.5%', up: true, icon: Users, color: 'var(--accent)' },
    { label: 'AVG DURATION', value: '47 MIN', change: '-8%', up: false, icon: Clock, color: '#10B981' },
    { label: 'PEAK TRAFFIC', value: '18:00', change: '55 UNIT', up: true, icon: Zap, color: '#F59E0B' },
    { label: 'BREACH RATE', value: '4.2%', change: '-1.8%', up: false, icon: TrendingUp, color: '#EF4444' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[var(--txt-primary)] tracking-tighter uppercase mb-2">
            NEURAL<span className="text-[var(--accent)]"> ANALYTICS</span>
          </h1>
          <p className="text-[10px] font-bold text-[var(--txt-secondary)] uppercase tracking-[0.4em] opacity-60">
            Advanced Telemetry Dashboard
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex bg-[var(--surface)] border border-[var(--border)] rounded-full p-1.5 shadow-xl">
             {['TODAY', 'WEEK', 'MONTH'].map(r => (
               <button
                 key={r}
                 onClick={() => setDateRange(r.toLowerCase())}
                 className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all
                   ${dateRange === r.toLowerCase() ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'text-[var(--txt-secondary)] hover:text-[var(--txt-primary)]'}`}
               >
                 {r}
               </button>
             ))}
           </div>
           <button className="h-12 w-12 bg-[var(--surface)] border border-[var(--border)] rounded-full flex items-center justify-center hover:bg-[var(--bg)] transition-all shadow-xl">
              <Download size={18} />
           </button>
        </div>
      </div>

      {/* KPI Engine */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-[var(--surface)] rounded-[32px] border border-[var(--border)] p-8 shadow-2xl relative overflow-hidden group hover:border-[var(--accent)]/30 transition-all">
             <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ backgroundColor: kpi.color }} />
             <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 bg-[var(--bg)] rounded-2xl flex items-center justify-center border border-[var(--border)]">
                   <kpi.icon size={20} style={{ color: kpi.color }} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black tracking-tighter ${kpi.up ? 'text-success' : 'text-danger'}`}>
                   {kpi.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                   {kpi.change}
                </div>
             </div>
             <p className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-widest mb-1 opacity-60">{kpi.label}</p>
             <p className="text-3xl font-black text-[var(--txt-primary)] tracking-tighter">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts System */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Visitors Flow */}
        <div className="bg-[var(--surface)] rounded-[40px] border border-[var(--border)] p-8 shadow-2xl relative overflow-hidden">
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center text-[var(--accent)]">
                    <Activity size={20} />
                 </div>
                 <h3 className="text-sm font-black text-[var(--txt-primary)] uppercase tracking-widest">Traffic Flow</h3>
              </div>
              <span className="text-[9px] font-black text-[var(--txt-secondary)] opacity-40 uppercase tracking-widest">Real-time Stream</span>
           </div>

           <ResponsiveContainer width="100%" height={300}>
             <AreaChart data={visitorsPerDay}>
               <defs>
                 <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                   <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.3} />
               <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--txt-secondary)' }} axisLine={false} tickLine={false} dy={10} />
               <YAxis tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--txt-secondary)' }} axisLine={false} tickLine={false} />
               <Tooltip 
                 contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)', borderRadius: '16px', color: '#fff' }}
                 itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
               />
               <Area type="monotone" dataKey="visitors" stroke="var(--accent)" strokeWidth={4} fill="url(#areaGrad)" />
             </AreaChart>
           </ResponsiveContainer>
        </div>

        {/* Gate Distribution */}
        <div className="bg-[var(--surface)] rounded-[40px] border border-[var(--border)] p-8 shadow-2xl relative overflow-hidden">
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 bg-success/10 rounded-xl flex items-center justify-center text-success">
                    <PieIcon size={20} />
                 </div>
                 <h3 className="text-sm font-black text-[var(--txt-primary)] uppercase tracking-widest">Spatial Distribution</h3>
              </div>
           </div>

           <div className="flex flex-col md:flex-row items-center justify-around gap-8">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={gateData}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {gateData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-4 min-w-[140px]">
                 {gateData.map((g, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: g.color }} />
                      <span className="text-[9px] font-black text-[var(--txt-secondary)] uppercase tracking-widest">{g.name}</span>
                      <span className="text-xs font-black ml-auto">{g.value}%</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Temporal Intensity */}
        <div className="bg-[var(--surface)] rounded-[40px] border border-[var(--border)] p-8 shadow-2xl relative overflow-hidden">
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 bg-warning/10 rounded-xl flex items-center justify-center text-warning">
                    <BarIcon size={20} />
                 </div>
                 <h3 className="text-sm font-black text-[var(--txt-primary)] uppercase tracking-widest">Temporal Intensity</h3>
              </div>
           </div>

           <ResponsiveContainer width="100%" height={300}>
             <BarChart data={hourlyData}>
               <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.3} />
               <XAxis dataKey="hour" tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--txt-secondary)' }} axisLine={false} tickLine={false} />
               <YAxis tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--txt-secondary)' }} axisLine={false} tickLine={false} />
               <Tooltip />
               <Bar dataKey="visitors" fill="var(--accent)" radius={[8, 8, 0, 0]} barSize={24} />
             </BarChart>
           </ResponsiveContainer>
        </div>

        {/* Global Occupancy */}
        <div className="bg-[var(--surface)] rounded-[40px] border border-[var(--border)] p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center">
           <div className="absolute top-8 left-8">
              <h3 className="text-sm font-black text-[var(--txt-primary)] uppercase tracking-widest">Current Load</h3>
           </div>
           
           <div className="relative">
              <ResponsiveContainer width={240} height={240}>
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="80%" outerRadius="100%"
                  barSize={12}
                  data={[{ name: 'Usage', value: 72, fill: 'var(--accent)' }]}
                  startAngle={90} endAngle={-270}
                >
                  <RadialBar
                    background={{ fill: 'var(--bg)' }}
                    dataKey="value"
                    cornerRadius={100}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <p className="text-6xl font-black text-[var(--txt-primary)] tracking-tighter">72<span className="text-xl">%</span></p>
                 <p className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.3em] mt-2">Occupied</p>
              </div>
           </div>
           
           <div className="mt-8 flex gap-8">
              <div className="text-center">
                 <p className="text-lg font-black text-[var(--txt-primary)]">234</p>
                 <p className="text-[9px] font-black text-success uppercase tracking-widest">Active Slots</p>
              </div>
              <div className="text-center border-l border-[var(--border)] pl-8">
                 <p className="text-lg font-black text-[var(--txt-primary)]">12</p>
                 <p className="text-[9px] font-black text-danger uppercase tracking-widest">Breach Alerts</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsDashboard;
