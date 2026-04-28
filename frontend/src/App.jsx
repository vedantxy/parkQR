import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import DashboardSkeleton from './components/DashboardSkeleton';
import NeuralLoader from './components/NeuralLoader';

// Lazy load pages for performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const VisitorEntry = lazy(() => import('./pages/VisitorEntry'));
const GuardScanner = lazy(() => import('./pages/GuardScanner'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AIChatbot = lazy(() => import('./components/AIChatbot'));

const AppContent = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Initial Startup Loader (Prevents Flicker)
  if (loading) return <NeuralLoader />;

  // If we are logged in but dashboard isn't showing, it might be a routing issue
  // Let's ensure activeTab defaults to dashboard if none matches
  const currentTab = activeTab || 'dashboard';

  if (!user) return (
    <Suspense fallback={<NeuralLoader />}>
      <LoginPage />
    </Suspense>
  );

  const renderPage = () => {
    switch (currentTab) {
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
    <Suspense fallback={<DashboardSkeleton />}>
      <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
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
