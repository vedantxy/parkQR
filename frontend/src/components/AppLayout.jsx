import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, UserPlus, ScanLine, ParkingSquare,
  BarChart3, Bell, Users, LogOut, Menu, ChevronRight,
  Search, Settings, ShieldCheck
} from 'lucide-react';

const AppLayout = ({ children, activeTab, setActiveTab, notificationCount = 3 }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['admin', 'guard'] },
    { id: 'booking', label: 'Parking Map', icon: ParkingSquare, roles: ['admin', 'guard'] },
    { id: 'visitors', label: 'Visitors', icon: UserPlus, roles: ['admin', 'guard'] },
    { id: 'scanner', label: 'Scanner', icon: ScanLine, roles: ['admin', 'guard'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin'] },
    { id: 'notifications', label: 'Alerts', icon: Bell, roles: ['admin', 'guard'] },
    { id: 'residents', label: 'Residents', icon: Users, roles: ['admin'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role));

  const breadcrumbMap = {
    dashboard: 'Overview',
    booking: 'Parking Map',
    visitors: 'Visitor Entry',
    scanner: 'Guard Scanner',
    analytics: 'Analytics',
    notifications: 'Notifications',
    residents: 'Residents',
  };

  return (
    <div className="flex h-screen bg-surface font-inter overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-white border-r border-border flex flex-col transition-all duration-200 ease-in-out z-50 flex-shrink-0`}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center border-b border-border ${sidebarOpen ? 'px-5' : 'px-4 justify-center'}`}>
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="text-white" size={18} />
          </div>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="ml-3 text-base font-bold text-txt-primary whitespace-nowrap"
            >
              ParkSmart <span className="text-primary">AI</span>
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 rounded-btn transition-all duration-200 relative group
                  ${sidebarOpen ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'}
                  ${isActive
                    ? 'bg-primary-50 text-primary'
                    : 'text-txt-secondary hover:bg-surface-hover hover:text-txt-primary'
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full" />
                )}
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-semibold">{item.label}</span>
                )}
                {item.id === 'notifications' && notificationCount > 0 && (
                  <span className={`${sidebarOpen ? 'ml-auto' : 'absolute -top-1 -right-1'} bg-danger text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1`}>
                    {notificationCount}
                  </span>
                )}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-txt-primary text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-border p-3">
          {sidebarOpen ? (
            <div className="bg-surface rounded-card p-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-primary-100 text-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="overflow-hidden flex-1 min-w-0">
                  <p className="text-sm font-semibold text-txt-primary truncate">{user?.name}</p>
                  <p className="text-xs text-txt-muted capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="mt-3 flex items-center justify-center gap-2 w-full py-2 rounded-btn bg-danger-50 text-danger text-xs font-semibold hover:bg-danger hover:text-white transition-all duration-200"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="w-full flex justify-center py-2 text-txt-muted hover:text-danger transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-surface rounded-btn transition-colors duration-200"
            >
              <Menu size={20} className="text-txt-secondary" />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-txt-muted">Home</span>
              <ChevronRight size={14} className="text-txt-muted" />
              <span className="font-semibold text-txt-primary">{breadcrumbMap[activeTab]}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-surface border border-border rounded-btn pl-9 pr-4 py-2 text-sm w-56 focus:ring-2 focus:ring-primary-200 focus:border-primary outline-none transition-all duration-200"
              />
            </div>
            <button
              onClick={() => setActiveTab('notifications')}
              className="p-2 hover:bg-surface rounded-btn transition-colors duration-200 relative"
            >
              <Bell size={20} className="text-txt-secondary" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-danger rounded-full" />
              )}
            </button>
            <button className="p-2 hover:bg-surface rounded-btn transition-colors duration-200">
              <Settings size={20} className="text-txt-secondary" />
            </button>
            <div className="h-8 w-8 bg-primary-100 text-primary rounded-full flex items-center justify-center text-sm font-bold ml-1">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
