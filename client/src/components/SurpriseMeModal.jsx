import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles, RefreshCw, X, Star, Plus, Check,
  HelpCircle, ArrowRight, CheckCircle2, ChevronRight, ChevronLeft, Tv, Film
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function SurpriseMeModal({ isOpen, onClose, onOpenDetails }) {
  const { currentUser, isMovieInWatchlist, toggleWatchlist, markAsWatched } = useAuth();
  
  const [picksHistory, setPicksHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [excludedIds, setExcludedIds] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlippingNext, setIsFlippingNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setIsFlipped(false);
      setIsFlippingNext(false);
    }
  }

  const fetchSurprise = useCallback(async (currentExcluded = []) => {
    setLoading(true);
    try {
      const data = await api.getSurpriseRecommendation(currentUser?.id, currentExcluded);
      if (data?.movie?.id) {
        setExcludedIds(prev => [...new Set([...prev, data.movie.id])]);
        // Preload poster image immediately so it renders instantly
        if (data.movie.poster_path) {
          const preImg = new Image();
          preImg.src = data.movie.poster_path;
        }
        setPicksHistory(prev => {
          const next = [...prev, data];
          setCurrentIndex(next.length - 1);
          return next;
        });
        return data;
      }
    } catch (err) {
      console.error('Error fetching surprise movie:', err);
    } finally {
      setLoading(false);
    }
    return null;
  }, [currentUser]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch initial surprise movie when modal opens
  useEffect(() => {
    if (isOpen && picksHistory.length === 0) {
      fetchSurprise([]);
    }
  }, [isOpen, fetchSurprise, picksHistory.length]);

  const currentPick = picksHistory[currentIndex] || null;
  const movie = currentPick?.movie;
  const whyNote = currentPick?.whyNote;
  const inWatchlist = movie ? isMovieInWatchlist(movie.id) : false;

  // Handle Next button with 3D card flip animation
  const handleNext = async (markWatched = false) => {
    if (loading || isFlippingNext) return;

    if (movie && markWatched) {
      await markAsWatched(movie, 4);
    }

    setIsFlippingNext(true);

    if (isFlipped) {
      // 1. Flip card back to holographic mystery cover first
      setIsFlipped(false);

      // 2. Wait for card to face away / reach mystery cover (~380ms)
      setTimeout(async () => {
        try {
          if (currentIndex < picksHistory.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else {
            const nextExcluded = [...new Set([...excludedIds, movie?.id].filter(Boolean))];
            setExcludedIds(nextExcluded);
            await fetchSurprise(nextExcluded);
          }
        } finally {
          // 3. Smoothly flip open to reveal the next surprise movie/tv show!
          setTimeout(() => {
            setIsFlipped(true);
            setTimeout(() => {
              setIsFlippingNext(false);
            }, 700);
          }, 120);
        }
      }, 380);
    } else {
      // If card was not flipped, load next and flip to reveal
      try {
        if (currentIndex < picksHistory.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          const nextExcluded = [...new Set([...excludedIds, movie?.id].filter(Boolean))];
          setExcludedIds(nextExcluded);
          await fetchSurprise(nextExcluded);
        }
      } finally {
        setTimeout(() => {
          setIsFlipped(true);
          setTimeout(() => {
            setIsFlippingNext(false);
          }, 700);
        }, 120);
      }
    }
  };

  // Handle Previous button with 3D card flip animation
  const handlePrevious = () => {
    if (currentIndex <= 0 || loading || isFlippingNext) return;
    setIsFlippingNext(true);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => prev - 1);
      setTimeout(() => {
        setIsFlipped(true);
        setTimeout(() => {
          setIsFlippingNext(false);
        }, 700);
      }, 120);
    }, 380);
  };

  // Re-flip card to mystery cover and shuffle
  const handleShuffleMystery = (e) => {
    if (e) e.stopPropagation();
    if (isFlippingNext || loading) return;
    setIsFlipped(false);
    setTimeout(() => {
      fetchSurprise(excludedIds);
    }, 350);
  };

  if (!isOpen) return null;

  const isTvSeries = movie?.media_type === 'tv';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      
      {/* Modal Container with ambient glow aura */}
      <div className="relative w-full max-w-2xl bg-[#080C16]/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] my-auto backdrop-blur-2xl">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-600/30 via-cyan-500/20 to-fuchsia-600/30 rounded-[30px] blur-2xl opacity-60 -z-10 pointer-events-none"></div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-20 border border-white/5 active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-black uppercase tracking-widest mb-2.5 shadow-sm shadow-violet-500/20">
            <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span>AI Bubble-Buster Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Surprise Me Reveal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300/80 mt-1 max-w-md mx-auto leading-relaxed">
            Breaking you out of your comfort zone with critically acclaimed movies & TV shows outside your usual queue.
          </p>
        </div>

        {/* 3D CARD REVEAL AREA */}
        <div className="relative flex items-center justify-center my-6">
          
          {/* Floating Previous Button (when browsing history) */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              disabled={loading || isFlippingNext}
              className={`absolute left-2 sm:-left-3 md:-left-6 z-30 flex flex-col items-center gap-1 group active:scale-95 transition-all ${
                isFlipped || isFlippingNext ? 'opacity-100' : 'opacity-0 pointer-events-none'
              } disabled:opacity-50`}
              title="Go back to previous recommendation"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/20 flex items-center justify-center shadow-xl backdrop-blur-xl transition-all duration-200 group-hover:scale-105">
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors bg-slate-950/80 px-1.5 py-0.5 rounded border border-white/10">
                Prev
              </span>
            </button>
          )}

          {/* Floating Next Button (beside card for 1-click discovery) */}
          <button
            onClick={() => handleNext(false)}
            disabled={loading || isFlippingNext}
            className={`absolute right-2 sm:-right-3 md:-right-6 z-30 flex flex-col items-center gap-1 group active:scale-95 transition-all ${
              isFlipped || isFlippingNext ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } disabled:opacity-50`}
            title="Watched or want another pick? Click for next movie or TV show"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/90 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-teal-300 text-slate-300 hover:text-slate-950 border border-white/20 hover:border-transparent flex items-center justify-center shadow-xl backdrop-blur-xl transition-all duration-200 group-hover:scale-105">
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 group-hover:text-cyan-300 transition-colors bg-slate-950/80 px-1.5 py-0.5 rounded border border-white/10">
              Next
            </span>
          </button>

          {/* 3D Card */}
          <div
            onClick={() => !loading && !isFlippingNext && setIsFlipped(!isFlipped)}
            className="w-72 sm:w-80 h-[430px] perspective-1000 cursor-pointer group select-none relative"
          >
            <div
              className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              
              {/* CARD FRONT: Holographic Mystery Cover */}
              <div className="absolute inset-0 backface-hidden rounded-3xl p-[2px] bg-gradient-to-tr from-violet-600 via-cyan-400 to-amber-300 shadow-[0_0_35px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_50px_rgba(6,182,212,0.45)] group-hover:scale-[1.02] transition-all duration-300">
                <div className="w-full h-full bg-[#090D18] rounded-[22px] flex flex-col items-center justify-between p-7 text-center relative overflow-hidden border border-white/10">
                  
                  {/* Shimmering mesh */}
                  <div className="absolute inset-0 radial-glow-violet opacity-70 pointer-events-none"></div>
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="w-full flex items-center justify-between text-xs text-slate-400 relative z-10">
                    <span className="font-mono text-[10px] text-cyan-300 font-extrabold tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      CLASSIFIED PICK
                    </span>
                    <span className="text-[10px] text-violet-300 font-bold uppercase tracking-wider">
                      TAP TO UNVEIL
                    </span>
                  </div>

                  {/* Mystery Icon */}
                  <div className="my-auto flex flex-col items-center relative z-10">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-violet-600/30 via-indigo-600/20 to-cyan-500/30 border border-white/15 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl shadow-cyan-500/10">
                      <HelpCircle className="w-12 h-12 text-cyan-300 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      Mystery Film or Show
                    </h3>
                    <p className="text-xs text-slate-300/80 mt-2 max-w-[210px] leading-relaxed">
                      Handpicked by analyzing what you rarely watch to challenge your taste bubble.
                    </p>
                  </div>

                  {/* Click trigger prompt */}
                  <div className="w-full py-2.5 px-4 rounded-xl bg-white/10 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-teal-300 group-hover:text-slate-950 text-xs font-black text-white transition-all flex items-center justify-center gap-2 relative z-10 shadow-md">
                    <span>Click Card to Reveal</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* CARD BACK: The Revealed Movie or TV Show */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.35)] border border-cyan-400/40 bg-[#090D18] flex flex-col">
                
                {/* Smooth loading overlay when fetching next pick */}
                {loading && !isFlippingNext && (
                  <div className="absolute inset-0 z-30 bg-[#090D18]/85 backdrop-blur-md flex flex-col items-center justify-center gap-3 animate-fade-in">
                    <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-black text-cyan-300 tracking-wide uppercase">
                      Finding Next Out-of-Bubble Pick...
                    </p>
                  </div>
                )}

                {movie ? (
                  <>
                    <div className="relative flex-1 w-full overflow-hidden bg-slate-900">
                      <img
                        src={movie.poster_path || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80'}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                      
                      {/* Rating pill */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-300 shadow">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}</span>
                      </div>

                      {/* Media type tag (Movie vs TV Series) */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-violet-600/90 text-white text-[10px] font-black uppercase tracking-wider shadow">
                        {isTvSeries ? <Tv className="w-3 h-3 text-cyan-300" /> : <Film className="w-3 h-3 text-amber-300" />}
                        <span>{isTvSeries ? 'TV Series' : 'Out of Bubble Pick'}</span>
                      </div>

                      {/* Movie overlay title info */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="text-xs text-cyan-400 font-semibold flex items-center gap-1.5">
                          <span>{movie.year || ''}</span>
                          {movie.country && <span>• {movie.country}</span>}
                          {isTvSeries && <span className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded text-[10px]">TV</span>}
                        </p>
                        <h4 className="text-xl font-extrabold text-white leading-tight drop-shadow">
                          {movie.title}
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5 line-clamp-1 font-light">
                          {movie.genres?.join(', ')}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                    Loading surprise...
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Personalized "Why We Picked This For You" Note */}
        {whyNote && (
          <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-cyan-950/20 border border-violet-500/30 text-xs text-violet-200 leading-relaxed mb-6 shadow-inner backdrop-blur-md transition-all duration-500 ${
            isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}>
            <div className="flex items-center gap-2 font-black text-violet-300 mb-1.5 uppercase tracking-wider text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Algorithmic Rationale: Why We Picked This For You</span>
            </div>
            <p className="text-slate-200/90 leading-relaxed font-normal text-xs sm:text-sm">
              {whyNote}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-white/10">
          
          {/* Re-flip into mystery cover */}
          <button
            onClick={handleShuffleMystery}
            disabled={loading || isFlippingNext}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all active:scale-95 disabled:opacity-50"
            title="Flip back to mystery card cover"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Shuffle Mystery</span>
          </button>

          {/* Actions when revealed */}
          {movie && (
            <div className={`flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end transition-opacity duration-300 ${
              isFlipped || isFlippingNext ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              
              {/* PRIMARY NEXT BUTTON 1: "Watched It? Next" */}
              <button
                onClick={() => handleNext(true)}
                disabled={loading || isFlippingNext}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 border border-emerald-400/40 shadow-[0_4px_16px_rgba(16,185,129,0.35)] transition-all active:scale-95 disabled:opacity-50 group"
                title="I have watched this movie or TV show — save to watch history and show next recommendation"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Watched It? Next</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* PRIMARY NEXT BUTTON 2: "Next" */}
              <button
                onClick={() => handleNext(false)}
                disabled={loading || isFlippingNext}
                className="flex items-center justify-center gap-1 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 hover:border-cyan-400/40 transition-all active:scale-95 disabled:opacity-50 group"
                title="Skip to next movie or TV show without marking as watched"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Watchlist Toggle */}
              <button
                onClick={() => toggleWatchlist(movie)}
                disabled={loading || isFlippingNext}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50 ${
                  inWatchlist
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                }`}
                title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{inWatchlist ? 'Saved' : 'Watchlist'}</span>
              </button>

              {/* Full Details Modal */}
              <button
                onClick={() => {
                  onClose();
                  onOpenDetails(movie.id);
                }}
                disabled={loading || isFlippingNext}
                className="flex items-center justify-center gap-1 px-3.5 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-teal-200 shadow-[0_4px_16px_rgba(6,182,212,0.35)] active:scale-95 transition-all disabled:opacity-50"
              >
                <span>Details</span>
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
