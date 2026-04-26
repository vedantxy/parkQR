import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, UserPlus, Clock, Search, Filter,
  ChevronDown, Eye, X, Car, Phone, Calendar,
  CheckCircle, AlertCircle, ArrowRight
} from 'lucide-react';
import ParkingMap from '../components/ParkingMap';

const myVisitors = [
  { id: 1, name: 'Rahul Sharma', phone: '9876543210', vehicle: 'MH 02 AB 1234', date: '2026-04-26', time: '10:30 AM', status: 'inside', duration: '45 min' },
  { id: 2, name: 'Priya Patel', phone: '9876543211', vehicle: 'MH 04 CD 5678', date: '2026-04-26', time: '09:15 AM', status: 'exited', duration: '1h 20m' },
  { id: 3, name: 'Amit Kumar', phone: '9876543212', vehicle: 'MH 01 EF 9012', date: '2026-04-25', time: '02:45 PM', status: 'exited', duration: '55 min' },
  { id: 4, name: 'Neha Singh', phone: '9876543213', vehicle: 'MH 03 GH 3456', date: '2026-04-25', time: '11:00 AM', status: 'exited', duration: '2h 10m' },
  { id: 5, name: 'Ravi Joshi', phone: '9876543214', vehicle: 'MH 12 IJ 7890', date: '2026-04-24', time: '04:30 PM', status: 'exited', duration: '35 min' },
  { id: 6, name: 'Sonia Malhotra', phone: '9876543215', vehicle: 'DL 01 XY 5555', date: '2026-04-24', time: '01:00 PM', status: 'exited', duration: '1h 45m' },
];

const UserDashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const activeVisitors = myVisitors.filter(v => v.status === 'inside');

  const filtered = myVisitors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-card border border-border shadow-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-primary-50 text-primary rounded-2xl flex items-center justify-center text-xl font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-txt-primary">Welcome back, {user?.name || 'User'}!</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-txt-secondary flex items-center gap-1">
                  <Home size={14} /> Flat A-401
                </span>
                <span className="text-sm text-txt-muted">•</span>
                <span className="text-sm text-txt-secondary capitalize">{user?.role || 'Resident'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-600 text-white font-semibold rounded-btn shadow-sm hover:shadow-md transition-all duration-200"
          >
            <UserPlus size={16} /> Quick Invite
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MiniStat icon={Users} label="Total Visitors" value={myVisitors.length} color="primary" />
        <MiniStat icon={CheckCircle} label="Currently Inside" value={activeVisitors.length} color="success" />
        <MiniStat icon={Clock} label="This Month" value={myVisitors.filter(v => v.date >= '2026-04-01').length} color="warning" />
      </div>

      {/* Active Visitors */}
      {activeVisitors.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-txt-primary mb-3">Currently Inside</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeVisitors.map(v => (
              <div key={v.id} className="bg-white rounded-card border-2 border-success/20 shadow-card p-4 flex items-center gap-4">
                <div className="h-11 w-11 bg-success-50 rounded-full flex items-center justify-center">
                  <Car size={18} className="text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-txt-primary">{v.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs font-mono text-primary">{v.vehicle}</span>
                    <span className="text-xs text-txt-muted flex items-center gap-1">
                      <Clock size={10} /> {v.duration}
                    </span>
                  </div>
                </div>
                <span className="bg-success-50 text-success text-xs font-semibold px-2.5 py-1 rounded-full border border-success/20">
                  Inside
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visit History */}
      <div className="bg-white rounded-card border border-border shadow-card">
        <div className="p-5 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-txt-primary">Visit History</h2>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search visitors..."
                  className="h-9 bg-surface border border-border rounded-btn pl-8 pr-3 text-sm w-48 outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all"
                />
              </div>
              {/* Filter */}
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="h-9 bg-surface border border-border rounded-btn px-3 text-sm text-txt-secondary outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="inside">Inside</option>
                <option value="exited">Exited</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left py-3 px-5 text-xs font-semibold text-txt-muted uppercase tracking-wider">Visitor</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-txt-muted uppercase tracking-wider">Vehicle</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-txt-muted uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-txt-muted uppercase tracking-wider">Duration</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-txt-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(v => (
                <tr key={v.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors duration-150">
                  <td className="py-3 px-5">
                    <p className="font-medium text-txt-primary">{v.name}</p>
                    <p className="text-xs text-txt-muted">{v.phone}</p>
                  </td>
                  <td className="py-3 px-5 font-mono text-xs text-primary">{v.vehicle}</td>
                  <td className="py-3 px-5 text-txt-secondary hidden sm:table-cell">
                    <span className="text-xs">{v.date} · {v.time}</span>
                  </td>
                  <td className="py-3 px-5 text-txt-secondary text-xs">{v.duration}</td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border
                      ${v.status === 'inside'
                        ? 'bg-success-50 text-success border-success/20'
                        : 'bg-gray-100 text-txt-secondary border-gray-200'
                      }`}
                    >
                      {v.status === 'inside' && <span className="w-1.5 h-1.5 bg-success rounded-full mr-1.5" />}
                      {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between">
            <p className="text-xs text-txt-muted">
              Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-8 w-8 rounded-btn text-sm font-medium transition-colors
                    ${currentPage === i + 1 ? 'bg-primary text-white' : 'text-txt-secondary hover:bg-surface-hover'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty */}
        {paginated.length === 0 && (
          <div className="p-12 text-center">
            <Users size={32} className="text-txt-muted mx-auto mb-3" />
            <h3 className="font-semibold text-txt-primary mb-1">No visitors found</h3>
            <p className="text-sm text-txt-muted">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* 🗺️ Google Maps Integration */}
      <div className="bg-white rounded-card border border-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-txt-primary flex items-center gap-2">
              Parking Navigation
            </h3>
            <p className="text-sm text-txt-secondary mt-0.5">Find your way and check live slot availability</p>
          </div>
        </div>
        <ParkingMap 
          availableSlots={32 - activeVisitors.length} 
          occupiedSlots={activeVisitors.length} 
        />
      </div>

      {/* Quick Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-2xl shadow-modal border border-border w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-txt-primary">Quick Invite</h3>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="p-1.5 hover:bg-surface rounded-btn transition-colors"
                  >
                    <X size={18} className="text-txt-muted" />
                  </button>
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowInviteModal(false); }}>
                  <ModalField icon={UserPlus} label="Visitor Name" placeholder="Enter name" />
                  <ModalField icon={Phone} label="Phone" placeholder="10-digit number" type="tel" />
                  <ModalField icon={Car} label="Vehicle Number" placeholder="MH 02 AB 1234" />
                  <ModalField icon={Calendar} label="Expected Time" placeholder="e.g. 3:00 PM" />
                  <button
                    type="submit"
                    className="w-full h-11 bg-primary hover:bg-primary-600 text-white font-semibold rounded-btn transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <UserPlus size={16} /> Send Invite
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

const MiniStat = ({ icon: Icon, label, value, color }) => {
  const colorMap = {
    primary: 'bg-primary-50 text-primary border-primary/10',
    success: 'bg-success-50 text-success border-success/10',
    warning: 'bg-warning-50 text-warning border-warning/10',
  };

  return (
    <div className={`${colorMap[color]} border rounded-card p-4 flex items-center gap-3`}>
      <Icon size={20} />
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs opacity-70 font-medium">{label}</p>
      </div>
    </div>
  );
};

const ModalField = ({ icon: Icon, label, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-txt-secondary mb-1.5">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" size={16} />
      <input
        type={type}
        placeholder={placeholder}
        className="w-full h-10 bg-surface border border-border rounded-btn pl-10 pr-3 text-sm text-txt-primary placeholder:text-txt-muted outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all"
      />
    </div>
  </div>
);

export default UserDashboard;
