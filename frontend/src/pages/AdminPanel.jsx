import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users, Car, ParkingSquare, AlertTriangle, TrendingUp, TrendingDown,
  ArrowRight, Clock, UserPlus, Eye, MapPin
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weekData = [
  { day: 'Mon', visitors: 42 },
  { day: 'Tue', visitors: 58 },
  { day: 'Wed', visitors: 35 },
  { day: 'Thu', visitors: 71 },
  { day: 'Fri', visitors: 63 },
  { day: 'Sat', visitors: 89 },
  { day: 'Sun', visitors: 47 },
];

const hourData = [
  { hour: '6am', count: 5 },
  { hour: '8am', count: 22 },
  { hour: '10am', count: 38 },
  { hour: '12pm', count: 45 },
  { hour: '2pm', count: 31 },
  { hour: '4pm', count: 28 },
  { hour: '6pm', count: 42 },
  { hour: '8pm', count: 18 },
  { hour: '10pm', count: 8 },
];

const recentVisitors = [
  { id: 1, name: 'Rahul Sharma', vehicle: 'MH 02 AB 1234', flat: 'A-401', time: '10:32 AM', status: 'inside' },
  { id: 2, name: 'Priya Patel', vehicle: 'MH 04 CD 5678', flat: 'B-202', time: '10:15 AM', status: 'inside' },
  { id: 3, name: 'Amit Kumar', vehicle: 'MH 01 EF 9012', flat: 'C-103', time: '09:48 AM', status: 'exited' },
  { id: 4, name: 'Neha Singh', vehicle: 'MH 03 GH 3456', flat: 'A-505', time: '09:30 AM', status: 'overstay' },
  { id: 5, name: 'Ravi Joshi', vehicle: 'MH 12 IJ 7890', flat: 'D-301', time: '09:12 AM', status: 'exited' },
];

const StatCard = ({ icon: Icon, label, value, change, changeType, color }) => {
  const colorMap = {
    blue: { bg: 'bg-primary-50', border: 'border-l-primary', icon: 'text-primary', changeBg: 'bg-primary-50 text-primary' },
    green: { bg: 'bg-success-50', border: 'border-l-success', icon: 'text-success', changeBg: 'bg-success-50 text-success' },
    amber: { bg: 'bg-warning-50', border: 'border-l-warning', icon: 'text-warning', changeBg: 'bg-warning-50 text-warning' },
    red: { bg: 'bg-danger-50', border: 'border-l-danger', icon: 'text-danger', changeBg: 'bg-danger-50 text-danger' },
  };
  const c = colorMap[color];

  return (
    <div className={`bg-white rounded-card border border-border border-l-4 ${c.border} p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-txt-secondary">{label}</p>
          <p className="text-3xl font-bold text-txt-primary mt-1">{value}</p>
        </div>
        <div className={`h-10 w-10 ${c.bg} rounded-card flex items-center justify-center`}>
          <Icon size={20} className={c.icon} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        {changeType === 'up' ? (
          <TrendingUp size={14} className="text-success" />
        ) : (
          <TrendingDown size={14} className="text-danger" />
        )}
        <span className={`text-xs font-semibold ${changeType === 'up' ? 'text-success' : 'text-danger'}`}>
          {change}
        </span>
        <span className="text-xs text-txt-muted">vs yesterday</span>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    inside: 'bg-success-50 text-success border-success/20',
    exited: 'bg-gray-100 text-txt-secondary border-gray-200',
    overstay: 'bg-danger-50 text-danger border-danger/20',
    coming: 'bg-warning-50 text-warning border-warning/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[status] || map.coming}`}>
      {status === 'overstay' && <span className="w-1.5 h-1.5 bg-danger rounded-full mr-1.5 animate-pulse" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-btn shadow-card px-3 py-2">
        <p className="text-xs font-semibold text-txt-primary">{label}</p>
        <p className="text-xs text-primary font-bold">{payload[0].value} visitors</p>
      </div>
    );
  }
  return null;
};

const AdminPanel = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">Dashboard</h1>
          <p className="text-sm text-txt-secondary mt-0.5">Real-time overview of your parking facility</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-txt-muted bg-white border border-border rounded-btn px-3 py-2">
          <Clock size={14} />
          <span className="font-medium">Today, {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Visitors Today" value="127" change="+12%" changeType="up" color="blue" />
        <StatCard icon={Car} label="Currently Inside" value="34" change="+8%" changeType="up" color="green" />
        <StatCard icon={ParkingSquare} label="Available Slots" value="48" change="-5%" changeType="down" color="amber" />
        <StatCard icon={AlertTriangle} label="Overstay Alerts" value="3" change="+2" changeType="up" color="red" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Visitor Trend */}
        <div className="bg-white rounded-card border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-txt-primary">Visitor Trend</h3>
            <span className="text-xs text-txt-muted font-medium bg-surface px-2 py-1 rounded">Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="visitors" stroke="#2563EB" strokeWidth={2} fill="url(#colorVisitors)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-card border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-txt-primary">Peak Hours</h3>
            <span className="text-xs text-txt-muted font-medium bg-surface px-2 py-1 rounded">Today</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={hourData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Visitors Table + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-card border border-border shadow-card">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-txt-primary">Recent Visitors</h3>
            <button className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left py-3 px-5 text-xs font-semibold text-txt-muted uppercase tracking-wider">Visitor</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-txt-muted uppercase tracking-wider">Vehicle</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-txt-muted uppercase tracking-wider">Flat</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-txt-muted uppercase tracking-wider">Time</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-txt-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentVisitors.map((v) => (
                  <tr key={v.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors duration-150">
                    <td className="py-3.5 px-5 font-medium text-txt-primary">{v.name}</td>
                    <td className="py-3.5 px-5 text-txt-secondary font-mono text-xs">{v.vehicle}</td>
                    <td className="py-3.5 px-5 text-txt-secondary">{v.flat}</td>
                    <td className="py-3.5 px-5 text-txt-secondary">{v.time}</td>
                    <td className="py-3.5 px-5"><StatusBadge status={v.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-card border border-border shadow-card p-5 flex flex-col gap-3">
          <h3 className="font-semibold text-txt-primary mb-1">Quick Actions</h3>
          <QuickAction icon={UserPlus} label="Add Visitor" desc="Register new visitor entry" color="primary" />
          <QuickAction icon={Eye} label="View All Visitors" desc="See complete visitor log" color="success" />
          <QuickAction icon={MapPin} label="Parking Map" desc="View real-time slot grid" color="warning" />
          <QuickAction icon={AlertTriangle} label="Overstay Alerts" desc="3 active alerts" color="danger" />
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, desc, color }) => {
  const colorMap = {
    primary: 'bg-primary-50 text-primary hover:bg-primary-100',
    success: 'bg-success-50 text-success hover:bg-success-100',
    warning: 'bg-warning-50 text-warning hover:bg-warning-100',
    danger: 'bg-danger-50 text-danger hover:bg-danger-100',
  };

  return (
    <button className={`w-full flex items-center gap-3 p-3 rounded-btn ${colorMap[color]} transition-all duration-200 text-left group`}>
      <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-white/60 flex-shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs opacity-70">{desc}</p>
      </div>
      <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

export default AdminPanel;
