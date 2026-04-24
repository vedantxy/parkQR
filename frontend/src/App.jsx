import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import VisitorEntry from './pages/VisitorEntry';
import GuardScanner from './pages/GuardScanner';
import AdminPanel from './pages/AdminPanel';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'visitors', label: 'Visitors', icon: '👤' },
    { id: 'scanner', label: 'Scanner', icon: '🛂' },
    { id: 'logs', label: 'Audit Logs', icon: '📑' },
  ];

  return (
    <div className="app-container">
      {/* Sidebar - Desktop Navigation */}
      <aside className="sidebar">
        <div className="brand-ident">
          <div className="brand-dot"></div>
          ParkSmart
        </div>

        <nav className="nav-group">
          {navItems.map((item) => (
            <div 
              key={item.id}
              className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '16px', background: 'var(--bg-main)', borderRadius: '12px', fontSize: '0.75rem' }}>
          <div style={{ fontWeight: 700, color: 'var(--primary)' }}>System Online</div>
          <div style={{ color: 'var(--text-muted)' }}>Enterprise v4.2.0</div>
        </div>
      </aside>

      {/* Main Feature Content */}
      <main className="main-content">
        <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {navItems.find(i => i.id === activeTab).label}
          </h1>
          <div className="card" style={{ padding: '8px 16px', fontSize: '0.875rem', fontWeight: 600 }}>
            Terminal ID: GATE-01
          </div>
        </header>

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'visitors' && <VisitorEntry />}
        {activeTab === 'scanner' && <GuardScanner />}
        {activeTab === 'logs' && <AdminPanel />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        {navItems.map((item) => (
          <div 
            key={item.id}
            className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            style={{ flexDirection: 'column', fontSize: '0.6rem', padding: '8px' }}
          >
            <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>
    </div>
  );
}

export default App;
