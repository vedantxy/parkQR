import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, BellOff, Check, CheckCheck, LogIn, LogOut as LogOutIcon,
  AlertTriangle, Clock, Trash2, Filter, MailOpen, Activity, ShieldAlert
} from 'lucide-react';

const mockNotifications = [
  {
    id: 1, type: 'entry', read: false,
    title: 'VISITOR AUTHENTICATED',
    message: 'Rahul Sharma (MH 02 AB 1234) authorized at Gate Alpha',
    time: '2 MIN AGO', timestamp: Date.now() - 120000,
  },
  {
    id: 2, type: 'overstay', read: false,
    title: 'DURATION BREACH',
    message: 'Vehicle MH 04 CD 5678 at P-12 exceeded 120min threshold',
    time: '8 MIN AGO', timestamp: Date.now() - 480000,
  },
  {
    id: 3, type: 'exit', read: false,
    title: 'VISITOR DEPARTURE',
    message: 'Priya Patel (MH 01 EF 9012) confirmed exit from Gate Bravo',
    time: '15 MIN AGO', timestamp: Date.now() - 900000,
  },
  {
    id: 4, type: 'entry', read: true,
    title: 'VIP PRIORITY ENTRY',
    message: 'Amit Kumar (DL 01 XY 7890) assigned Premium Bay P-01',
    time: '32 MIN AGO', timestamp: Date.now() - 1920000,
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

  const typeConfig = {
    entry: { icon: LogIn, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', label: 'AUTH' },
    exit: { icon: LogOutIcon, color: 'text-[var(--accent)]', bg: 'bg-[var(--accent)]/10', border: 'border-[var(--accent)]/20', label: 'EXIT' },
    overstay: { icon: ShieldAlert, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20', label: 'ALERT' },
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[var(--txt-primary)] tracking-tighter uppercase mb-2">
            NEURAL<span className="text-[var(--accent)]"> ALERTS</span>
            {unreadCount > 0 && (
              <span className="ml-4 h-8 w-8 bg-danger text-white text-[10px] font-black rounded-full inline-flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-[10px] font-bold text-[var(--txt-secondary)] uppercase tracking-[0.4em] opacity-60">
            Real-time Security Intelligence
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <button onClick={markAllRead} className="h-12 px-8 bg-[var(--surface)] border border-[var(--border)] rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-[var(--bg)] transition-all shadow-xl flex items-center gap-2">
              <CheckCheck size={14} /> Mark Read
           </button>
        </div>
      </div>

      {/* Filter Engine */}
      <div className="flex items-center gap-4 bg-[var(--surface)] p-2 rounded-[24px] border border-[var(--border)] shadow-xl overflow-x-auto">
        {['all', 'unread', 'entry', 'exit', 'overstay'].map(f => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap
              ${filterType === f 
                ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' 
                : 'text-[var(--txt-secondary)] hover:bg-[var(--bg)]'
              }`}
          >
            {f === 'all' ? 'System Log' : f}
          </button>
        ))}
      </div>

      {/* Alert Stream */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            notifications.filter(n => {
              if (filterType === 'unread') return !n.read;
              if (filterType === 'all') return true;
              return n.type === filterType;
            }).map((n) => {
              const config = typeConfig[n.type];
              const Icon = config.icon;

              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`bg-[var(--surface)] rounded-[24px] border-2 p-6 flex items-center gap-6 group transition-all
                    ${n.read ? 'border-[var(--border)] opacity-60' : `border-[var(--accent)]/20 shadow-lg`}`}
                >
                  <div className={`h-14 w-14 ${config.bg} rounded-2xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110 shadow-inner`}>
                    <Icon size={24} className={config.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-sm font-black text-[var(--txt-primary)] uppercase tracking-tight">
                        {n.title}
                      </h4>
                      {!n.read && <div className="h-1.5 w-1.5 bg-[var(--accent)] rounded-full shadow-[0_0_8px_rgba(var(--accent-rgb),1)]" />}
                    </div>
                    <p className="text-[11px] font-bold text-[var(--txt-secondary)] uppercase tracking-tighter leading-relaxed">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                       <div className="flex items-center gap-1.5 opacity-40">
                          <Clock size={12} />
                          <span className="text-[9px] font-black">{n.time}</span>
                       </div>
                       <span className={`text-[8px] font-black px-3 py-1 rounded-full border ${config.bg} ${config.color} border-current/20`}>
                          {config.label}
                       </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    {!n.read && (
                      <button onClick={() => markAsRead(n.id)} className="h-10 w-10 bg-[var(--bg)] rounded-xl flex items-center justify-center hover:text-success transition-all border border-[var(--border)]">
                        <Check size={16} />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n.id)} className="h-10 w-10 bg-[var(--bg)] rounded-xl flex items-center justify-center hover:text-danger transition-all border border-[var(--border)]">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="bg-[var(--surface)] rounded-[40px] border-2 border-dashed border-[var(--border)] p-20 text-center opacity-40">
              <Activity size={48} className="text-[var(--txt-secondary)] mx-auto mb-6 animate-pulse" />
              <h3 className="text-sm font-black text-[var(--txt-primary)] uppercase tracking-widest mb-2">Network Quiet</h3>
              <p className="text-[10px] text-[var(--txt-secondary)] uppercase tracking-tighter">No active threats or authorizations detected</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationsPage;
