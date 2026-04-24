import React, { useState } from 'react';
import VisitorEntry from './pages/VisitorEntry';
import GuardScanner from './pages/GuardScanner';
import './index.css';

function App() {
  const [mode, setMode] = useState('visitor'); // 'visitor' or 'guard'

  return (
    <div className="App">
      <header>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6366f1' }}>
          Smart Parking System
        </div>
        <div className="nav-toggle">
          <button 
            className={mode === 'visitor' ? 'active' : ''} 
            onClick={() => setMode('visitor')}
          >
            Visitor Mode
          </button>
          <button 
            className={mode === 'guard' ? 'active' : ''} 
            onClick={() => setMode('guard')}
          >
            Guard Mode
          </button>
        </div>
      </header>
      
      <main>
        {mode === 'visitor' ? <VisitorEntry /> : <GuardScanner />}
      </main>


      <footer style={{ 
        textAlign: 'center', 
        padding: '20px', 
        fontSize: '0.8rem', 
        color: '#94a3b8' 
      }}>
        &copy; 2026 AI Parking Solutions. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
