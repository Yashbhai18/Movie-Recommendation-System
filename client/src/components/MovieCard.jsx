import React, { useState } from 'react';
import { Star, Plus, Check, Play, Film, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const POSTER_LOOKUP = {
  693134: 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
  'dune: part two': 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
  'dune 2': 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
  'dune': 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
  1396: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  'breaking bad': 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  157336: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  'interstellar': 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  60059: 'https://image.tmdb.org/t/p/w500/zjg4jpK1Wp2kiRvtt5ND0kznako.jpg',
  'better call saul': 'https://image.tmdb.org/t/p/w500/zjg4jpK1Wp2kiRvtt5ND0kznako.jpg',
  872585: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  'oppenheimer': 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  66732: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
  'stranger things': 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
  27205: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
  'inception': 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
  603: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
  'the matrix': 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
  496243: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
  'parasite': 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
  155: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  'the dark knight': 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  335984: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
  'blade runner 2049': 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
  70523: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg',
  'dark': 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg',
  115036: 'https://image.tmdb.org/t/p/w500/fAzHg1AB7ZleOnnxip85DNu165d.jpg',
  'severance': 'https://image.tmdb.org/t/p/w500/fAzHg1AB7ZleOnnxip85DNu165d.jpg',
  94605: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
  'arcane': 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
  87108: 'https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg',
  'chernobyl': 'https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg',
  46648: 'https://image.tmdb.org/t/p/w500/in1R2dDc421JxsoRWaIIAqVI2KE.jpg',
  'true detective': 'https://image.tmdb.org/t/p/w500/in1R2dDc421JxsoRWaIIAqVI2KE.jpg',
  77: 'https://image.tmdb.org/t/p/w500/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg',
  'memento': 'https://image.tmdb.org/t/p/w500/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg',
  264660: 'https://image.tmdb.org/t/p/w500/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg',
  'ex machina': 'https://image.tmdb.org/t/p/w500/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg',
  313369: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkVJt0Rf0.jpg',
  'la la land': 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkVJt0Rf0.jpg',
  194: 'https://image.tmdb.org/t/p/w500/n9o047pzgLbhQpS60n5vA429y5G.jpg',
  'amélie': 'https://image.tmdb.org/t/p/w500/n9o047pzgLbhQpS60n5vA429y5G.jpg'
};

export default function MovieCard({ movie, onSelect, onPlayTrailer }) {
  const { isMovieInWatchlist, toggleWatchlist } = useAuth();
  
  const effectiveId = movie.movieId || movie.id;
  const inWatchlist = isMovieInWatchlist(effectiveId);

  const idKey = String(effectiveId || '');
  const titleKey = (movie.title || '').toLowerCase().trim();
  
  const initialRaw = 
    movie.poster_path || 
    movie.poster || 
    POSTER_LOOKUP[idKey] || 
    POSTER_LOOKUP[titleKey] || 
    movie.backdrop_path || 
    movie.backdrop || 
    null;

  const getFullUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `https://image.tmdb.org/t/p/w500${url.startsWith('/') ? url : '/' + url}`;
  };

  const initialUrl = getFullUrl(initialRaw);

  const [currentSrc, setCurrentSrc] = useState(initialUrl);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(!initialUrl);

  const handleImgError = () => {
    const fallback = POSTER_LOOKUP[idKey] || POSTER_LOOKUP[titleKey] || movie.backdrop_path || movie.backdrop;
    const fallbackUrl = getFullUrl(fallback);
    if (fallbackUrl && fallbackUrl !== currentSrc) {
      setCurrentSrc(fallbackUrl);
    } else {
      setImgError(true);
    }
  };

  return (
    <div
      style={{ contentVisibility: 'auto' }}
      className="group relative bg-surface-container-lowest border-2 border-outline shadow-[4px_4px_0px_#1a1a1a] hover:shadow-[6px_6px_0px_#1a1a1a] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col overflow-hidden text-on-surface"
    >
      {/* Top Header Strip matching Bauhaus cards */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-surface-variant border-b-2 border-outline font-label text-[10px] uppercase font-bold">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-secondary border border-outline"></span>
          <span>{movie.media_type === 'tv' ? 'SERIES' : 'CINEMA SPECIMEN'}</span>
        </span>
        <span className="text-secondary">
          {movie.matchPercentage ? `${movie.matchPercentage}% VECTOR` : movie.year ? `${movie.year}` : 'ARCHIVE'}
        </span>
      </div>

      {/* Poster Container */}
      <div
        className="relative aspect-[2/3] w-full overflow-hidden bg-primary cursor-pointer border-b-2 border-outline"
        onClick={() => onSelect && onSelect(effectiveId)}
      >
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 bg-surface-container flex items-center justify-center">
            <Film className="w-8 h-8 text-on-surface-variant animate-spin" />
          </div>
        )}

        {!imgError && currentSrc ? (
          <img
            src={currentSrc}
            alt={movie.title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setImgLoaded(true)}
            onError={handleImgError}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-surface-container flex flex-col items-center justify-center p-4 text-center">
            <Film className="w-10 h-10 text-on-surface-variant mb-2" />
            <span className="font-headline font-bold text-xs uppercase text-on-surface line-clamp-2">
              {movie.title}
            </span>
          </div>
        )}

        {/* Floating Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {/* TMDB Rating */}
          <div className="flex items-center gap-1 px-2 py-0.5 bg-surface-container-lowest text-on-surface border border-outline font-headline font-bold text-xs shadow-[2px_2px_0px_#1a1a1a]">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>{movie.vote_average ? Number(movie.vote_average).toFixed(1) : '8.4'}</span>
          </div>

          {/* Sensory/Match Tag */}
          <div className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed border border-outline font-label text-[10px] font-bold uppercase shadow-[2px_2px_0px_#1a1a1a]">
            {movie.cognitive_tension ? `${movie.cognitive_tension} Tension` : '96% Match'}
          </div>
        </div>

        {/* Quick Hover Overlay */}
        <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayTrailer ? onPlayTrailer(effectiveId) : onSelect(effectiveId);
            }}
            className="w-12 h-12 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center border-2 border-outline shadow-[3px_3px_0px_#1a1a1a] hover:scale-110 active:scale-95 transition-all pointer-events-auto"
            title="Play Trailer"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-surface-container-lowest">
        <div>
          <h3
            onClick={() => onSelect && onSelect(effectiveId)}
            className="font-headline font-bold text-sm uppercase tracking-tight text-on-surface truncate cursor-pointer hover:text-secondary transition-colors"
          >
            {movie.title}
          </h3>

          <div className="flex items-center justify-between text-[11px] font-label text-on-surface-variant mt-1">
            <span className="truncate">
              {movie.director ? `DIR. ${movie.director.toUpperCase()}` : movie.year || '2024'}
            </span>
            <span className="font-mono text-[10px] text-secondary font-bold">
              {movie.runtime ? `${movie.runtime}M` : '115M'}
            </span>
          </div>

          {movie.overview && (
            <p className="font-body text-xs text-on-surface-variant line-clamp-2 mt-1.5 leading-snug">
              {movie.overview}
            </p>
          )}
        </div>

        {/* Action Button Row */}
        <div className="mt-3 pt-2.5 border-t border-surface-variant flex items-center gap-2">
          <button
            onClick={() => onPlayTrailer ? onPlayTrailer(effectiveId) : onSelect(effectiveId)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-primary-fixed text-on-primary-fixed font-label text-[11px] uppercase font-bold border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] hover:bg-primary hover:text-on-primary active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            <span>Trailer</span>
          </button>

          <button
            onClick={() => toggleWatchlist({
              ...movie,
              id: effectiveId,
              movieId: effectiveId,
              poster_path: currentSrc || movie.poster_path
            })}
            className={`p-1.5 border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              inWatchlist
                ? 'bg-secondary text-white'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
            title={inWatchlist ? 'In Vault' : 'Add to Vault'}
          >
            <span className="material-symbols-outlined text-[16px]">
              {inWatchlist ? 'bookmark_added' : 'bookmark_add'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
