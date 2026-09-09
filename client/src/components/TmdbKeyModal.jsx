import React, { useState } from 'react';
import { X, Key, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function TmdbKeyModal({ isOpen, onClose }) {
  const { tmdbConfig, reloadTmdbConfig, showToast } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await api.setTmdbConfig(apiKey);
      await reloadTmdbConfig();
      setStatusMsg({ type: 'success', text: res.message || 'Key saved successfully!' });
      showToast('TMDB API Key updated!', 'success');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Verification failed.' });
      showToast('Invalid TMDB key', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setLoading(true);
    try {
      await api.setTmdbConfig('');
      await reloadTmdbConfig();
      setApiKey('');
      setStatusMsg({ type: 'info', text: 'TMDB key cleared. Now using curated catalog.' });
      showToast('Using curated offline dataset', 'info');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-md bg-[#080C16]/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 rounded-[30px] blur-xl opacity-50 -z-10 pointer-events-none"></div>
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5 active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-teal-400 p-[1.5px] mx-auto mb-3.5 shadow-lg shadow-cyan-500/25">
            <div className="w-full h-full bg-[#080C16] rounded-[14px] flex items-center justify-center">
              <Key className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">TMDB Integration</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Connect live The Movie Database API for instant global movie discovery.
          </p>
        </div>

        {/* Current status pill */}
        <div className="mb-5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full ${tmdbConfig.hasKey ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]' : 'bg-slate-600'}`}></span>
            <div>
              <p className="text-xs font-bold text-white">
                {tmdbConfig.hasKey ? 'TMDB API Connected' : 'Curated Offline Mode'}
              </p>
              <p className="text-[11px] text-slate-400">
                {tmdbConfig.hasKey ? `Active Key: ${tmdbConfig.keyPreview}` : '100+ acclaimed films preloaded'}
              </p>
            </div>
          </div>
          {tmdbConfig.hasKey && (
            <button
              onClick={handleClear}
              disabled={loading}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              TMDB API Key (v3 auth)
            </label>
            <input
              type="text"
              placeholder="Paste your 32-character TMDB API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 font-mono transition-all shadow-inner"
            />
          </div>

          {statusMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
              statusMsg.type === 'error' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' :
              'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
            }`}>
              {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !apiKey.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-teal-200 text-slate-950 font-black text-sm shadow-[0_4px_20px_rgba(6,182,212,0.4)] transition-all duration-300 disabled:opacity-50 active:scale-95"
          >
            {loading ? 'Verifying with TMDB...' : 'Save & Connect API'}
          </button>
        </form>

        {/* How to get a free key */}
        <div className="mt-5 pt-4 border-t border-white/5 text-center">
          <a
            href="https://www.themoviedb.org/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline font-semibold"
          >
            <span>Get a free TMDB API Key from themoviedb.org</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
}
