import React from 'react';

const AdminPanel = () => {
  const logs = [
    { name: 'Sameer Khan', flat: 'B-102', time: '10:45 AM', status: 'Inside', type: 'Visitor' },
    { name: 'Anjali Rao', flat: 'C-504', time: '09:30 AM', status: 'Exited', type: 'Delivery' },
    { name: 'Kevin Piet', flat: 'A-201', time: '08:15 AM', status: 'Inside', type: 'Guest' },
    { name: 'Zoya Ahmed', flat: 'D-303', time: '07:45 AM', status: 'Exited', type: 'Guest' },
  ];

  return (
    <div className="admin-panel">
      <div className="dashboard-grid">
        <div className="glass stat-card">
          <div className="stat-label">Total Monthly Visitors</div>
          <div className="stat-value">1,284</div>
          <div style={{ color: 'var(--success)', fontSize: '0.8rem' }}>+12% from last month</div>
        </div>
        <div className="glass stat-card">
          <div className="stat-label">Peak Hour</div>
          <div className="stat-value">6:00 PM</div>
          <div style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>Average 45 entries/hr</div>
        </div>
      </div>

      <div className="glass" style={{ marginTop: '30px', padding: '30px', overflowX: 'auto' }}>
        <h3>Activity Logs</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '15px' }}>Visitor</th>
              <th style={{ padding: '15px' }}>Destination</th>
              <th style={{ padding: '15px' }}>Check-in</th>
              <th style={{ padding: '15px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '15px' }}>
                  <div style={{ fontWeight: '600' }}>{log.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.type}</div>
                </td>
                <td style={{ padding: '15px' }}>{log.flat}</td>
                <td style={{ padding: '15px' }}>{log.time}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    background: log.status === 'Inside' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                    color: log.status === 'Inside' ? 'var(--success)' : 'var(--text-muted)',
                    border: `1px solid ${log.status === 'Inside' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)'}`
                  }}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
