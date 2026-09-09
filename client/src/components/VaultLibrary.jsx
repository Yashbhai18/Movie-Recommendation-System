import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MovieCard from './MovieCard';

export default function VaultLibrary({ onSelectMovie, onPlayTrailer, onOpenSurprise }) {
  const { watchlist, favorites, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('watchlist');

  const rawMovies = activeTab === 'favorites' ? favorites : watchlist;
  const displayedMovies = rawMovies.map(item => {
    const realId = item.movieId || item.id;
    return {
      ...item,
      id: realId,
      movieId: realId,
      poster_path: item.poster_path || item.backdrop_path,
    };
  });

  return (
    <div className="w-full flex flex-col bg-background text-on-surface">
      
      {/* Top Metatag Strip */}
      <div className="w-full bg-primary text-on-primary py-2 px-6 lg:px-12 flex flex-wrap items-center justify-between text-[11px] font-label font-bold uppercase tracking-wider border-b-2 border-outline">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse border border-outline"></span>
            ARCHIVE DECK // SYSTEM ONLINE
          </span>
          <span className="text-[#8a8780]">/</span>
          <span className="text-[#d6d1c9]">NODE: 09-BAUHAUS-CORE</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-primary-fixed transition-colors cursor-pointer">CACHE: 100% SYNCED</span>
          <span className="text-[#8a8780]">/</span>
          <span>INDEX REVISION: 2026.09.08</span>
        </div>
      </div>

      {/* Header Module: Bold Geometric Bauhaus Header */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-6">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-6 border-b-2 border-outline">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high text-on-surface text-xs font-label uppercase font-bold tracking-widest border border-outline">
              <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
              Archive Registry & Sensory Vault
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter uppercase text-on-surface leading-none">
              Cinema Vault <span className="text-secondary">&</span><br className="hidden sm:inline" /> Taste Archive
            </h1>
          </div>

          {/* Persona Profile Chip & Metrics Bento */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Persona Chip */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-surface-container-lowest border-2 border-outline shadow-[2px_2px_0px_#1a1a1a]">
              <div className="w-9 h-9 rounded-full bg-secondary text-white font-headline font-bold text-sm flex items-center justify-center border border-outline">
                {currentUser?.displayName?.slice(0, 2).toUpperCase() || 'LV'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-headline font-bold text-on-surface uppercase tracking-tight">
                  {currentUser?.displayName || 'Leo Vance'}
                </span>
                <span className="text-[10px] font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                  Sci-Fi / Noir Specialist
                </span>
              </div>
            </div>

            {/* Metric 1: Total Films */}
            <div className="px-5 py-2.5 bg-surface-container text-on-surface flex flex-col justify-center min-w-[110px] border-2 border-outline shadow-[2px_2px_0px_#1a1a1a]">
              <span className="font-label text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
                Cataloged
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-headline text-2xl font-bold leading-tight">
                  {watchlist.length + 120}
                </span>
                <span className="font-label text-xs font-bold text-secondary">FILMS</span>
              </div>
            </div>

            {/* Metric 2: Runtime */}
            <div className="px-5 py-2.5 bg-primary-fixed text-on-primary-fixed flex flex-col justify-center min-w-[110px] border-2 border-outline shadow-[2px_2px_0px_#1a1a1a]">
              <span className="font-label text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
                Cumulative
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-headline text-2xl font-bold leading-tight">284</span>
                <span className="font-label text-xs font-bold">HRS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full font-label text-xs uppercase tracking-wider font-bold transition-all border-2 border-outline ${
              activeTab === 'watchlist'
                ? 'bg-primary text-on-primary shadow-[3px_3px_0px_#1a1a1a]'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary shadow-[0_0_8px_#0055ff]"></span>
            <span>Watchlist</span>
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-tertiary text-white font-bold">
              {watchlist.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full font-label text-xs uppercase tracking-wider font-bold transition-all border-2 border-outline ${
              activeTab === 'favorites'
                ? 'bg-primary text-on-primary shadow-[3px_3px_0px_#1a1a1a]'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_#e63b2e]"></span>
            <span>Favorites</span>
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-surface-container text-on-surface font-bold">
              {favorites.length}
            </span>
          </button>

          <button
            onClick={onOpenSurprise}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-label text-xs uppercase tracking-wider font-bold transition-all border-2 border-outline bg-primary-fixed text-on-primary-fixed shadow-[3px_3px_0px_#1a1a1a] hover:bg-primary hover:text-white ml-auto"
          >
            <span className="material-symbols-outlined text-[16px]">shuffle</span>
            <span>Break Taste Bubble</span>
          </button>
        </div>
      </section>

      {/* Taste Profile Insights Bar */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-4">
        <div className="bg-surface-container border-2 border-outline p-6 shadow-[3px_3px_0px_#1a1a1a]">
          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            
            {/* Pillar 1: Top Directors */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs uppercase font-bold tracking-widest text-on-surface flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary border border-outline"></span>
                  Director Affinities
                </span>
                <span className="text-[11px] font-label text-on-surface-variant font-semibold">142 SCANNED</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs font-label font-bold text-on-surface mb-1">
                    <span>Christopher Nolan</span>
                    <span className="text-secondary">94%</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-variant overflow-hidden border border-outline">
                    <div className="h-full bg-secondary" style={{ width: '94%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-label font-bold text-on-surface mb-1">
                    <span>Denis Villeneuve</span>
                    <span className="text-tertiary">88%</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-variant overflow-hidden border border-outline">
                    <div className="h-full bg-tertiary" style={{ width: '88%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-label font-bold text-on-surface mb-1">
                    <span>Bong Joon-ho</span>
                    <span className="text-primary">76%</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-variant overflow-hidden border border-outline">
                    <div className="h-full bg-primary" style={{ width: '76%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar 2: Dominant Moods */}
            <div className="flex-1 bg-surface-container-lowest border-2 border-outline p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-label text-xs uppercase font-bold tracking-widest text-on-surface flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-fixed border border-outline"></span>
                  Dominant Moods
                </span>
                <span className="material-symbols-outlined text-base text-on-surface-variant">donut_large</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container p-3 border border-outline">
                  <span className="font-headline text-2xl font-bold text-on-surface leading-none">42%</span>
                  <p className="font-label text-[11px] uppercase font-bold tracking-wider text-secondary mt-1">
                    Mind-Bending
                  </p>
                  <p className="text-[10px] text-on-surface-variant font-body">Non-linear & existential</p>
                </div>
                <div className="bg-surface-container p-3 border border-outline">
                  <span className="font-headline text-2xl font-bold text-on-surface leading-none">28%</span>
                  <p className="font-label text-[11px] uppercase font-bold tracking-wider text-tertiary mt-1">
                    Dark Noir
                  </p>
                  <p className="text-[10px] text-on-surface-variant font-body">Urban & high-tension</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Grid of Saved Movies */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="flex items-center justify-between pb-4 border-b-2 border-outline mb-6">
          <h2 className="font-headline text-xl sm:text-2xl font-bold uppercase tracking-tight text-on-surface">
            {activeTab === 'favorites' ? 'Curated Favorites' : 'Saved Watchlist'} ({displayedMovies.length})
          </h2>
          <span className="font-label text-xs uppercase text-on-surface-variant font-semibold">
            SYNCHRONIZED WITH LOCAL VAULT
          </span>
        </div>

        {displayedMovies.length === 0 ? (
          <div className="p-12 text-center bg-surface-container border-2 border-outline shadow-bauhaus">
            <span className="material-symbols-outlined text-5xl text-secondary mb-3">bookmark_border</span>
            <h3 className="font-headline text-xl font-bold uppercase text-on-surface">
              Your Vault Is Empty
            </h3>
            <p className="font-body text-sm text-on-surface-variant mt-2 max-w-md mx-auto">
              Browse the Cinema Discovery or test your taste with the Taste-Breaker Engine to add movies to your personal vault archive.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={onSelectMovie}
                onPlayTrailer={onPlayTrailer}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
