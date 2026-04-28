import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, Eye, EyeOff, Shield, Check, AlertCircle, Phone, KeyRound, ArrowRight, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardSkeleton from '../components/DashboardSkeleton';

const LoginPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [loginMode, setLoginMode] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLogged, setKeepLogged] = useState(true);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Signing you in...');
  
  const { login, requestOtp, loginWithOtp } = useAuth();

  // Smart messaging rotation
  useEffect(() => {
    if (isAuthenticating) {
      const messages = [
        'Authenticating credentials...',
        'Fetching your secure dashboard...',
        'Optimizing parking analytics...',
        'Almost ready...'
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setStatusMessage(messages[i]);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isAuthenticating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);
    
    const skeletonTimer = setTimeout(() => {
      if (!error) setShowSkeleton(true);
    }, 6000);

    try {
      let result;
      if (loginMode === 'email') {
        result = await login(email, password, keepLogged);
      } else {
        if (!otpSent) {
          result = await requestOtp(phone);
          if (result.success) {
            setOtpSent(true);
            setIsAuthenticating(false);
            return;
          }
        } else {
          result = await loginWithOtp(phone, otp);
        }
      }

      if (result.success) {
        setShowSkeleton(true);
      } else {
        setError(result.message);
        setIsAuthenticating(false);
        setShowSkeleton(false);
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
      setIsAuthenticating(false);
      setShowSkeleton(false);
    } finally {
      clearTimeout(skeletonTimer);
    }
  };

  if (showSkeleton) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg)] font-inter relative overflow-hidden transition-colors duration-500">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[var(--accent)] opacity-[0.05] rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary opacity-[0.05] rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] mx-4 relative z-10"
      >
        <div className="card-automotive p-10 border-[var(--border)]">
          {/* Theme Toggle in Login */}
          <div className="absolute top-6 right-6">
             <button onClick={toggleTheme} className="p-2 text-[var(--txt-secondary)] hover:text-[var(--accent)] transition-colors">
               {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
             </button>
          </div>

          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-16 w-16 bg-[var(--accent)] rounded-2xl flex items-center justify-center mb-5 accent-glow"
            >
              <Shield className={theme === 'light' ? 'text-white' : 'text-black'} size={32} />
            </motion.div>
            <h1 className="text-2xl font-black text-[var(--txt-primary)] tracking-tighter uppercase">
              PARK<span className="text-[var(--accent)]">ORA</span>
            </h1>
            <p className="text-[10px] text-[var(--txt-secondary)] mt-2 font-black uppercase tracking-[0.2em]">Enterprise Parking Intelligence</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex p-1.5 bg-[var(--bg)] rounded-2xl mb-8 border border-[var(--border)]">
              <button
                type="button"
                onClick={() => { setLoginMode('email'); setError(''); }}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                  loginMode === 'email' ? 'bg-[var(--surface)] text-[var(--accent)] shadow-sm' : 'text-[var(--txt-secondary)] hover:text-[var(--txt-primary)]'
                }`}
              >
                Corporate Email
              </button>
              <button
                type="button"
                onClick={() => { setLoginMode('otp'); setError(''); }}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                  loginMode === 'otp' ? 'bg-[var(--surface)] text-[var(--accent)] shadow-sm' : 'text-[var(--txt-secondary)] hover:text-[var(--txt-primary)]'
                }`}
              >
                Mobile Secure
              </button>
            </div>

            {loginMode === 'email' ? (
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.2em] mb-2 ml-1">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--txt-secondary)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@parksmart.ai"
                      className="w-full h-14 bg-[var(--bg)] border border-[var(--border)] rounded-2xl pl-12 pr-4 text-sm text-[var(--txt-primary)] placeholder:text-[var(--txt-secondary)] focus:border-[var(--accent)] outline-none transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--txt-secondary)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-14 bg-[var(--bg)] border border-[var(--border)] rounded-2xl pl-12 pr-12 text-sm text-[var(--txt-primary)] placeholder:text-[var(--txt-secondary)] focus:border-[var(--accent)] outline-none transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--txt-secondary)] hover:text-[var(--txt-primary)] transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.2em] mb-2 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--txt-secondary)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      disabled={otpSent}
                      className="w-full h-14 bg-[var(--bg)] border border-[var(--border)] rounded-2xl pl-12 pr-4 text-sm text-[var(--txt-primary)] placeholder:text-[var(--txt-secondary)] focus:border-[var(--accent)] outline-none transition-all duration-300 disabled:opacity-60"
                      required
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {otpSent && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2">
                      <label className="block text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.2em] mb-2 ml-1">Verification Code</label>
                      <div className="relative">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--txt-secondary)]" size={18} />
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="123456"
                          className="w-full h-14 bg-[var(--bg)] border border-[var(--border)] rounded-2xl pl-12 pr-4 text-sm text-[var(--txt-primary)] placeholder:text-[var(--txt-secondary)] focus:border-[var(--accent)] outline-none transition-all duration-300 tracking-[0.5em] font-mono font-bold text-center"
                          required
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-300 ${keepLogged ? 'bg-[var(--accent)] accent-glow scale-110' : 'bg-[var(--bg)] border-2 border-[var(--border)]'}`}>
                  {keepLogged && <Check size={14} className={theme === 'light' ? 'text-white' : 'text-black'} strokeWidth={4} />}
                </div>
                <span className="text-[10px] font-black text-[var(--txt-secondary)] group-hover:text-[var(--txt-primary)] transition-colors uppercase tracking-tight">Remember Device</span>
                <input type="checkbox" className="hidden" checked={keepLogged} onChange={() => setKeepLogged(!keepLogged)} />
              </label>
              <a href="#" className="text-[10px] font-black text-[var(--accent)] hover:underline uppercase tracking-tight">Help?</a>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-danger/10 border border-danger/20 rounded-2xl flex items-center gap-3 text-danger">
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="text-xs font-bold tracking-tight">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isAuthenticating}
              className="w-full h-14 bg-[var(--accent)] text-black font-black text-xs rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-[var(--accent)]/20 disabled:opacity-80 disabled:cursor-wait relative overflow-hidden group uppercase tracking-[0.2em]"
            >
              {isAuthenticating ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                  <span className="tracking-wide">{statusMessage}</span>
                </div>
              ) : (
                <>
                  <span>
                    {loginMode === 'otp' && !otpSent ? 'Get Access' : 'Enter Dashboard'}
                  </span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Quick Roles */}
          <div className="mt-10 pt-8 border-t border-[var(--border)]">
            <p className="text-[9px] font-black text-[var(--txt-secondary)] text-center uppercase tracking-[0.3em] mb-5">Enterprise Quick Login</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setEmail('admin@parksmart.ai')} className="h-11 border border-[var(--border)] rounded-xl text-[10px] font-black text-[var(--txt-secondary)] hover:bg-[var(--surface)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all uppercase tracking-widest">Sys Admin</button>
              <button onClick={() => setEmail('guard@parksmart.ai')} className="h-11 border border-[var(--border)] rounded-xl text-[10px] font-black text-[var(--txt-secondary)] hover:bg-[var(--surface)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all uppercase tracking-widest">Security</button>
            </div>
          </div>
        </div>

        <p className="text-center text-[9px] font-black text-[var(--txt-secondary)] mt-8 uppercase tracking-[0.4em] opacity-40">
          Neural Systems © 2026 · PARKORA
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
