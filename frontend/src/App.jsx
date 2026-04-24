import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import VisitorEntry from './pages/VisitorEntry';
import GuardScanner from './pages/GuardScanner';
import AdminPanel from './pages/AdminPanel';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      {/* Sidebar - Persistent on Desktop */}
      <aside className="sidebar glass">
        <div className="logo" style={{ padding: '0 20px' }}>
          <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>P</div>
          PARK.AI
        </div>

        <nav className="nav-menu" style={{ padding: '20px' }}>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </div>
          <div className={`nav-item ${activeTab === 'visitor' ? 'active' : ''}`} onClick={() => setActiveTab('visitor')}>
            👤 Visitor Mode
          </div>
          <div className={`nav-item ${activeTab === 'guard' ? 'active' : ''}`} onClick={() => setActiveTab('guard')}>
            🛂 Guard Mode
          </div>
          <div className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
            📈 Analytics
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
            {activeTab === 'dashboard' ? 'Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <div className="glass" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '20px' }}>
            🟢 Live
          </div>
        </header>

        <div className="container">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'visitor' && <VisitorEntry />}
          {activeTab === 'guard' && <GuardScanner />}
          {activeTab === 'admin' && <AdminPanel />}
        </div>
      </main>

      {/* Bottom Nav - Adaptive for Mobile */}
      <nav className="bottom-nav">
        <div className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <span style={{ fontSize: '1.5rem' }}>📊</span>
          <span>Feed</span>
        </div>
        <div className={`bottom-nav-item ${activeTab === 'visitor' ? 'active' : ''}`} onClick={() => setActiveTab('visitor')}>
          <span style={{ fontSize: '1.5rem' }}>👤</span>
          <span>Entry</span>
        </div>
        <div className={`bottom-nav-item ${activeTab === 'guard' ? 'active' : ''}`} onClick={() => setActiveTab('guard')}>
          <span style={{ fontSize: '1.5rem' }}>🛂</span>
          <span>Scan</span>
        </div>
        <div className={`bottom-nav-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
          <span style={{ fontSize: '1.5rem' }}>📈</span>
          <span>Stats</span>
        </div>
      </nav>
    </div>
  );
}


export default App;
