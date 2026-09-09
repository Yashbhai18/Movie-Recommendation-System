import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Default to Alex Chen (Sci-Fi buff) so features can be evaluated immediately
  const [currentUser, setCurrentUser] = useState({
    id: 'demo-scifi',
    username: 'alex_scifi',
    displayName: 'Alex Chen',
    email: 'alex.chen@cinepulse.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Sci-Fi & Action enthusiast. Give me time loops, black holes, and synthwave soundtracks.',
    tagline: 'Lead Cinematographer & Sensory Vector Scout',
    tasteBubble: {
      dominantGenres: ['Science Fiction', 'Action', 'Adventure'],
      underrepresentedGenres: ['Western', 'Romance', 'Musical', 'Animation']
    }
  });

  const [demoProfiles, setDemoProfiles] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [tmdbConfig, setTmdbConfig] = useState({ hasKey: false });
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg, type = 'info') => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  const loadProfiles = useCallback(async () => {
    try {
      const data = await api.getDemoProfiles();
      if (data.profiles) setDemoProfiles(data.profiles);
    } catch (err) {
      console.error('Error loading profiles:', err);
    }
  }, []);

  const loadTmdbConfig = useCallback(async () => {
    try {
      const data = await api.getTmdbConfig();
      setTmdbConfig(data);
    } catch (err) {
      console.error('Error loading TMDB config:', err);
    }
  }, []);

  const loadUserData = useCallback(async (userId) => {
    try {
      const [wlData, favData, histData] = await Promise.all([
        api.getWatchlist(userId).catch(() => ({ watchlist: [] })),
        api.getFavorites(userId).catch(() => ({ favorites: [] })),
        api.getHistory(userId).catch(() => ({ history: [] }))
      ]);
      setWatchlist(wlData.watchlist || []);
      setFavorites(favData.favorites || []);
      setHistory(histData.history || []);
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  }, []);

  // Load profiles and user data
  useEffect(() => {
    loadProfiles();
    loadTmdbConfig();
  }, [loadProfiles, loadTmdbConfig]);

  useEffect(() => {
    if (currentUser?.id) {
      loadUserData(currentUser.id);
    }
  }, [currentUser?.id, loadUserData]);

  // Switch demo profile
  const switchProfile = (profile) => {
    setCurrentUser(profile);
    showToast(`Switched profile to ${profile.displayName} (${profile.tasteBubble?.dominantGenres?.join(', ') || 'Custom'})`, 'success');
  };

  // Login custom user
  const login = async (username, password) => {
    try {
      const res = await api.loginUser(username, password);
      if (res.user) {
        setCurrentUser(res.user);
        showToast(`Welcome back, ${res.user.displayName}!`, 'success');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      return false;
    }
  };

  // Register custom user
  const register = async (username, password, displayName) => {
    try {
      const res = await api.registerUser(username, password, displayName);
      if (res.user) {
        setCurrentUser(res.user);
        showToast(`Account created! Welcome, ${res.user.displayName}!`, 'success');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      return false;
    }
  };

  // Watchlist helpers
  const isMovieInWatchlist = (movieId) => {
    if (!movieId) return false;
    return watchlist.some(w => String(w.movieId) === String(movieId) || String(w.id) === String(movieId));
  };

  const toggleWatchlist = async (movie) => {
    if (!currentUser) {
      showToast('Please log in or select a profile first', 'warning');
      return;
    }

    const effectiveId = movie.movieId || movie.id;
    const inList = isMovieInWatchlist(effectiveId);
    if (inList) {
      try {
        await api.removeFromWatchlist(currentUser.id, effectiveId);
        setWatchlist(prev => prev.filter(w => String(w.movieId) !== String(effectiveId) && String(w.id) !== String(effectiveId)));
        showToast(`Removed "${movie.title}" from Watchlist`, 'info');
      } catch (err) {
        console.error('Failed to remove from watchlist:', err);
        showToast('Failed to update watchlist', 'error');
      }
    } else {
      try {
        const res = await api.addToWatchlist(currentUser.id, {
          ...movie,
          id: effectiveId,
          movieId: effectiveId
        });
        if (res.item) {
          setWatchlist(prev => [res.item, ...prev]);
          showToast(`Added "${movie.title}" to Watchlist!`, 'success');
        }
      } catch (err) {
        console.error('Failed to add to watchlist:', err);
        showToast('Failed to add to watchlist', 'error');
      }
    }
  };

  // Favorites helper
  const isMovieFavorite = (movieId) => {
    if (!movieId) return false;
    return favorites.some(f => String(f.movieId) === String(movieId) || String(f.id) === String(movieId));
  };

  const toggleFavorite = async (movie) => {
    if (!currentUser) return;
    const effectiveId = movie.movieId || movie.id;
    try {
      const res = await api.toggleFavorite(currentUser.id, {
        ...movie,
        id: effectiveId,
        movieId: effectiveId
      });
      if (res.favorited) {
        setFavorites(prev => [res.item, ...prev]);
        showToast(`Added "${movie.title}" to Favorites!`, 'success');
      } else {
        setFavorites(prev => prev.filter(f => String(f.movieId) !== String(effectiveId) && String(f.id) !== String(effectiveId)));
        showToast(`Removed "${movie.title}" from Favorites`, 'info');
      }
    } catch (err) {
      console.error('Failed to update favorites:', err);
      showToast('Failed to update favorites', 'error');
    }
  };

  // Record watched with rating and optional review & tags
  const markAsWatched = async (movie, userRating = 5, reviewText = '', tags = []) => {
    if (!currentUser) return;
    try {
      const res = await api.recordWatched(currentUser.id, movie, userRating, reviewText, tags);
      if (res.item) {
        setHistory(prev => [res.item, ...prev.filter(h => String(h.movieId) !== String(movie.id))]);
        showToast(`Recorded "${movie.title}" as Watched (${userRating}/5 ★)!`, 'success');
        return res.item;
      }
    } catch (err) {
      console.error('Failed to record watched movie:', err);
      showToast('Failed to record watch history', 'error');
    }
  };

  // Update profile details
  const updateProfile = async (updates) => {
    if (!currentUser) return false;
    try {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      setDemoProfiles(prev => prev.map(p => p.id === currentUser.id ? { ...p, ...updates } : p));
      
      await api.updateUserProfile(currentUser.id, updates).catch(() => {});
      showToast('Profile updated successfully!', 'success');
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      showToast('Failed to update profile', 'error');
      return false;
    }
  };

  // Delete review / history item
  const deleteReview = async (historyId) => {
    if (!currentUser) return;
    try {
      await api.deleteHistoryItem(currentUser.id, historyId).catch(() => {});
      setHistory(prev => prev.filter(h => h.id !== historyId && String(h.movieId) !== String(historyId)));
      showToast('Screening log entry removed', 'info');
    } catch (err) {
      console.error('Error deleting review:', err);
      showToast('Failed to remove log', 'error');
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      demoProfiles,
      switchProfile,
      login,
      register,
      watchlist,
      favorites,
      history,
      isMovieInWatchlist,
      toggleWatchlist,
      isMovieFavorite,
      toggleFavorite,
      markAsWatched,
      updateProfile,
      deleteReview,
      tmdbConfig,
      reloadTmdbConfig: loadTmdbConfig,
      showToast
    }}>
      {children}

      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium shadow-2xl backdrop-blur-xl border border-white/10 transition-all duration-300 animate-fade-in bg-slate-900/95 text-slate-100">
          <span className={`w-2.5 h-2.5 rounded-full ${toastMessage.type === 'success' ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : toastMessage.type === 'warning' ? 'bg-amber-400' : 'bg-violet-400'}`}></span>
          <span>{toastMessage.msg}</span>
        </div>
      )}
    </AuthContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export const useAuth = () => useContext(AuthContext);
