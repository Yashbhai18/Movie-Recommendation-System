import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, Film, Tv, Loader2, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';
import * as api from '../services/api';

export default function DynamicSearchModal({ isOpen, onClose, onSelectMovie }) {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'movie', 'tv'
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [source, setSource] = useState(null);

  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search effect
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      setError(null);
      setHasSearched(false);
      setSource(null);
      return;
    }

    let active = true;
    setIsSearching(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const data = await api.searchMovies(trimmed, filterType);
        if (active) {
          setResults(Array.isArray(data.results) ? data.results : []);
          setSource(data.source || 'tmdb');
          setHasSearched(true);
          setIsSearching(false);
        }
      } catch (err) {
        if (active) {
          console.error('Search error:', err);
          setError(err.message || 'Failed to complete search query with TMDB.');
          setIsSearching(false);
          setHasSearched(true);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, filterType]);

  const handleRetry = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsSearching(true);
    setError(null);
    api.searchMovies(trimmed, filterType)
      .then(data => {
        setResults(Array.isArray(data.results) ? data.results : []);
        setSource(data.source || 'tmdb');
        setHasSearched(true);
      })
      .catch(err => {
        setError(err.message || 'Failed to complete search query with TMDB.');
      })
      .finally(() => setIsSearching(false));
  };

  const handleSelect = (movie) => {
    onSelectMovie(movie.id, movie.media_type);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 pb-6 bg-[#080c14]/85 backdrop-blur-xl animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-4xl bg-surface-container-lowest border-2 border-outline shadow-[8px_8px_0px_#1a1a1a] flex flex-col overflow-hidden text-on-surface my-auto"
      >
        {/* Top Bauhaus Strip */}
        <div className="flex items-center justify-between px-4 py-2 bg-primary text-on-primary font-label text-[11px] uppercase tracking-wider font-bold border-b-2 border-outline">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-primary-fixed border border-outline animate-pulse"></span>
            <span>TMDB Global Registry // Dynamic Cinema & TV Scanner</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-on-primary-variant font-mono text-[10px]">PRESS ESC TO CLOSE</span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded border border-transparent hover:border-outline transition-colors text-white"
              title="Close Search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 bg-surface-container border-b-2 border-outline space-y-4">
          <div className="relative flex items-center bg-surface-container-lowest border-2 border-outline shadow-[3px_3px_0px_#1a1a1a] focus-within:ring-2 focus-within:ring-secondary">
            <Search className="w-5 h-5 text-on-surface-variant ml-4 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search millions of movies and TV shows across TMDB..."
              className="w-full py-3.5 px-3 bg-transparent text-sm sm:text-base font-headline font-bold uppercase tracking-tight text-on-surface placeholder:normal-case placeholder:font-body placeholder:text-on-surface-variant focus:outline-none"
            />
            {isSearching ? (
              <div className="mr-4">
                <Loader2 className="w-5 h-5 text-secondary animate-spin" />
              </div>
            ) : query ? (
              <button
                onClick={() => setQuery('')}
                className="mr-3 p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          {/* Filter Pills & Status Indicators */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3.5 py-1.5 font-label text-[11px] uppercase font-bold tracking-wider border-2 border-outline transition-all ${
                  filterType === 'all'
                    ? 'bg-primary text-on-primary shadow-[2px_2px_0px_#1a1a1a]'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                }`}
              >
                All Titles
              </button>
              <button
                onClick={() => setFilterType('movie')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 font-label text-[11px] uppercase font-bold tracking-wider border-2 border-outline transition-all ${
                  filterType === 'movie'
                    ? 'bg-primary-fixed text-on-primary-fixed shadow-[2px_2px_0px_#1a1a1a]'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <Film className="w-3 h-3" />
                <span>Movies</span>
              </button>
              <button
                onClick={() => setFilterType('tv')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 font-label text-[11px] uppercase font-bold tracking-wider border-2 border-outline transition-all ${
                  filterType === 'tv'
                    ? 'bg-secondary text-white shadow-[2px_2px_0px_#1a1a1a]'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <Tv className="w-3 h-3" />
                <span>TV Series</span>
              </button>
            </div>

            {hasSearched && !isSearching && !error && (
              <div className="text-[11px] font-label uppercase font-bold text-on-surface-variant flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>
                  {results.length} {results.length === 1 ? 'Specimen' : 'Specimens'} Found
                </span>
                {source && (
                  <span className="px-1.5 py-0.5 bg-surface-container-high border border-outline text-[9px]">
                    SOURCE: {source.toUpperCase()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto bg-surface-container-lowest divide-y divide-surface-variant">
          
          {/* Default state when search query is empty */}
          {!query.trim() && (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-surface-container border-2 border-outline flex items-center justify-center mx-auto mb-3 text-secondary">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-base sm:text-lg font-bold uppercase text-on-surface">
                Discover Dynamic Cinema & Television
              </h3>
              <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-md mx-auto leading-relaxed">
                Type any movie or TV series title to query the live TMDB database. Instant access to posters, synopses, ratings, and trailers.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-[10px] font-label uppercase font-bold text-on-surface-variant mr-1">Try Searching:</span>
                {['Dune: Part Two', 'Shogun', 'Severance', 'Interstellar', 'The Bear', 'Oppenheimer'].map(s => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high border border-outline text-[11px] font-headline font-bold uppercase text-on-surface transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isSearching && (
            <div className="py-8 space-y-4">
              <div className="flex items-center justify-center gap-3 text-secondary py-4 font-headline text-xs font-bold uppercase tracking-wider">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Querying TMDB Global Network...</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="border-2 border-outline bg-surface-container p-3 animate-pulse flex gap-3 h-36"
                  >
                    <div className="w-20 bg-surface-variant shrink-0 border border-outline"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-surface-variant w-3/4"></div>
                      <div className="h-3 bg-surface-variant w-1/2"></div>
                      <div className="h-10 bg-surface-variant w-full mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {!isSearching && error && (
            <div className="p-6 bg-red-500/10 border-2 border-secondary my-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3 text-secondary">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="font-headline font-bold text-sm uppercase text-on-surface">
                    Search Request Failed
                  </h4>
                  <p className="font-body text-xs text-on-surface-variant mt-0.5">
                    {error}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-secondary text-white font-label text-xs font-bold uppercase border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] hover:bg-red-700 transition-colors shrink-0"
              >
                Retry Search
              </button>
            </div>
          )}

          {/* No Results Found State */}
          {!isSearching && !error && hasSearched && results.length === 0 && (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 bg-surface-container border-2 border-outline flex items-center justify-center mx-auto mb-3 text-on-surface-variant">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-base sm:text-lg font-bold uppercase text-on-surface">
                No Results Found For &ldquo;{query}&rdquo;
              </h3>
              <p className="font-body text-xs text-on-surface-variant mt-1.5 max-w-sm mx-auto">
                No matching movies or television series found on TMDB. Check the spelling or try searching a broader title.
              </p>
              <button
                onClick={() => setQuery('')}
                className="mt-4 px-4 py-1.5 bg-primary-fixed text-on-primary-fixed font-label text-xs uppercase font-bold border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] hover:bg-primary hover:text-white transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Results Cards Grid */}
          {!isSearching && !error && results.length > 0 && (
            <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((item) => (
                <SearchResultCard
                  key={`${item.media_type}_${item.id}`}
                  item={item}
                  onClick={() => handleSelect(item)}
                />
              ))}
            </div>
          )}

        </div>

        {/* Footer Attribution Banner (Required by TMDB) */}
        <div className="p-3 bg-surface-container border-t-2 border-outline flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-label text-on-surface-variant font-semibold">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-surface-container-lowest border border-outline font-bold text-on-surface">
              TMDB API
            </span>
            <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
          </div>
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-secondary hover:underline font-bold"
          >
            <span>themoviedb.org</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
}

function SearchResultCard({ item, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isTv = item.media_type === 'tv';
  const posterUrl = item.poster_path || item.backdrop_path;

  return (
    <div
      onClick={onClick}
      className="group relative bg-surface-container-lowest border-2 border-outline p-3 shadow-[3px_3px_0px_#1a1a1a] hover:shadow-[5px_5px_0px_#1a1a1a] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer flex gap-3 overflow-hidden"
    >
      {/* Poster Column */}
      <div className="w-20 sm:w-24 aspect-[2/3] shrink-0 bg-surface-container border border-outline overflow-hidden relative">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 bg-surface-container flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-secondary animate-spin" />
          </div>
        )}

        {!imgError && posterUrl ? (
          <img
            src={posterUrl}
            alt={item.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-surface-container">
            {isTv ? <Tv className="w-6 h-6 text-on-surface-variant mb-1" /> : <Film className="w-6 h-6 text-on-surface-variant mb-1" />}
            <span className="text-[8px] font-bold text-on-surface-variant line-clamp-1">No Image</span>
          </div>
        )}

        {/* Media Type Floating Pill */}
        <span
          className={`absolute top-1 left-1 px-1.5 py-0.5 text-[8px] font-label uppercase font-bold tracking-wider border border-outline ${
            isTv ? 'bg-secondary text-white' : 'bg-primary-fixed text-on-primary-fixed'
          }`}
        >
          {isTv ? 'TV' : 'MOVIE'}
        </span>
      </div>

      {/* Info Details Column */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          {/* Header Row: Year & Rating */}
          <div className="flex items-center justify-between gap-1 text-[10px] font-label font-bold text-on-surface-variant mb-1">
            <span className="text-secondary font-mono">{item.year || (item.release_date ? item.release_date.split('-')[0] : 'ARCHIVE')}</span>
            {item.vote_average > 0 ? (
              <span className="inline-flex items-center gap-0.5 text-amber-500 font-headline font-bold">
                <Star className="w-3 h-3 fill-current" />
                <span>{item.vote_average.toFixed(1)}</span>
              </span>
            ) : (
              <span className="text-on-surface-variant font-mono text-[9px]">UNRATED</span>
            )}
          </div>

          {/* Title */}
          <h4 className="font-headline font-bold text-xs uppercase tracking-tight text-on-surface line-clamp-1 group-hover:text-secondary transition-colors">
            {item.title}
          </h4>

          {/* Overview Synopsis (Clamped 2-3 lines) */}
          <p className="font-body text-[11px] text-on-surface-variant line-clamp-2 sm:line-clamp-3 mt-1 leading-snug">
            {item.overview || 'Comprehensive dossier and metadata archived in TMDB catalog.'}
          </p>
        </div>

        {/* Action Row */}
        <div className="mt-2 pt-1 border-t border-surface-variant flex items-center justify-between text-[10px] font-label uppercase font-bold text-secondary">
          <span>View Dossier</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
