import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import DashboardSkeleton from './components/DashboardSkeleton';
import NeuralLoader from './components/NeuralLoader';

// Lazy load pages for performance
const LoginPage = lazy(() => import('./pages/LoginPage')); // Auth Entry
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const VisitorManagement = lazy(() => import('./pages/VisitorManagement'));
const GuardScanner = lazy(() => import('./pages/GuardScanner'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AIChatbot = lazy(() => import('./components/AIChatbot'));

const AppContent = () => {
  const { user, loading } = useAuth();
  
  // Persist active tab across refreshes
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('parkora_active_tab');
    if (saved) return saved;
    // Default based on role
    return user?.role === 'resident' ? 'residents' : 'dashboard';
  });

  // Update localStorage when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('parkora_active_tab', tab);
  };

  // Initial Startup Loader (Prevents Flicker)
  if (loading) return <NeuralLoader />;

  // Only show login if explicitly not authenticated
  if (!user) return (
    <Suspense fallback={<NeuralLoader />}>
      <LoginPage />
    </Suspense>
  );

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminPanel />;
      case 'booking': return <BookingPage />;
      case 'visitors': return <VisitorManagement />;
      case 'scanner': return <GuardScanner />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'notifications': return <NotificationsPage />;
      case 'residents': return <UserDashboard />;
      default: return <AdminPanel />;
    }
  };

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AppLayout activeTab={activeTab} setActiveTab={handleTabChange}>
        {renderPage()}
      </AppLayout>
      <AIChatbot />
    </Suspense>
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
