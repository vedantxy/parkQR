import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import BookingPage from './pages/BookingPage';
import VisitorEntry from './pages/VisitorEntry';
import GuardScanner from './pages/GuardScanner';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import NotificationsPage from './pages/NotificationsPage';
import UserDashboard from './pages/UserDashboard';
import AIChatbot from './components/AIChatbot';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) return (
    <div className="h-screen w-screen bg-surface flex flex-col items-center justify-center font-inter">
      <div className="h-12 w-12 border-3 border-primary-200 border-t-primary rounded-full animate-spin" style={{ borderWidth: '3px' }} />
      <p className="mt-5 text-txt-muted font-medium text-sm tracking-wide">Loading ParkSmart AI...</p>
    </div>
  );

  if (!user) return <LoginPage />;

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminPanel />;
      case 'booking': return <BookingPage />;
      case 'visitors': return <VisitorEntry />;
      case 'scanner': return <GuardScanner />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'notifications': return <NotificationsPage />;
      case 'residents': return <UserDashboard />;
      default: return <AdminPanel />;
    }
  };

  return (
    <>
      <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderPage()}
      </AppLayout>
      <AIChatbot />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FFFFFF',
            color: '#0F172A',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#FFFFFF' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
          },
        }}
      />
      <AppContent />
    </AuthProvider>
  );
}

export default App;
