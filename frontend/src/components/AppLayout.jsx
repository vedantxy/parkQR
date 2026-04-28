import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, UserPlus, ScanLine, ParkingSquare,
  BarChart3, Bell, Users, LogOut, Search, Settings, 
  Shield, Moon, Sun, ChevronRight, Menu, MapPin, X
} from 'lucide-react';

const AppLayout = ({ children, activeTab, setActiveTab, notificationCount = 3 }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'guard'] },
    { id: 'booking', label: 'Parking Map', icon: ParkingSquare, roles: ['admin', 'guard'] },
    { id: 'visitors', label: 'Visitors', icon: UserPlus, roles: ['admin', 'guard'] },
    { id: 'scanner', label: 'Scanner', icon: ScanLine, roles: ['admin', 'guard'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin'] },
    { id: 'residents', label: 'Residents', icon: Users, roles: ['admin'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="flex h-screen bg-[var(--bg)] font-inter overflow-hidden transition-colors duration-500">
      
      {/* 1. Desktop Sidebar (Icon Style) */}
      <aside className="hidden md:flex w-20 border-r border-[var(--border)] bg-[var(--surface)] flex-col items-center py-8 gap-8 z-50 flex-shrink-0">
        <div className="h-10 w-10 bg-[var(--accent)] rounded-xl flex items-center justify-center accent-glow cursor-pointer hover:rotate-12 transition-transform">
          <Shield className={theme === 'light' ? 'text-white' : 'text-black'} size={20} />
        </div>
        
        <nav className="flex flex-col gap-6">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-4 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-[var(--accent)] shadow-lg shadow-[var(--accent)]/20 text-black' 
                    : 'text-[var(--txt-secondary)] hover:bg-[var(--bg)] hover:text-[var(--txt-primary)]'
                }`}
              >
                <Icon size={20} className={isActive ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-[100] uppercase tracking-widest border border-white/10 shadow-xl translate-x-[-10px] group-hover:translate-x-0">
                  {item.label}
                </div>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-6">
          <button onClick={toggleTheme} className="p-4 text-[var(--txt-secondary)] hover:text-[var(--accent)] transition-all hover:scale-110 active:scale-95">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={logout} className="p-4 text-danger opacity-60 hover:opacity-100 hover:bg-danger/10 rounded-2xl transition-all hover:scale-110 active:scale-95">
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* 2. Main Wrapper */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-20 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-6 md:px-8 z-40">
          <div className="flex items-center gap-4 md:gap-12">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-[var(--txt-primary)]"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-xl font-black tracking-tighter text-[var(--txt-primary)] uppercase">
              PARK<span className="text-[var(--accent)]">ORA</span>
            </h1>

            <div className="relative hidden xl:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--txt-secondary)]" size={16} />
              <input 
                type="text" 
                placeholder="Search anything here..."
                className="w-64 xxl:w-80 h-11 bg-[var(--bg)] border border-[var(--border)] rounded-2xl pl-12 pr-4 text-sm outline-none focus:border-[var(--accent)] transition-all"
              />
            </div>

            <nav className="hidden lg:flex items-center gap-8 h-full">
              {filteredNav.slice(0, 4).map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative h-full px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    activeTab === item.id ? 'text-[var(--txt-primary)]' : 'text-[var(--txt-secondary)] hover:text-[var(--txt-primary)]'
                  }`}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <motion.div layoutId="top-nav-active" className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--accent)] rounded-t-full accent-glow" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="hidden sm:flex h-11 w-11 bg-[var(--bg)] border border-[var(--border)] rounded-2xl items-center justify-center text-[var(--txt-secondary)] hover:text-[var(--txt-primary)] transition-all relative">
              <Bell size={18} />
              {notificationCount > 0 && <div className="absolute top-3 right-3 w-2 h-2 bg-danger rounded-full border-2 border-[var(--surface)]" />}
            </button>

            <div className="h-10 w-px bg-[var(--border)] mx-1 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[var(--txt-primary)] leading-none mb-0.5">{user?.name || 'Guest'}</p>
                <p className="text-[9px] text-[var(--txt-secondary)] uppercase font-black tracking-widest">{user?.role || 'User'}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-slate-100 border-2 border-[var(--border)] overflow-hidden shadow-sm flex-shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Guest'}`} alt="avatar" />
              </div>
            </div>

            <button className="hidden md:flex h-11 px-6 bg-slate-900 text-white dark:bg-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest ml-2 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-black/10">
              Add Location
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)] opacity-[0.03] blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary opacity-[0.03] blur-[150px] pointer-events-none" />

          <div className="max-w-[1600px] mx-auto relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[var(--surface)] z-[101] md:hidden p-8 flex flex-col border-r border-[var(--border)]"
            >
              <div className="flex items-center justify-between mb-12">
                <h1 className="text-xl font-black tracking-tighter text-[var(--txt-primary)] uppercase">
                  PARK<span className="text-[var(--accent)]">ORA</span>
                </h1>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[var(--txt-secondary)]">
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {filteredNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        isActive 
                          ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' 
                          : 'text-[var(--txt-secondary)] hover:bg-[var(--bg)]'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto space-y-4 pt-8 border-t border-[var(--border)]">
                <button onClick={toggleTheme} className="flex items-center gap-4 p-4 w-full text-[var(--txt-secondary)]">
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  <span className="text-xs font-black uppercase tracking-widest">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
                <button onClick={logout} className="flex items-center gap-4 p-4 w-full text-danger opacity-80">
                  <LogOut size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;
