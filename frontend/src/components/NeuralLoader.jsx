import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const NeuralLoader = () => {
  return (
    <div className="h-screen w-screen bg-[var(--bg)] flex flex-col items-center justify-center font-inter overflow-hidden relative transition-colors duration-500">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[var(--accent)] opacity-[0.05] rounded-full blur-[100px] animate-pulse" />
      
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-[var(--accent)] opacity-20 rounded-2xl animate-ping" style={{ animationDuration: '3s' }} />
          
          <div className="h-20 w-20 bg-[var(--accent)] rounded-2xl flex items-center justify-center shadow-2xl accent-glow relative z-10">
            <Shield className="text-white dark:text-black" size={40} />
          </div>
        </motion.div>

        <div className="text-center">
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-2xl font-black text-[var(--txt-primary)] tracking-tighter uppercase"
          >
            PARK<span className="text-[var(--accent)]">ORA</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-center gap-2 mt-4"
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full"
                />
              ))}
            </div>
          </motion.div>
          <p className="text-[10px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.4em] mt-4 opacity-60">
            Initializing Neural Core
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-10 text-[9px] font-black text-[var(--txt-secondary)] uppercase tracking-[0.6em] opacity-40"
      >
        Neural Systems © 2026
      </motion.div>
    </div>
  );
};

export default NeuralLoader;
