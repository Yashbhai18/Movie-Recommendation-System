import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { User, Key, Check } from 'lucide-react';

export default function Navbar({
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenWatchlist,
  onOpenTmdb,
  onOpenAuth,
  onOpenSurprise,
  onOpenProfile
}) {
  const { currentUser, watchlist, tmdbConfig } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  // Keyboard shortcut '/' or 'Cmd+K' to open dynamic TMDB search modal
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) &&
          !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        onOpenSearch && onOpenSearch();
      }
      if (e.key === 'Escape') {
        setShowProfileMenu(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  // Click outside listener for profile menu
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b-2 border-outline">
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Bauhaus Tag */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onTabChange && onTabChange('discover')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 bg-primary text-on-primary flex items-center justify-center border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] group-hover:bg-primary-fixed group-hover:text-on-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-2xl">movie</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xl uppercase tracking-tighter text-on-surface leading-none">
                CinePulse
              </span>
              <span className="font-label text-[10px] tracking-widest uppercase font-semibold text-secondary leading-tight mt-0.5">
                Bauhaus Edition
              </span>
            </div>
          </button>

          {/* Dynamic TMDB Search Trigger (Command Palette) */}
          <button
            type="button"
            onClick={() => onOpenSearch && onOpenSearch()}
            className="hidden md:flex items-center bg-surface-container-lowest border-2 border-outline px-3.5 py-1.5 shadow-[2px_2px_0px_#1a1a1a] hover:bg-surface-container-low hover:border-primary transition-all group text-left cursor-pointer"
            title="Search TMDB Movies & TV Series (⌘K or /)"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-2 group-hover:text-primary transition-colors">
              search
            </span>
            <span className="text-xs font-body text-on-surface-variant w-48 lg:w-64 truncate">
              Search TMDB movies, TV series...
            </span>
            <span className="font-label text-[10px] font-bold bg-surface-container-high px-1.5 py-0.5 border border-outline text-on-surface-variant ml-2 group-hover:bg-primary group-hover:text-on-primary transition-colors">
              ⌘K
            </span>
          </button>
        </div>

        {/* Navigation Tabs & Right Action Cluster */}
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => onTabChange && onTabChange('discover')}
              className={`px-4 py-2 font-label uppercase tracking-wider font-bold text-xs transition-all border-2 border-outline ${
                activeTab === 'discover'
                  ? 'bg-primary text-on-primary shadow-[2px_2px_0px_#1a1a1a]'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent hover:bg-surface-container'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => onTabChange && onTabChange('mood-matrix')}
              className={`px-4 py-2 font-label uppercase tracking-wider font-bold text-xs transition-all border-2 border-outline ${
                activeTab === 'mood-matrix'
                  ? 'bg-primary text-on-primary shadow-[2px_2px_0px_#1a1a1a]'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent hover:bg-surface-container'
              }`}
            >
              Mood Matrix
            </button>
            <button
              onClick={() => onTabChange && onTabChange('vault-library')}
              className={`px-4 py-2 font-label uppercase tracking-wider font-bold text-xs transition-all border-2 border-outline ${
                activeTab === 'vault-library'
                  ? 'bg-primary text-on-primary shadow-[2px_2px_0px_#1a1a1a]'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent hover:bg-surface-container'
              }`}
            >
              Vault Library
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {/* Mobile Search Trigger Icon */}
            <button
              onClick={() => onOpenSearch && onOpenSearch()}
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center border-2 border-outline bg-surface-container-lowest text-on-surface shadow-[1.5px_1.5px_0px_#1a1a1a] hover:bg-surface-container-high transition-all"
              title="Search TMDB Movies & TV Series"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>

            {/* Surprise Me Pill (Bauhaus Yellow) */}
            <button
              onClick={() => {
                if (onTabChange) onTabChange('surprise-me');
                if (onOpenSurprise) onOpenSurprise();
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-label font-bold text-xs uppercase tracking-wider border-2 border-outline transition-all ${
                activeTab === 'surprise-me'
                  ? 'bg-primary text-on-primary shadow-none translate-x-[1px] translate-y-[1px]'
                  : 'bg-primary-fixed text-on-primary-fixed shadow-[3px_3px_0px_#1a1a1a] hover:bg-primary hover:text-on-primary active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
              }`}
            >
              <span className="material-symbols-outlined text-base">shuffle</span>
              <span>Surprise Me</span>
            </button>

            {/* Watchlist Counter */}
            <button
              onClick={() => {
                if (onOpenWatchlist) onOpenWatchlist();
                else if (onTabChange) onTabChange('vault-library');
              }}
              className={`relative w-8 h-8 rounded-full flex items-center justify-center border-2 border-outline transition-all ${
                activeTab === 'vault-library'
                  ? 'bg-primary text-on-primary shadow-none translate-x-[1px] translate-y-[1px]'
                  : 'bg-surface-container-lowest text-on-surface shadow-[1.5px_1.5px_0px_#1a1a1a] hover:bg-surface-container-high'
              }`}
              title="View Cinema Vault & Watchlist"
            >
              <span className={`material-symbols-outlined text-[17px] ${activeTab === 'vault-library' ? 'text-on-primary' : 'text-on-surface'}`}>
                bookmark
              </span>
              {watchlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 rounded-full bg-secondary text-white text-[9px] font-bold flex items-center justify-center border border-outline">
                  {watchlist.length}
                </span>
              )}
            </button>

            {/* Profile Menu */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border border-outline shadow-[1px_1px_0px_#1a1a1a] text-on-primary overflow-hidden"
                title="User profile"
              >
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
                )}
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-72 bg-surface-container-lowest border-2 border-outline shadow-bauhaus-md p-3 z-50 font-body">
                  <div 
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onOpenProfile) onOpenProfile();
                    }}
                    className="p-2 border-b-2 border-outline bg-surface-container-low mb-2 cursor-pointer hover:bg-surface-container-high transition-colors"
                    title="View Full Profile"
                  >
                    <div className="flex items-center gap-3">
                      <img src={currentUser?.avatar} alt="" className="w-10 h-10 border-2 border-outline object-cover" />
                      <div className="min-w-0">
                        <p className="font-headline font-bold text-xs uppercase text-on-surface truncate">
                          {currentUser?.displayName}
                        </p>
                        <p className="text-[10px] text-secondary font-mono truncate">
                          @{currentUser?.username}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t-2 border-outline space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                      className="w-full flex items-center gap-2 p-2 bg-surface-container-low hover:bg-surface-container border border-outline text-xs font-label uppercase font-bold cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenTmdb();
                      }}
                      className="w-full flex items-center justify-between p-2 bg-surface-container-low hover:bg-surface-container border border-outline text-xs font-label uppercase font-bold cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Key className="w-3.5 h-3.5 text-secondary" />
                        <span>TMDB API Config</span>
                      </div>
                      <span className={`w-2 h-2 rounded-full border border-outline ${tmdbConfig.hasKey ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </header>
  );
}
