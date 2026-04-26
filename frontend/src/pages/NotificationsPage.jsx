import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, BellOff, Check, CheckCheck, LogIn, LogOut as LogOutIcon,
  AlertTriangle, Clock, Trash2, Filter, MailOpen
} from 'lucide-react';

const mockNotifications = [
  {
    id: 1, type: 'entry', read: false,
    title: 'Visitor Entry',
    message: 'Rahul Sharma (MH 02 AB 1234) entered via Main Gate',
    time: '2 min ago', timestamp: Date.now() - 120000,
  },
  {
    id: 2, type: 'overstay', read: false,
    title: 'Overstay Alert',
    message: 'Vehicle MH 04 CD 5678 at slot P-12 has exceeded 2 hours',
    time: '8 min ago', timestamp: Date.now() - 480000,
  },
  {
    id: 3, type: 'exit', read: false,
    title: 'Visitor Exit',
    message: 'Priya Patel (MH 01 EF 9012) exited from North Gate',
    time: '15 min ago', timestamp: Date.now() - 900000,
  },
  {
    id: 4, type: 'entry', read: true,
    title: 'VIP Visitor Entry',
    message: 'Amit Kumar (DL 01 XY 7890) entered via Main Gate - VIP Priority',
    time: '32 min ago', timestamp: Date.now() - 1920000,
  },
  {
    id: 5, type: 'overstay', read: true,
    title: 'Overstay Resolved',
    message: 'Vehicle MH 03 GH 3456 has exited slot P-05 (overstayed by 45 min)',
    time: '1 hour ago', timestamp: Date.now() - 3600000,
  },
  {
    id: 6, type: 'exit', read: true,
    title: 'Visitor Exit',
    message: 'Neha Singh (KA 05 MN 2345) exited from East Gate',
    time: '2 hours ago', timestamp: Date.now() - 7200000,
  },
  {
    id: 7, type: 'entry', read: true,
    title: 'Visitor Entry',
    message: 'Ravi Joshi (MH 12 IJ 7890) entered via Service Gate',
    time: '3 hours ago', timestamp: Date.now() - 10800000,
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filterType, setFilterType] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filtered = notifications.filter(n => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'entry') return n.type === 'entry';
    if (filterType === 'exit') return n.type === 'exit';
    if (filterType === 'overstay') return n.type === 'overstay';
    return true;
  });

  const typeConfig = {
    entry: { icon: LogIn, color: 'text-success', bg: 'bg-success-50', border: 'border-success/20', label: 'Entry' },
    exit: { icon: LogOutIcon, color: 'text-primary', bg: 'bg-primary-50', border: 'border-primary/20', label: 'Exit' },
    overstay: { icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger-50', border: 'border-danger/20', label: 'Overstay' },
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: `Unread (${unreadCount})` },
    { id: 'entry', label: 'Entry' },
    { id: 'exit', label: 'Exit' },
    { id: 'overstay', label: 'Overstay' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-danger text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-txt-secondary mt-0.5">Stay updated with real-time alerts</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-btn text-sm font-medium text-txt-secondary hover:bg-surface-hover transition-all duration-200"
          >
            <CheckCheck size={14} /> Mark all as read
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-card border border-border shadow-card p-3 flex items-center gap-2 overflow-x-auto">
        <Filter size={16} className="text-txt-muted flex-shrink-0 ml-1" />
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-btn text-xs font-medium transition-all duration-200 whitespace-nowrap
              ${filterType === f.id
                ? 'bg-primary text-white'
                : 'text-txt-secondary hover:bg-surface-hover'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.length > 0 ? (
            filtered.map((n) => {
              const config = typeConfig[n.type];
              const Icon = config.icon;

              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-white rounded-card border shadow-card p-4 flex items-start gap-4 transition-all duration-200 group
                    ${n.read ? 'border-border' : `border-l-4 ${config.border} border-t border-r border-b border-border`}`}
                >
                  {/* Icon */}
                  <div className={`h-10 w-10 ${config.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={config.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className={`text-sm font-semibold ${n.read ? 'text-txt-secondary' : 'text-txt-primary'}`}>
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className={`text-sm ${n.read ? 'text-txt-muted' : 'text-txt-secondary'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Clock size={12} className="text-txt-muted" />
                      <span className="text-xs text-txt-muted">{n.time}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${config.bg} ${config.color} ml-2`}>
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="p-1.5 hover:bg-surface rounded-btn transition-colors"
                        title="Mark as read"
                      >
                        <Check size={14} className="text-txt-muted" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="p-1.5 hover:bg-danger-50 rounded-btn transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} className="text-txt-muted hover:text-danger" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-card border border-border shadow-card p-12 text-center"
            >
              <div className="h-16 w-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BellOff size={28} className="text-txt-muted" />
              </div>
              <h3 className="font-semibold text-txt-primary mb-1">No Notifications</h3>
              <p className="text-sm text-txt-muted mb-4">You're all caught up! New alerts will appear here.</p>
              <button
                onClick={() => setFilterType('all')}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-btn hover:bg-primary-600 transition-colors"
              >
                <MailOpen size={14} className="inline mr-1.5" />
                View All
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationsPage;
