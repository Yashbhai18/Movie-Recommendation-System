import React, { useState } from 'react';
import { X, Bookmark, Heart, CheckCircle, Star, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function WatchlistDrawer({ isOpen, onClose, onSelectMovie }) {
  const { currentUser, watchlist, favorites, history, toggleWatchlist, toggleFavorite } = useAuth();
  const [activeTab, setActiveTab] = useState('watchlist'); // 'watchlist', 'favorites', 'history'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-fade-in">
      
      {/* Backdrop click close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-[#080C16]/95 border-l border-white/15 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col z-10 backdrop-blur-2xl">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <Bookmark className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Your Cinema Library</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Curated under <span className="text-cyan-300 font-bold">{currentUser?.displayName}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex p-2.5 bg-white/[0.02] border-b border-white/10 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 ${
              activeTab === 'watchlist'
                ? 'bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 shadow-[0_4px_15px_rgba(6,182,212,0.35)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Watchlist ({watchlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 ${
              activeTab === 'favorites'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_4px_15px_rgba(244,63,94,0.35)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Favorites ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_4px_15px_rgba(139,92,246,0.35)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Watched ({history.length})</span>
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          
          {/* WATCHLIST TAB */}
          {activeTab === 'watchlist' && (
            watchlist.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Bookmark className="w-12 h-12 text-slate-600 mb-3 opacity-60" />
                <p className="font-bold text-sm text-slate-200">Your Watchlist is Empty</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  Use the "+" button on any recommendation to bookmark movies for later.
                </p>
              </div>
            ) : (
              watchlist.map((item) => (
                <div
                  key={item.id || item.movieId}
                  onClick={() => onSelectMovie(item.movieId)}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-cyan-400/40 hover:shadow-[0_4px_20px_rgba(6,182,212,0.15)] cursor-pointer transition-all duration-200 group"
                >
                  <img
                    src={item.poster_path || 'https://via.placeholder.com/60x90'}
                    alt={item.title}
                    className="w-12 h-16 object-cover rounded-xl shrink-0 shadow-md bg-slate-950 border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      {item.release_date && <span>{item.release_date.split('-')[0]}</span>}
                      {item.vote_average && (
                        <span className="text-amber-400 font-bold flex items-center gap-0.5">
                          ★ {item.vote_average}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist({ id: item.movieId, title: item.title });
                    }}
                    className="p-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/15 transition-all"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )
          )}

          {/* FAVORITES TAB */}
          {activeTab === 'favorites' && (
            favorites.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Heart className="w-12 h-12 text-slate-600 mb-3" />
                <p className="font-semibold text-sm text-slate-300">No Favorites Yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Heart movies you love to anchor your taste profile.
                </p>
              </div>
            ) : (
              favorites.map((item) => (
                <div
                  key={item.id || item.movieId}
                  onClick={() => onSelectMovie(item.movieId)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 cursor-pointer transition-all group"
                >
                  <img
                    src={item.poster_path || 'https://via.placeholder.com/60x90'}
                    alt={item.title}
                    className="w-12 h-16 object-cover rounded-xl shrink-0 shadow bg-slate-950"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-100 group-hover:text-rose-400 transition-colors truncate">
                      {item.title}
                    </h4>
                    {item.vote_average && (
                      <span className="text-xs text-amber-400 font-semibold mt-1 block">
                        ★ {item.vote_average}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite({ id: item.movieId, title: item.title });
                    }}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove Favorite"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )
          )}

          {/* WATCHED HISTORY TAB */}
          {activeTab === 'history' && (
            history.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <CheckCircle className="w-12 h-12 text-slate-600 mb-3" />
                <p className="font-semibold text-sm text-slate-300">No Watched History</p>
                <p className="text-xs text-slate-500 mt-1">
                  Rate movies in their details to build your viewing history and calibrate "Surprise Me".
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectMovie(item.movieId)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="font-bold text-sm text-slate-100 group-hover:text-violet-300 transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {item.genres?.join(', ') || 'Film'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300 shrink-0">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{item.userRating > 5 ? Math.round(item.userRating / 2) : item.userRating}/5</span>
                  </div>
                </div>
              ))
            )
          )}

        </div>

      </div>
    </div>
  );
}
