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
      <aside className="sidebar">
        <div className="logo">
          <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>P</div>
          PARK.AI
        </div>

        <nav className="nav-menu">
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


        <div style={{ marginTop: 'auto', padding: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          v2.4.0 High-End Build
        </div>
      </aside>

      <main className="main-content">
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="glass" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            System Status: 🟢 Optimal
          </div>
        </header>

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'visitor' && <VisitorEntry />}
        {activeTab === 'guard' && <GuardScanner />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

    </div>
  );
}


export default App;
