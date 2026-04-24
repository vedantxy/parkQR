import React from 'react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Visitors Today', value: '124', icon: '👥' },
    { label: 'Active QR Passes', value: '38', icon: '🎫' },
    { label: 'Parking Occupancy', value: '82%', icon: '🚗' },
    { label: 'Security Alerts', value: '0', icon: '🛡️' },
  ];

  return (
    <div className="dashboard-view">
      <div className="stat-grid">
        {stats.map((stat, i) => (
          <div key={i} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-card-title">{stat.label}</div>
                <div className="stat-card-value">{stat.value}</div>
              </div>
              <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
            </div>
            <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', marginTop: '16px' }}>
              <div style={{ width: '60%', height: '100%', background: 'var(--primary)', borderRadius: '2px' }}></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem' }}>Smart Parking Map (Real-time)</h3>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
               <span>🔵 Occupied</span>
               <span>⚪ Empty</span>
            </div>
          </div>
          
          <div className="visual-grid">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className={`visual-slot ${i < 18 ? 'occupied' : ''}`}>
                P-{String(i + 1).padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ background: 'var(--primary-light)', borderColor: 'var(--primary)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '20px' }}>System Control</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Quick Actions</div>
            <button className="btn btn-primary">➕ Register New Visitor</button>
            <button className="btn" style={{ background: 'white', border: '1px solid var(--primary)', color: 'var(--primary)' }}>🖨️ Batch Print QR</button>
            
            <div style={{ marginTop: '20px', padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Insights</div>
              <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>
                Traffic optimization active. Peak exit period starting in <strong>15 mins</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
