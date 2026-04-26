import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Minimize2, Maximize2
} from 'lucide-react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Hello! I\'m ParkSmart AI assistant. Ask me about parking availability, visitor stats, or anything related to the system.',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = {
      role: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = await res.json();

      setMessages(prev => [...prev, {
        role: 'ai',
        text: data.success ? data.reply : (data.error || 'Something went wrong.'),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Connection error. Please check if the backend is running.',
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    'How many visitors are inside?',
    'Available parking slots?',
    'Any overstay alerts?',
    'Daily summary',
  ];

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 h-14 w-14 bg-primary hover:bg-primary-600 text-white rounded-full shadow-lg shadow-primary/25 flex items-center justify-center z-50 transition-colors duration-200"
          >
            <MessageCircle size={24} />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 w-[380px] flex flex-col bg-white rounded-2xl shadow-modal border border-border overflow-hidden"
            style={{ height: isMinimized ? 'auto' : '520px' }}
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">ParkSmart AI</h3>
                  <p className="text-[10px] text-white/70 font-medium">
                    {loading ? 'Thinking...' : 'Online · Powered by Claude'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 size={14} className="text-white" /> : <Minimize2 size={14} className="text-white" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            </div>

            {/* Body */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-surface">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                          ${msg.role === 'user' ? 'bg-primary-100 text-primary' : 'bg-white border border-border text-primary'}`}
                        >
                          {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>

                        {/* Bubble */}
                        <div>
                          <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                            ${msg.role === 'user'
                              ? 'bg-primary text-white rounded-br-md'
                              : 'bg-white border border-border text-txt-primary rounded-bl-md shadow-sm'
                            }`}
                          >
                            {msg.text.split('\n').map((line, j) => (
                              <span key={j}>
                                {line}
                                {j < msg.text.split('\n').length - 1 && <br />}
                              </span>
                            ))}
                          </div>
                          <p className={`text-[10px] mt-1 text-txt-muted ${msg.role === 'user' ? 'text-right' : ''}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {loading && (
                    <div className="flex gap-2">
                      <div className="h-7 w-7 rounded-full bg-white border border-border flex items-center justify-center">
                        <Bot size={14} className="text-primary" />
                      </div>
                      <div className="bg-white border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestions (only show when few messages) */}
                {messages.length <= 2 && !loading && (
                  <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto bg-white">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { setInput(s); inputRef.current?.focus(); }}
                        className="px-3 py-1.5 text-xs font-medium text-primary bg-primary-50 border border-primary-200 rounded-full whitespace-nowrap hover:bg-primary-100 transition-colors flex-shrink-0"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <div className="px-3 py-3 border-t border-border bg-white flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask ParkSmart AI..."
                      disabled={loading}
                      className="flex-1 h-10 bg-surface border border-border rounded-xl px-4 text-sm text-txt-primary placeholder:text-txt-muted outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all disabled:opacity-50"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || loading}
                      className="h-10 w-10 bg-primary hover:bg-primary-600 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
