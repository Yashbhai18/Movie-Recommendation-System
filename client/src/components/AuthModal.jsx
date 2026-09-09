import React, { useState } from 'react';
import { X, User, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { demoProfiles, switchProfile, login, register, currentUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setLoading(true);

    if (isRegister) {
      const ok = await register(username.trim(), password.trim(), displayName.trim() || username.trim());
      if (ok) onClose();
    } else {
      const ok = await login(username.trim(), password.trim());
      if (ok) onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-md bg-[#080C16]/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-teal-400/20 rounded-[30px] blur-xl opacity-50 -z-10 pointer-events-none"></div>
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5 active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-500 p-[1.5px] mx-auto mb-3.5 shadow-lg shadow-cyan-500/25">
            <div className="w-full h-full bg-[#080C16] rounded-[14px] flex items-center justify-center">
              <User className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isRegister ? 'Create CinePulse Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Personalize your taste profile and sync your watchlists across devices.
          </p>
        </div>

        {/* Quick Demo Persona Switcher */}
        <div className="mb-6 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 shadow-inner">
          <p className="text-[11px] font-black uppercase tracking-wider text-cyan-400 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Personas</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            {demoProfiles.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  switchProfile(p);
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-left transition-all duration-200 active:scale-95 ${
                  currentUser?.id === p.id
                    ? 'border-cyan-400/80 bg-cyan-500/15 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'border-white/[0.08] bg-slate-900/60 text-slate-300 hover:border-white/20 hover:bg-slate-900/90'
                }`}
              >
                <img src={p.avatar} alt={p.displayName} className="w-7 h-7 rounded-lg object-cover mb-2 ring-1 ring-white/10" />
                <span className="block text-xs font-bold truncate">{p.displayName.split(' ')[0]}</span>
                <span className="block text-[10px] text-slate-400 truncate mt-0.5">{p.tasteBubble?.dominantGenres[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Display Name</label>
              <input
                type="text"
                placeholder="e.g. Sam Winchester"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-teal-200 text-slate-950 font-black text-sm shadow-[0_4px_20px_rgba(6,182,212,0.4)] transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>{isRegister ? 'Register Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-cyan-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New to CinePulse?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-cyan-400 font-semibold hover:underline"
              >
                Create an account
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
