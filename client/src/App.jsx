import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import CinemaDiscovery from './components/CinemaDiscovery';
import TasteBreakerEngine from './components/TasteBreakerEngine';
import MoodContextPicker from './components/MoodContextPicker';
import VaultLibrary from './components/VaultLibrary';
import MovieDetailPage from './components/MovieDetailPage';
import DynamicSearchModal from './components/DynamicSearchModal';
import AuthModal from './components/AuthModal';
import TmdbKeyModal from './components/TmdbKeyModal';
import ProfilePage from './components/ProfilePage';
import * as api from './services/api';
import { ArrowUp } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#surprise-me') return 'surprise-me';
      if (window.location.hash === '#mood-matrix') return 'mood-matrix';
      if (window.location.hash === '#vault-library') return 'vault-library';
      if (window.location.hash === '#profile' || window.location.hash === '#user-profile') return 'profile';
    }
    return 'discover';
  });

  const [selectedMovieId, setSelectedMovieId] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('movie-')) {
        return hash.replace('movie-', '');
      } else if (hash.startsWith('tv-')) {
        return hash.replace('tv-', '');
      }
    }
    return null;
  });

  const [selectedMediaType, setSelectedMediaType] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('tv-')) return 'tv';
    }
    return 'movie';
  });

  const [autoPlayTrailer, setAutoPlayTrailer] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleTabChange = (tab) => {
    setSelectedMovieId(null);
    setAutoPlayTrailer(false);
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab === 'discover' ? '' : tab;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync state if user navigates with browser back/forward buttons or clicks hash links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('movie-')) {
        setSelectedMovieId(hash.replace('movie-', ''));
        setSelectedMediaType('movie');
      } else if (hash.startsWith('tv-')) {
        setSelectedMovieId(hash.replace('tv-', ''));
        setSelectedMediaType('tv');
      } else if (['surprise-me', 'mood-matrix', 'vault-library', 'profile', 'user-profile'].includes(hash)) {
        setSelectedMovieId(null);
        setActiveTab('profile' === hash || 'user-profile' === hash ? 'profile' : hash);
      } else {
        setSelectedMovieId(null);
        setActiveTab('discover');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTmdbOpen, setIsTmdbOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const pickerRef = useRef(null);

  // Monitor scroll for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load trending movies
  useEffect(() => {
    api.getTrendingMovies()
      .then((data) => {
        setTrendingMovies(data.results ? data.results.slice(0, 16) : []);
      })
      .catch((err) => console.error('Error fetching trending:', err))
      .finally(() => setTrendingLoading(false));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMovie = (id, mediaType = null) => {
    setAutoPlayTrailer(false);
    setSelectedMovieId(id);
    const resolvedType = mediaType || (typeof id === 'string' && id.startsWith('tv_') ? 'tv' : 'movie');
    setSelectedMediaType(resolvedType);
    if (typeof window !== 'undefined') {
      const prefix = resolvedType === 'tv' ? 'tv' : 'movie';
      window.location.hash = `${prefix}-${id}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayTrailer = (id, mediaType = null) => {
    setAutoPlayTrailer(true);
    setSelectedMovieId(id);
    const resolvedType = mediaType || 'movie';
    setSelectedMediaType(resolvedType);
    if (typeof window !== 'undefined') {
      const prefix = resolvedType === 'tv' ? 'tv' : 'movie';
      window.location.hash = `${prefix}-${id}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    setSelectedMovieId(null);
    setAutoPlayTrailer(false);
    if (typeof window !== 'undefined') {
      window.location.hash = activeTab === 'discover' ? '' : activeTab;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWatchlist = () => {
    setSelectedMovieId(null);
    handleTabChange('vault-library');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed relative">
      
      {/* Sticky Navigation matching Stitch Bauhaus Edition */}
      <Navbar
        activeTab={selectedMovieId ? '' : activeTab}
        onTabChange={handleTabChange}
        onOpenSurprise={() => handleTabChange('surprise-me')}
        onOpenWatchlist={handleOpenWatchlist}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenTmdb={() => setIsTmdbOpen(true)}
        onSelectMovie={handleSelectMovie}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => handleTabChange('profile')}
      />

      {/* Main Content Area */}
      <main className="relative z-10 w-full pt-20 bg-background min-h-screen pb-16 flex-1">
        {selectedMovieId ? (
          <div className="animate-fade-in">
            <MovieDetailPage
              movieId={selectedMovieId}
              mediaType={selectedMediaType}
              initialPlayTrailer={autoPlayTrailer}
              onBack={handleBackFromDetail}
            />
          </div>
        ) : (
          <>
            {/* VIEW 1: THE TASTE-BREAKER ENGINE (Serendipity Protocol 04-X) */}
            {activeTab === 'surprise-me' && (
              <div className="animate-fade-in">
                <TasteBreakerEngine
                  onSelectMovie={handleSelectMovie}
                  onPlayTrailer={handlePlayTrailer}
                />
              </div>
            )}

            {/* VIEW 2: CINEMA DISCOVERY (Hero Stage & 4K Player Dock) */}
            {activeTab === 'discover' && (
              <div className="animate-fade-in">
                <CinemaDiscovery
                  movies={trendingMovies}
                  loading={trendingLoading}
                  onSelectMovie={handleSelectMovie}
                  onPlayTrailer={handlePlayTrailer}
                  onOpenSurprise={() => {
                    setActiveTab('surprise-me');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}

            {/* VIEW 3: MOOD MATRIX & SENSORY CONTINUUM (Bauhaus 2D Cartesian) */}
            {activeTab === 'mood-matrix' && (
              <div className="animate-fade-in">
                <MoodContextPicker
                  pickerRef={pickerRef}
                  onSelectMovie={handleSelectMovie}
                  onPlayTrailer={handlePlayTrailer}
                />
              </div>
            )}

            {/* VIEW 4: CINEMA VAULT & TASTE ARCHIVE */}
            {activeTab === 'vault-library' && (
              <div className="animate-fade-in">
                <VaultLibrary
                  onSelectMovie={handleSelectMovie}
                  onPlayTrailer={handlePlayTrailer}
                  onOpenSurprise={() => {
                    setActiveTab('surprise-me');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
            {/* VIEW 5: USER PROFILE */}
            {activeTab === 'profile' && (
              <div className="animate-fade-in">
                <ProfilePage onSelectMovie={handleSelectMovie} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Bauhaus Editorial Footer */}
      <footer className="w-full bg-surface-container-low border-t-2 border-outline py-8 px-6 lg:px-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-label text-xs uppercase font-bold text-on-surface-variant">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-secondary border border-outline"></span>
            <span>CINEPULSE ARCHITECTURE // Bauhaus Kinetic Cinema</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setActiveTab('discover')} className="hover:text-on-surface transition-colors">
              Manifesto
            </button>
            <button onClick={() => setActiveTab('mood-matrix')} className="hover:text-on-surface transition-colors">
              Curation System
            </button>
            <button onClick={() => setActiveTab('surprise-me')} className="hover:text-on-surface transition-colors">
              Sensory Log
            </button>
            <button onClick={() => setActiveTab('vault-library')} className="hover:text-on-surface transition-colors">
              Vault
            </button>
          </div>

          {/* TMDB Mandatory Attribution */}
          <div className="flex items-center gap-3 text-left">
            <a 
              href="https://www.themoviedb.org/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-80 transition-opacity shrink-0"
              title="Powered by The Movie Database (TMDB)"
            >
              <img 
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fd22e3be308fb69d2a9976db5b74a58880644f172e920f4cbf522074f801.svg" 
                alt="TMDB Logo" 
                className="w-7 h-7 object-contain rounded border border-outline bg-black/20 p-0.5" 
              />
            </a>
            <p className="text-[10px] normal-case font-normal max-w-xs text-on-surface-variant leading-tight">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 bg-surface-container-lowest text-on-surface rounded-full border-2 border-outline shadow-bauhaus hover:bg-primary hover:text-white transition-all active:translate-x-0.5 active:translate-y-0.5"
          title="Return to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Dynamic TMDB Live Search Modal (Command Palette) */}
      <DynamicSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectMovie={handleSelectMovie}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* TMDB Key Setup Modal */}
      <TmdbKeyModal
        isOpen={isTmdbOpen}
        onClose={() => setIsTmdbOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
