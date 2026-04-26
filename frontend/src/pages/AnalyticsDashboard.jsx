import React, { useState } from 'react';
import {
  BarChart3, Calendar, Download, Users, Clock, Zap, TrendingUp,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, Legend,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const visitorsPerDay = [
  { date: 'Apr 20', visitors: 42 },
  { date: 'Apr 21', visitors: 58 },
  { date: 'Apr 22', visitors: 35 },
  { date: 'Apr 23', visitors: 71 },
  { date: 'Apr 24', visitors: 63 },
  { date: 'Apr 25', visitors: 89 },
  { date: 'Apr 26', visitors: 47 },
];

const gateData = [
  { name: 'Main Gate', value: 45, color: '#2563EB' },
  { name: 'North Gate', value: 30, color: '#10B981' },
  { name: 'East Gate', value: 15, color: '#F59E0B' },
  { name: 'Service', value: 10, color: '#64748B' },
];

const hourlyData = [
  { hour: '6am', visitors: 5 },
  { hour: '7am', visitors: 12 },
  { hour: '8am', visitors: 28 },
  { hour: '9am', visitors: 38 },
  { hour: '10am', visitors: 45 },
  { hour: '11am', visitors: 32 },
  { hour: '12pm', visitors: 50 },
  { hour: '1pm', visitors: 42 },
  { hour: '2pm', visitors: 35 },
  { hour: '3pm', visitors: 28 },
  { hour: '4pm', visitors: 38 },
  { hour: '5pm', visitors: 48 },
  { hour: '6pm', visitors: 55 },
  { hour: '7pm', visitors: 30 },
  { hour: '8pm', visitors: 18 },
  { hour: '9pm', visitors: 8 },
];

const usageData = [
  { name: 'Usage', value: 72, fill: '#2563EB' },
];

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('week');

  const ranges = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'custom', label: 'Custom' },
  ];

  const kpis = [
    { label: 'Total Visitors', value: '1,247', change: '+12.5%', up: true, icon: Users, color: 'primary' },
    { label: 'Avg Stay Duration', value: '47 min', change: '-8%', up: false, icon: Clock, color: 'success' },
    { label: 'Peak Hour', value: '12:00 PM', change: '50 visitors', up: true, icon: Zap, color: 'warning' },
    { label: 'Overstay Rate', value: '4.2%', change: '-1.8%', up: false, icon: TrendingUp, color: 'danger' },
  ];

  const colorMap = {
    primary: { bg: 'bg-primary-50', icon: 'text-primary', border: 'border-l-primary' },
    success: { bg: 'bg-success-50', icon: 'text-success', border: 'border-l-success' },
    warning: { bg: 'bg-warning-50', icon: 'text-warning', border: 'border-l-warning' },
    danger: { bg: 'bg-danger-50', icon: 'text-danger', border: 'border-l-danger' },
  };

  const handleExport = () => {
    const csv = 'Date,Visitors\n' + visitorsPerDay.map(d => `${d.date},${d.visitors}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parking_analytics.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">Analytics</h1>
          <p className="text-sm text-txt-secondary mt-0.5">Insights and trends for your parking facility</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range */}
          <div className="flex bg-white border border-border rounded-btn overflow-hidden">
            {ranges.map(r => (
              <button
                key={r.id}
                onClick={() => setDateRange(r.id)}
                className={`px-3 py-2 text-xs font-medium transition-all duration-200
                  ${dateRange === r.id
                    ? 'bg-primary text-white'
                    : 'text-txt-secondary hover:bg-surface-hover'
                  }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-btn text-sm font-medium text-txt-secondary hover:bg-surface-hover transition-all duration-200"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const c = colorMap[kpi.color];
          const Icon = kpi.icon;
          return (
            <div key={i} className={`bg-white rounded-card border border-border border-l-4 ${c.border} p-4 shadow-card`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-txt-muted uppercase tracking-wide">{kpi.label}</p>
                  <p className="text-2xl font-bold text-txt-primary mt-1">{kpi.value}</p>
                </div>
                <div className={`h-9 w-9 ${c.bg} rounded-lg flex items-center justify-center`}>
                  <Icon size={18} className={c.icon} />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1">
                {kpi.up ? (
                  <ArrowUpRight size={14} className="text-success" />
                ) : (
                  <ArrowDownRight size={14} className="text-danger" />
                )}
                <span className={`text-xs font-semibold ${kpi.up ? 'text-success' : 'text-danger'}`}>
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Visitors per Day - AreaChart */}
        <div className="bg-white rounded-card border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-txt-primary">Visitors per Day</h3>
            <span className="text-xs text-txt-muted bg-surface px-2 py-1 rounded font-medium">Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={visitorsPerDay}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="visitors" stroke="#2563EB" strokeWidth={2} fill="url(#areaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Entry by Gate - PieChart */}
        <div className="bg-white rounded-card border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-txt-primary">Entry by Gate</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={gateData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {gateData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
                formatter={(value, name) => [`${value}%`, name]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, color: '#64748B' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Distribution - BarChart */}
        <div className="bg-white rounded-card border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-txt-primary">Hourly Distribution</h3>
            <span className="text-xs text-txt-muted bg-surface px-2 py-1 rounded font-medium">Today</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
              />
              <Bar dataKey="visitors" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Parking Usage - RadialBarChart */}
        <div className="bg-white rounded-card border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-txt-primary">Parking Usage</h3>
            <span className="text-xs text-txt-muted bg-surface px-2 py-1 rounded font-medium">Current</span>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={260}>
              <RadialBarChart
                cx="50%" cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                barSize={20}
                data={usageData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background={{ fill: '#F1F5F9' }}
                  dataKey="value"
                  cornerRadius={10}
                  fill="#2563EB"
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-4xl font-bold text-primary">72%</p>
              <p className="text-xs text-txt-muted font-medium">Occupied</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
