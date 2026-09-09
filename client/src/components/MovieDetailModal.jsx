import React, { useState, useEffect } from 'react';
import {
  X, Star, Clock, Calendar, Globe, Plus, Check, Heart, Play, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function MovieDetailModal({ movieId, onClose, initialPlayTrailer = false }) {
  const { isMovieInWatchlist, toggleWatchlist, isMovieFavorite, toggleFavorite, markAsWatched, history } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [showTrailer, setShowTrailer] = useState(initialPlayTrailer);
  const [hasRated, setHasRated] = useState(false);
  const [prevMovieId, setPrevMovieId] = useState(movieId);

  // Check if movie was previously watched/rated
  const existingHistoryItem = history?.find(h => String(h.movieId) === String(movieId));

  // Adjust state during render when movieId prop changes (React recommended pattern)
  if (movieId !== prevMovieId) {
    setPrevMovieId(movieId);
    setShowTrailer(initialPlayTrailer);
    setHoverRating(0);
    if (existingHistoryItem) {
      setUserRating(existingHistoryItem.userRating > 5 ? Math.round(existingHistoryItem.userRating / 2) : existingHistoryItem.userRating);
      setHasRated(true);
    } else {
      setUserRating(5);
      setHasRated(false);
    }
  }

  const loading = !movie || String(movie.id) !== String(movieId);

  useEffect(() => {
    if (!movieId) return;
    let active = true;

    api.getMovieDetails(movieId)
      .then((data) => {
        if (active) setMovie(data);
      })
      .catch((err) => {
        console.error('Error fetching details:', err);
        if (active) setMovie({ id: movieId, error: true });
      });

    return () => {
      active = false;
    };
  }, [movieId]);

  if (!movieId) return null;

  const inWatchlist = movie ? isMovieInWatchlist(movie.id) : false;
  const isFav = movie ? isMovieFavorite(movie.id) : false;

  const formatRuntime = (mins) => {
    if (!mins) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const handleStarClick = (starNum) => {
    setUserRating(starNum);
    setHasRated(true);
    if (movie) {
      markAsWatched(movie, starNum);
    }
  };

  const handleRateAndWatch = () => {
    if (!movie) return;
    markAsWatched(movie, userRating);
    setHasRated(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      
      <div className="relative w-full max-w-4xl bg-[#080C16] border border-white/15 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)] my-auto backdrop-blur-2xl">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-teal-400/20 rounded-[30px] blur-2xl opacity-50 -z-10 pointer-events-none"></div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-slate-300 hover:text-white transition-all z-20 backdrop-blur-xl shadow-lg active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="p-20 text-center text-slate-400">
            <div className="w-12 h-12 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold tracking-wide text-slate-300">Loading cinematic intelligence...</p>
          </div>
        ) : movie ? (
          <div>
            
            {/* Backdrop & Trailer Player */}
            <div className="relative h-64 sm:h-84 w-full overflow-hidden bg-slate-950">
              {showTrailer && movie.trailer_key ? (
                <div className="w-full h-full relative">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${movie.trailer_key}?autoplay=1&rel=0&modestbranding=1`}
                    title={`${movie.title} Trailer`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  ></iframe>
                  <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                    <button
                      onClick={() => setShowTrailer(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-white/15 text-xs font-bold text-slate-200 hover:text-white transition-colors shadow"
                    >
                      Back to Photo
                    </button>
                    <a
                      href={`https://www.youtube.com/watch?v=${movie.trailer_key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-500 backdrop-blur-md text-xs font-bold text-white shadow-lg shadow-red-600/30 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Watch on YouTube</span>
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={movie.backdrop_path || movie.poster_path || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80'}
                    alt={movie.title}
                    className="w-full h-full object-cover opacity-60 transform scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080C16] via-[#080C16]/60 to-transparent"></div>

                  {/* Play trailer button if key exists */}
                  {movie.trailer_key && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="absolute inset-0 m-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
                      title="Play Trailer"
                    >
                      <Play className="w-7 h-7 fill-slate-950 translate-x-0.5" />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-8 -mt-20 relative z-10">
              <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
                
                {/* Left: Poster with elevated glass frame */}
                <div className="shrink-0 w-36 sm:w-52 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.85)] border border-white/20 bg-slate-900 hidden sm:block relative group">
                  <img
                    src={movie.poster_path || 'https://via.placeholder.com/300x450'}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Right: Details & Meta */}
                <div className="flex-1">
                  
                  {/* Title & Tagline */}
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {movie.title}
                  </h1>
                  {movie.tagline && (
                    <p className="text-sm text-cyan-300/80 italic mt-1">
                      "{movie.tagline}"
                    </p>
                  )}

                  {/* Meta Chips */}
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}</span>
                      {movie.vote_count && (
                        <span className="text-[10px] text-amber-400/70 font-normal">
                          ({movie.vote_count})
                        </span>
                      )}
                    </div>

                    {movie.year && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{movie.year}</span>
                      </span>
                    )}

                    {movie.runtime && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatRuntime(movie.runtime)}</span>
                      </span>
                    )}

                    {movie.country && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span>{movie.country}</span>
                      </span>
                    )}
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {movie.genres?.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  {/* Synopsis */}
                  <div className="mt-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Synopsis
                    </h3>
                    <p className="text-sm text-slate-200 leading-relaxed font-light">
                      {movie.overview || 'No synopsis available.'}
                    </p>
                  </div>

                  {/* Director & Cast */}
                  <div className="mt-5 pt-5 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {movie.director && (
                      <div>
                        <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
                          Director
                        </span>
                        <span className="text-sm font-semibold text-slate-100">
                          {movie.director}
                        </span>
                      </div>
                    )}

                    {movie.cast && movie.cast.length > 0 && (
                      <div>
                        <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
                          Key Cast
                        </span>
                        <span className="text-sm text-slate-200">
                          {movie.cast.map(c => typeof c === 'string' ? c : c.name).slice(0, 4).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions & Rating Bar */}
                  <div className="mt-8 pt-6 border-t border-white/10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                    
                    {/* Watchlist & Favorite Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleWatchlist(movie)}
                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all duration-300 active:scale-95 ${
                          inWatchlist
                            ? 'bg-emerald-500 text-slate-950 shadow-[0_4px_20px_rgba(16,185,129,0.35)]'
                            : 'bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-teal-200 text-slate-950 shadow-[0_4px_20px_rgba(6,182,212,0.35)]'
                        }`}
                      >
                        {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        <span>{inWatchlist ? 'Saved in Watchlist' : 'Add to Watchlist'}</span>
                      </button>

                      <button
                        onClick={() => toggleFavorite(movie)}
                        className={`p-3 rounded-xl border transition-all duration-300 active:scale-95 ${
                          isFav
                            ? 'bg-rose-500 border-rose-400 text-white shadow-[0_4px_20px_rgba(244,63,94,0.35)]'
                            : 'bg-white/[0.05] border-white/15 text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                        title="Add to Favorites"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* 5-Star Interactive Rating & Mark Watched */}
                    <div className="flex flex-nowrap items-center justify-between sm:justify-start gap-2.5 sm:gap-3.5 p-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 shrink-0 select-none shadow-inner backdrop-blur-md">
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-slate-400 shrink-0">Rate:</span>
                        
                        {/* 5 Clickable Stars */}
                        <div 
                          className="flex items-center gap-0.5 shrink-0"
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          {[1, 2, 3, 4, 5].map((starNum) => {
                            const isFilled = starNum <= (hoverRating || userRating);
                            return (
                              <button
                                key={starNum}
                                type="button"
                                onClick={() => handleStarClick(starNum)}
                                onMouseEnter={() => setHoverRating(starNum)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:scale-125 active:scale-95 transition-transform duration-150 focus:outline-none shrink-0"
                                title={`Rate ${starNum} of 5 stars`}
                                aria-label={`Rate ${starNum} out of 5 stars`}
                              >
                                <Star
                                  className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-colors duration-150 ${
                                    isFilled
                                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]'
                                      : 'fill-transparent text-slate-600 hover:text-slate-400'
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>

                        {/* Rating Score & Descriptor with fixed width */}
                        <div className="flex items-center gap-1.5 ml-0.5 w-[96px] shrink-0">
                          <span className="text-xs font-black text-amber-300 w-[24px] text-left shrink-0">
                            {hoverRating || userRating}★
                          </span>
                          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline-block truncate">
                            {
                              {
                                1: 'Poor',
                                2: 'Fair',
                                3: 'Good',
                                4: 'Great',
                                5: 'Masterpiece'
                              }[hoverRating || userRating]
                            }
                          </span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-4 w-px bg-white/10 shrink-0 hidden sm:block"></div>

                      <button
                        onClick={handleRateAndWatch}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 min-w-[102px] text-center active:scale-95 ${
                          hasRated || existingHistoryItem
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 shadow-sm'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {hasRated || existingHistoryItem ? '✓ Watched' : 'Mark Watched'}
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            Movie details could not be loaded.
          </div>
        )}

      </div>
    </div>
  );
}
