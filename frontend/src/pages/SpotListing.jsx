import React from 'react';

const SpotListing = () => {
  const mockSpots = [
    { name: 'Skyline Plaza Parking', dist: '0.2 mi', price: '₹80/hr', status: 'semantic-green', ai: '98% likely' },
    { name: 'Downtown Central', dist: '0.5 mi', price: '₹120/hr', status: 'semantic-amber', ai: '85% likely' },
    { name: 'North Station Garage', dist: '1.1 mi', price: '₹60/hr', status: 'semantic-green', ai: '95% likely' },
    { name: 'Premium Hub B1', dist: '0.1 mi', price: '₹200/hr', status: 'semantic-red', ai: '40% likely' },
  ];

  return (
    <div className="split-view">
      {/* 40% Listing Column */}
      <div className="listing-column">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', margin: 0 }}>4 Parking Spots Nearby</h2>
          <div style={{ fontSize: '12px', color: 'rgba(10,22,40,0.5)' }}>Sorted by AI Recommended</div>
        </div>

        <div className="listing-grid">
          {mockSpots.map((spot, i) => (
            <div key={i} className="listing-card card" style={{ padding: '16px', marginBottom: '12px', borderRadius: '12px' }}>
              <div style={{ width: '80px', height: '80px', background: '#eee', borderRadius: '8px' }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{spot.name}</div>
                  <div style={{ fontWeight: 800 }}>{spot.price}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '13px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--${spot.status})` }}></div>
                  <span style={{ color: 'rgba(10,22,40,0.6)' }}>{spot.dist} away</span>
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <span className="pill" style={{ background: '#f0fffd', color: 'var(--ai-teal)', border: '1px solid var(--ai-teal)', fontSize: '10px' }}>
                    🤖 {spot.ai} available
                  </span>
                  <span style={{ fontSize: '14px' }}>🔌 🛡️ 📹</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 60% Map Column */}
      <div className="map-column">
        <img 
          src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.4194,37.7749,14,0/1200x800?access_token=pk.eyJ1IjoiYm90IiwiYSI6ImNrYmtkYndrcjAwZm0yc3BiazN0bWF0bDEifQ.dummy" 
          alt="Map View"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};

export default SpotListing;
