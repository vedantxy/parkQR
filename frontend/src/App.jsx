import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import GuardScanner from './pages/GuardScanner';
import VisitorEntry from './pages/VisitorEntry';
import BookingPage from './pages/BookingPage';
import { 
  LayoutDashboard, UserPlus, ScanLine, ShieldCheck, 
  LogOut, Bell, Settings, Search, Menu, X, ParkingSquare 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SaaSLayout = ({ children, activeTab, setActiveTab }) => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={20}/>, roles: ['admin', 'guard'] },
        { id: 'booking', label: 'Book Slot', icon: <ParkingSquare size={20}/>, roles: ['admin', 'guard'] },
        { id: 'visitors', label: 'Visitors', icon: <UserPlus size={20}/>, roles: ['admin', 'guard'] },
        { id: 'scanner', label: 'Terminal', icon: <ScanLine size={20}/>, roles: ['admin', 'guard'] },
    ];

    const filteredNav = navItems.filter(item => item.roles.includes(user.role));

    return (
        <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-inter">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-slate-900/50 backdrop-blur-2xl border-r border-white/5 flex flex-col transition-all duration-300 z-50`}>
                <div className="p-6 flex items-center gap-4 h-24">
                    <div className="h-10 w-10 bg-primary rounded-xl flex-shrink-0 shadow-lg shadow-primary/20 flex items-center justify-center">
                        <ShieldCheck className="text-white" size={24} />
                    </div>
                    {isSidebarOpen && (
                        <motion.span 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-xl font-black tracking-tight"
                        >
                            ParkSmart <span className="text-primary italic">AI</span>
                        </motion.span>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {filteredNav.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group
                                ${activeTab === item.id 
                                    ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            {isSidebarOpen && <span className="font-bold">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="bg-white/5 rounded-2xl p-4">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center font-black border border-white/10 flex-shrink-0">
                                {user?.name[0] || 'U'}
                            </div>
                            {isSidebarOpen && (
                                <div className="overflow-hidden">
                                     <p className="text-sm font-black truncate">{user?.name}</p>
                                     <p className="text-[10px] text-primary font-black uppercase">{user?.role}</p>
                                </div>
                            )}
                         </div>
                         {isSidebarOpen && (
                            <button onClick={logout} className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-red-500/10 text-red-500 text-xs font-black hover:bg-red-500 hover:text-white transition-all">
                                <LogOut size={14} /> SIGNOUT
                            </button>
                         )}
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto flex flex-col relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
                <header className="h-24 px-10 flex items-center justify-between sticky top-0 bg-transparent backdrop-blur-md z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10">
                            {isSidebarOpen ? <Menu size={20}/> : <X size={20}/>}
                        </button>
                        <h1 className="text-2xl font-black capitalize tracking-tight">{activeTab}</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input type="text" placeholder="Omni Search..." className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm w-64 focus:ring-1 focus:ring-primary outline-none" />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 bg-white/5 rounded-xl border border-white/10 relative">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="px-10 pb-10 flex-1 relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

const MouseGlow = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-30 transition-duration-300"
            animate={{
                background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(37,99,235,0.05), transparent 80%)`
            }}
        />
    );
};

const AppContent = () => {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');

    if (loading) return (
        <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center">
            <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-6 text-slate-400 font-black tracking-widest text-xs uppercase animate-pulse">Initializing System...</p>
        </div>
    );

    if (!user) return <LoginPage />;

    return (
        <div className="selection:bg-primary/30 selection:text-primary-light">
            <MouseGlow />
            <SaaSLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                {activeTab === 'dashboard' && <AdminPanel />}
                {activeTab === 'booking' && <BookingPage />}
                {activeTab === 'visitors' && <VisitorEntry />}
                {activeTab === 'scanner' && <GuardScanner />}
            </SaaSLayout>
        </div>
    );
};

function App() {
  return (
    <AuthProvider>
       <AppContent />
    </AuthProvider>
  );
}

export default App;
