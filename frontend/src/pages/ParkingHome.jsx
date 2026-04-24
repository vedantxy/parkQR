import React, { useState, useEffect } from 'react';

const ParkingHome = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* 56px Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.5px', marginRight: '40px' }}>
          PARKING <span style={{ color: 'var(--ai-teal)' }}>AI</span>
        </div>
        
        <div className="nav-links" style={{ display: 'flex', gap: '24px', flex: 1 }}>
          <a href="#">Find Parking</a>
          <a href="#">How It Works</a>
          <a href="#">For Business</a>
          <a href="#">Pricing</a>
        </div>

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button className="btn btn-teal pill" onClick={() => setIsChatOpen(true)}>ASK AI</button>
          <div style={{ color: 'var(--border)', height: '20px', width: '1px', background: 'currentColor' }}></div>
          <span>Login</span>
          <div className="avatar" style={{ width: 32, height: 32, borderRadius: '50%', background: '#eee' }}></div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        {/* Map Background (Interactive Simulation) */}
        <div className="map-bg">
          <img 
            src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.4194,37.7749,12,0/1200x800?access_token=pk.eyJ1IjoiYm90IiwiYSI6ImNrYmtkYndrcjAwZm0yc3BiazN0bWF0bDEifQ.dummy" 
            alt="Map" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          />
        </div>

        {/* Floating Search Card */}
        <div className="search-container">
          <div className="floating-search-card">
            <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>Where would you like to park?</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div className="input-group">
                <input type="text" placeholder="Location or Venue" style={{ width: '100%', height: '40px', padding: '0 12px', border: '1px solid var(--border)', borderRadius: '8px' }} />
              </div>
              <div className="input-group">
                <input type="text" placeholder="Time Frame" style={{ width: '100%', height: '40px', padding: '0 12px', border: '1px solid var(--border)', borderRadius: '8px' }} />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', color: 'rgba(10,22,40,0.5)', marginBottom: '8px' }}>AI Recommended Activity</div>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Ask AI: find covered parking near airport under ₹100/hr" 
                  style={{ width: '100%', height: '44px', padding: '0 40px 0 12px', border: '1px solid var(--ai-teal)', borderRadius: '89px', background: '#f0fffd' }} 
                />
                <span style={{ position: 'absolute', right: '16px', top: '12px' }}>🪄</span>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', height: '48px', borderRadius: '12px' }}>SEARCH PARKING</button>
          </div>
        </div>
      </section>

      {/* AI Assistant Panel */}
      <div className={`chat-drawer ${isChatOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="pulse"></div>
            <strong style={{ fontSize: '14px' }}>Parking AI</strong>
          </div>
          <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
        
        <div className="chat-body" style={{ flex: 1, padding: '20px', background: 'var(--bg-warm)' }}>
          <div className="ai-bubble" style={{ background: 'var(--ai-teal)', color: 'var(--brand-navy)', padding: '12px', borderRadius: '12px 12px 12px 0', maxWidth: '85%', fontSize: '13px', marginBottom: '16px' }}>
            Hi! I'm your AI Parking Assistant. I can help you find the best spot based on price, safety, and distance. What are you looking for?
          </div>
          
          <div className="chips" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Cheapest near me', 'Open 24hrs', 'EV Charging'].map(chip => (
              <div key={chip} style={{ background: 'white', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', border: '1px solid var(--border)', cursor: 'pointer' }}>{chip}</div>
            ))}
          </div>
        </div>

        <div className="chat-footer" style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
          <input type="text" placeholder="Ask anything..." style={{ width: '100%', height: '40px', border: 'none', background: '#f5f5f5', borderRadius: '8px', padding: '0 12px' }} />
        </div>
      </div>
    </div>
  );
};

export default ParkingHome;
