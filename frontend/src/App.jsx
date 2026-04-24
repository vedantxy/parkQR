import React from 'react';
import VisitorEntry from './pages/VisitorEntry';
import './index.css';

function App() {
  return (
    <div className="App">
      <header style={{ 
        padding: '20px', 
        textAlign: 'center', 
        fontSize: '1.2rem', 
        fontWeight: 'bold',
        color: '#6366f1',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        Smart Parking & Visitor Management System
      </header>
      
      <main>
        <VisitorEntry />
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
