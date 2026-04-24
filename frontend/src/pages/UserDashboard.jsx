import React from 'react';

const UserDashboard = () => {
  return (
    <div className="dashboard-container" style={{ display: 'grid', gridTemplateColumns: '240px 1fr 300px', height: '100vh', background: 'var(--bg-warm)' }}>
      
      {/* 1. Sidebar Nav */}
      <aside style={{ background: 'var(--brand-navy)', color: 'white', padding: '32px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--ai-teal)', marginBottom: '16px' }}></div>
          <div style={{ fontWeight: 800 }}>Vedant Sharma</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Pro Member</div>
        </div>

        <nav style={{ display: 'flex', flexDirection: column, gap: '16px' }}>
          <div style={{ fontWeight: 600, color: 'var(--ai-teal)' }}>Dashboard</div>
          <div>My Bookings</div>
          <div>Payment Methods</div>
          <div>Rewards (2,450 pts)</div>
          <div style={{ marginTop: '40px', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Account Settings</div>
        </nav>
      </aside>

      {/* 2. Main Content */}
      <main style={{ padding: '40px', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '32px' }}>Welcome back, Vedant</h1>

        <div className="metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Monthly Spend', val: '₹2,450' },
            { label: 'Hours Parked', val: '42h' },
            { label: 'CO₂ Saved', val: '12kg' },
            { label: 'Loyalty Level', val: 'Gold' }
          ].map(m => (
            <div key={m.label} className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(10,22,40,0.5)', marginBottom: '4px' }}>{m.label}</div>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>{m.val}</div>
            </div>
          ))}
        </div>

        <div className="upcoming-booking card" style={{ padding: '32px', marginBottom: '32px', background: 'linear-gradient(135deg, #0A1628 0%, #1a2f4a 100%)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="pill" style={{ background: 'var(--ai-teal)', color: 'var(--brand-navy)', marginBottom: '16px' }}>UPCOMING</div>
              <h2 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>Skyline Plaza Parking</h2>
              <div style={{ color: 'rgba(255,255,255,0.7)' }}>Floor 2, Slot #42</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>14:30</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Today, 24 April</div>
            </div>
          </div>
          <button className="btn btn-teal" style={{ marginTop: '24px', width: '100%' }}>STRIKE NAVIGATE</button>
        </div>
      </main>

      {/* 3. Quick Actions Panel */}
      <aside style={{ padding: '40px', borderLeft: '1px solid var(--border)', background: 'white' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '24px' }}>Quick Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="btn" style={{ justifyContent: 'flex-start', border: '1px solid var(--border)', width: '100%' }}>📄 Download Invoice</button>
          <button className="btn" style={{ justifyContent: 'flex-start', border: '1px solid var(--border)', width: '100%' }}>🔄 Book Again</button>
          <button className="btn" style={{ justifyContent: 'flex-start', border: '1px solid var(--border)', width: '100%' }}>⚠️ Report Issue</button>
        </div>

        <div style={{ marginTop: '60px' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '16px', color: 'rgba(10,22,40,0.5)' }}>AI Suggestion</h3>
          <div className="card" style={{ padding: '16px', background: '#f0fffd', borderColor: 'var(--ai-teal)' }}>
            <div style={{ fontSize: '13px' }}>Reserved spots at <strong>North Station</strong> are 20% cheaper this weekend. Want to book?</div>
          </div>
        </div>
      </aside>

    </div>
  );
};

export default UserDashboard;
