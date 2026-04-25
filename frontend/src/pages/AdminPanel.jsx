import React, { useState, useEffect } from 'react';
import ParkingGrid from '../components/ParkingGrid';
import NotificationList from '../components/NotificationList';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import socket from '../utils/socket';
import { LayoutDashboard, Shield, BarChart3, Settings, MapPin } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('monitor');
  const [activeGate, setActiveGate] = useState('Gate A');
  const [toasts, setToasts] = useState([]);

  // Multi-Gate Definition
  const gates = ['Gate A', 'Gate B', 'Main Entrance'];

  useEffect(() => {
    // 1. Listen for real-time security events
    socket.on('visitor-entered', (data) => addToast(`${data.visitor} entered at ${data.slot}`, 'success'));
    socket.on('visitor-overstayed', (data) => addToast(`SECURITY ALERT: Overstay at ${data.slotId}`, 'error'));
    socket.on('visitor-exited', (data) => addToast(`${data.visitor} cleared the gate`, 'primary'));

    return () => {
        socket.off('visitor-entered');
        socket.off('visitor-overstayed');
        socket.off('visitor-exited');
    };
  }, []);

  const addToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  return (
    <div className="admin-saas-container animate-in">
      {/* Toast Manager */}
      <div className="toast-container">
        {toasts.map(t => (
            <div key={t.id} className={`toast toast-${t.type} animate-in`}>
                {t.message}
            </div>
        ))}
      </div>

      {/* SaaS Header & Gate Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Command Center</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time monitoring & AI automation</p>
        </div>
        
        <div className="glass" style={{ display: 'flex', padding: '4px', borderRadius: '12px' }}>
            {gates.map(g => (
                <button 
                   key={g} 
                   onClick={() => setActiveGate(g)}
                   style={{
                       padding: '8px 16px',
                       background: activeGate === g ? 'var(--primary)' : 'transparent',
                       color: activeGate === g ? 'white' : 'var(--text-main)',
                       border: 'none',
                       borderRadius: '8px',
                       fontSize: '0.8rem',
                       fontWeight: 700,
                       cursor: 'pointer',
                       transition: 'all 0.2s'
                   }}
                >
                    <MapPin size={14} style={{ marginRight: '4px' }} /> {g}
                </button>
            ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', borderBottom: '1px solid var(--border-color)' }}>
         <Tab title="Live Monitor" icon={<Shield size={18} />} active={activeTab === 'monitor'} onClick={() => setActiveTab('monitor')} />
         <Tab title="Analytics" icon={<BarChart3 size={18} />} active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
         <Tab title="Control Tower" icon={<LayoutDashboard size={18} />} active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
         <Tab title="Settings" icon={<Settings size={18} />} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'monitor' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                <div className="glass" style={{ padding: '24px' }}>
                    <ParkingGrid gate={activeGate} />
                </div>
                <div className="glass" style={{ padding: '24px' }}>
                    <NotificationList />
                </div>
            </div>
        )}
        
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        
        {activeTab === 'logs' && (
            <div className="glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Advanced Log Analysis coming in Phase 14...
            </div>
        )}
      </div>

      <style>{`
        .tab-btn {
            padding: 12px 12px 12px 0;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            color: var(--text-muted);
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
            font-weight: 600;
        }
        .tab-btn.active {
            color: var(--primary);
            border-bottom-color: var(--primary);
        }
        .toast-container {
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 2000;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .toast {
            padding: 16px 24px;
            border-radius: 12px;
            background: white;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            border-left: 6px solid var(--primary);
            font-weight: 700;
            min-width: 300px;
        }
        .toast-success { border-left-color: var(--success); }
        .toast-error { border-left-color: var(--error); background: #fef2f2; color: #991b1b; }
      `}</style>
    </div>
  );
};

const Tab = ({ title, icon, active, onClick }) => (
    <div className={`tab-btn ${active ? 'active' : ''}`} onClick={onClick}>
        {icon}
        {title}
    </div>
);

export default AdminPanel;
