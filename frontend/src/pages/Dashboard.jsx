import React from 'react';

const Dashboard = () => {
  const stats = [
    { label: 'Available Slots', value: '42', color: 'var(--success)' },
    { label: 'Active Visitors', value: '18', color: 'var(--primary)' },
    { label: 'Occupancy Rate', value: '76%', color: 'var(--warning)' },
  ];

  return (
    <div className="dashboard-content">
      <div className="ai-suggestion">
        🤖 Smart System: Parking occupancy expected to peak in 2 hours. Suggest reserving slots for expected deliveries.
      </div>

      <div className="dashboard-grid">
        {stats.map((stat, i) => (
          <div key={i} className="glass stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
            <div style={{ height: '4px', width: '40%', background: stat.color, borderRadius: '2px' }}></div>
          </div>
        ))}
      </div>

      <div className="parking-container">
        <h3>Live Parking Map</h3>
        <div className="glass parking-grid">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i} 
              className={`parking-slot ${i % 3 === 0 ? 'slot-occupied' : i % 7 === 0 ? 'slot-reserved' : 'slot-available'}`}
              title={`Slot ${i + 1}`}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
