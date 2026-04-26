import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Check, AlertCircle, Phone, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const [loginMode, setLoginMode] = useState('email'); // 'email' or 'otp'
  
  // Email/Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLogged, setKeepLogged] = useState(true);
  
  // OTP state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, requestOtp, loginWithOtp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (loginMode === 'email') {
      const result = await login(email, password, keepLogged);
      if (!result.success) setError(result.message);
    } else {
      if (!otpSent) {
        // Request OTP
        const result = await requestOtp(phone);
        if (result.success) {
          setOtpSent(true);
        } else {
          setError(result.message);
        }
      } else {
        // Verify OTP
        const result = await loginWithOtp(phone, otp);
        if (!result.success) setError(result.message);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface dot-pattern font-inter relative">
      {/* Subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-400 to-success" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-[420px] mx-4"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card p-8 border border-border">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-primary/20">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-txt-primary">
              ParkSmart <span className="text-primary">AI</span>
            </h1>
            <p className="text-sm text-txt-secondary mt-1">Smart Parking Management System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Mode Toggle */}
            <div className="flex p-1 bg-surface rounded-xl mb-6">
              <button
                type="button"
                onClick={() => { setLoginMode('email'); setError(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  loginMode === 'email' ? 'bg-white text-primary shadow-sm' : 'text-txt-muted hover:text-txt-secondary'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => { setLoginMode('otp'); setError(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  loginMode === 'otp' ? 'bg-white text-primary shadow-sm' : 'text-txt-muted hover:text-txt-secondary'
                }`}
              >
                Mobile OTP
              </button>
            </div>

            {loginMode === 'email' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-muted" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@parksmart.ai"
                      className="w-full h-12 bg-surface border border-border rounded-btn pl-11 pr-4 text-sm text-txt-primary placeholder:text-txt-muted focus:ring-2 focus:ring-primary-200 focus:border-primary outline-none transition-all duration-200"
                      required={loginMode === 'email'}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-muted" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 bg-surface border border-border rounded-btn pl-11 pr-12 text-sm text-txt-primary placeholder:text-txt-muted focus:ring-2 focus:ring-primary-200 focus:border-primary outline-none transition-all duration-200"
                      required={loginMode === 'email'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-txt-muted hover:text-txt-secondary transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-muted" size={18} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      disabled={otpSent}
                      className="w-full h-12 bg-surface border border-border rounded-btn pl-11 pr-4 text-sm text-txt-primary placeholder:text-txt-muted focus:ring-2 focus:ring-primary-200 focus:border-primary outline-none transition-all duration-200 disabled:opacity-60"
                      required={loginMode === 'otp'}
                    />
                  </div>
                </div>

                {/* OTP Input */}
                <AnimatePresence>
                  {otpSent && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-sm font-medium text-txt-secondary mb-1.5 mt-5">Enter OTP</label>
                      <div className="relative">
                        <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-muted" size={18} />
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="123456"
                          className="w-full h-12 bg-surface border border-border rounded-btn pl-11 pr-4 text-sm text-txt-primary placeholder:text-txt-muted focus:ring-2 focus:ring-primary-200 focus:border-primary outline-none transition-all duration-200 tracking-widest font-mono"
                          required={loginMode === 'otp' && otpSent}
                        />
                      </div>
                      <p className="text-xs text-txt-muted mt-2">Demo OTP is 123456</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Keep logged in + Forgot */}
            {loginMode === 'email' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    className={`w-[18px] h-[18px] rounded flex items-center justify-center transition-colors duration-200
                      ${keepLogged ? 'bg-primary' : 'bg-white border-2 border-border group-hover:border-primary-300'}`}
                  >
                    {keepLogged && <Check size={12} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-sm text-txt-secondary group-hover:text-txt-primary transition-colors">
                    Keep me signed in
                  </span>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={keepLogged}
                    onChange={() => setKeepLogged(!keepLogged)}
                  />
                </label>
                <a href="#" className="text-sm font-medium text-primary hover:text-primary-600 transition-colors">
                  Forgot?
                </a>
              </div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-danger-50 border border-danger-100 rounded-btn flex items-start gap-2.5"
              >
                <AlertCircle size={16} className="text-danger mt-0.5 flex-shrink-0" />
                <p className="text-sm text-danger font-medium">{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary-600 text-white font-semibold text-sm rounded-btn transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : loginMode === 'otp' && !otpSent ? (
                'Send OTP'
              ) : loginMode === 'otp' && otpSent ? (
                'Verify & Sign In'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-txt-muted font-medium">Quick Access</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Role hint */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setEmail('admin@parksmart.ai'); }}
              className="py-2.5 border border-border rounded-btn text-sm font-medium text-txt-secondary hover:bg-primary-50 hover:text-primary hover:border-primary-200 transition-all duration-200"
            >
              Admin Login
            </button>
            <button
              onClick={() => { setEmail('guard@parksmart.ai'); }}
              className="py-2.5 border border-border rounded-btn text-sm font-medium text-txt-secondary hover:bg-success-50 hover:text-success hover:border-success/30 transition-all duration-200"
            >
              Guard Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-txt-muted mt-6">
          © 2026 ParkSmart AI · Secured by Firebase
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
