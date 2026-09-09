import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

// Default initial database state with seed demo profiles & watch histories
const defaultData = {
  users: [
    {
      id: 'demo-scifi',
      username: 'alex_scifi',
      password: 'password123',
      displayName: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Sci-Fi & Action enthusiast. Give me time loops, black holes, and synthwave soundtracks.',
      createdAt: '2026-01-10T12:00:00Z',
      tasteBubble: {
        dominantGenres: ['Science Fiction', 'Action', 'Adventure'],
        underrepresentedGenres: ['Western', 'Romance', 'Musical', 'Animation'],
        favoriteDecades: ['2010s', '2020s']
      }
    },
    {
      id: 'demo-indie',
      username: 'maya_cinema',
      password: 'password123',
      displayName: 'Maya Lin',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      bio: 'Arthouse, foreign dramas, and bittersweet emotional stories that stick with you.',
      createdAt: '2026-02-14T12:00:00Z',
      tasteBubble: {
        dominantGenres: ['Drama', 'Romance', 'Mystery'],
        underrepresentedGenres: ['Action', 'Science Fiction', 'Horror', 'Family'],
        favoriteDecades: ['2000s', '1990s']
      }
    },
    {
      id: 'demo-casual',
      username: 'jordan_vibe',
      password: 'password123',
      displayName: 'Jordan Taylor',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      bio: 'Weekend movie nights, feel-good animations, and smart comedies with friends.',
      createdAt: '2026-03-01T12:00:00Z',
      tasteBubble: {
        dominantGenres: ['Animation', 'Comedy', 'Family'],
        underrepresentedGenres: ['Crime', 'Horror', 'Western', 'Thriller'],
        favoriteDecades: ['1990s', '2010s']
      }
    }
  ],
  watchedHistory: [
    // Alex's history (Heavy SciFi / Action)
    { id: 'wh-1', userId: 'demo-scifi', movieId: 157336, title: 'Interstellar', genres: ['Adventure', 'Drama', 'Science Fiction'], userRating: 10, watchedAt: '2026-02-01T20:00:00Z' },
    { id: 'wh-2', userId: 'demo-scifi', movieId: 27205, title: 'Inception', genres: ['Action', 'Science Fiction', 'Adventure'], userRating: 9, watchedAt: '2026-02-05T21:30:00Z' },
    { id: 'wh-3', userId: 'demo-scifi', movieId: 603, title: 'The Matrix', genres: ['Action', 'Science Fiction'], userRating: 9, watchedAt: '2026-02-10T19:00:00Z' },
    { id: 'wh-4', userId: 'demo-scifi', movieId: 438631, title: 'Dune', genres: ['Science Fiction', 'Adventure'], userRating: 8, watchedAt: '2026-02-15T22:00:00Z' },
    { id: 'wh-5', userId: 'demo-scifi', movieId: 693134, title: 'Dune: Part Two', genres: ['Science Fiction', 'Adventure'], userRating: 10, watchedAt: '2026-02-20T21:00:00Z' },
    { id: 'wh-6', userId: 'demo-scifi', movieId: 155, title: 'The Dark Knight', genres: ['Drama', 'Action', 'Crime', 'Thriller'], userRating: 9, watchedAt: '2026-02-25T20:45:00Z' },

    // Maya's history (Heavy Drama / Foreign / Romance)
    { id: 'wh-7', userId: 'demo-indie', movieId: 194, title: 'Amélie', genres: ['Comedy', 'Romance'], userRating: 9, watchedAt: '2026-02-02T19:00:00Z' },
    { id: 'wh-8', userId: 'demo-indie', movieId: 38, title: 'Eternal Sunshine of the Spotless Mind', genres: ['Science Fiction', 'Drama', 'Romance'], userRating: 10, watchedAt: '2026-02-08T20:30:00Z' },
    { id: 'wh-9', userId: 'demo-indie', movieId: 496243, title: 'Parasite', genres: ['Comedy', 'Thriller', 'Drama'], userRating: 10, watchedAt: '2026-02-14T21:00:00Z' },
    { id: 'wh-10', userId: 'demo-indie', movieId: 313369, title: 'La La Land', genres: ['Comedy', 'Drama', 'Romance', 'Music'], userRating: 9, watchedAt: '2026-02-18T19:15:00Z' },
    { id: 'wh-11', userId: 'demo-indie', movieId: 11216, title: 'Cinema Paradiso', genres: ['Drama', 'Romance'], userRating: 10, watchedAt: '2026-02-24T20:00:00Z' },

    // Jordan's history (Animation / Family / Comedy)
    { id: 'wh-12', userId: 'demo-casual', movieId: 150540, title: 'Inside Out', genres: ['Animation', 'Family', 'Adventure', 'Comedy'], userRating: 9, watchedAt: '2026-02-03T18:30:00Z' },
    { id: 'wh-13', userId: 'demo-casual', movieId: 808, title: 'Shrek', genres: ['Animation', 'Comedy', 'Fantasy', 'Family'], userRating: 8, watchedAt: '2026-02-09T19:00:00Z' },
    { id: 'wh-14', userId: 'demo-casual', movieId: 129, title: 'Spirited Away', genres: ['Animation', 'Family', 'Fantasy'], userRating: 10, watchedAt: '2026-02-16T17:00:00Z' },
    { id: 'wh-15', userId: 'demo-casual', movieId: 10681, title: 'WALL·E', genres: ['Animation', 'Family', 'Science Fiction'], userRating: 9, watchedAt: '2026-02-22T20:00:00Z' }
  ],
  watchlists: [
    { id: 'wl-1', userId: 'demo-scifi', movieId: 264660, title: 'Ex Machina', poster_path: 'https://image.tmdb.org/t/p/w500/dmkWCLQdfi1qI7v0xX55gR3mYxN.jpg', vote_average: 7.6, addedAt: '2026-02-28T10:00:00Z' },
    { id: 'wl-2', userId: 'demo-scifi', movieId: 77, title: 'Memento', poster_path: 'https://image.tmdb.org/t/p/w500/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg', vote_average: 8.2, addedAt: '2026-03-01T11:00:00Z' }
  ],
  favorites: [
    { id: 'fav-1', userId: 'demo-scifi', movieId: 157336, title: 'Interstellar', poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', addedAt: '2026-02-01T20:30:00Z' },
    { id: 'fav-2', userId: 'demo-indie', movieId: 496243, title: 'Parasite', poster_path: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', addedAt: '2026-02-14T21:30:00Z' }
  ],
  config: {
    tmdbApiKey: process.env.TMDB_API_KEY || ''
  }
};

// Ensure db file exists
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading db:', err);
    return defaultData;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing db:', err);
    return false;
  }
}

const curatedPath = path.join(__dirname, 'data/curatedMovies.json');
let cachedCatalog = null;
let catalogMtime = 0;

function getCuratedCatalog() {
  try {
    const stat = fs.statSync(curatedPath);
    if (!cachedCatalog || stat.mtimeMs > catalogMtime) {
      cachedCatalog = JSON.parse(fs.readFileSync(curatedPath, 'utf8'));
      catalogMtime = stat.mtimeMs;
    }
  } catch (e) {
    cachedCatalog = [];
  }
  return cachedCatalog || [];
}

const KNOWN_TITLE_POSTERS = {
  'dune: part two': 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
  'breaking bad': 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  'interstellar': 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  'better call saul': 'https://image.tmdb.org/t/p/w500/zjg4jpK1Wp2kiRvtt5ND0kznako.jpg',
  'oppenheimer': 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  'stranger things': 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
};

function enrichMovieMetadata(movie) {
  if (!movie) return movie;
  const targetId = String(movie.movieId || movie.id || '');
  const targetTitle = (movie.title || '').toLowerCase().trim();
  const catalog = getCuratedCatalog();
  const found = catalog.find(c => 
    (targetId && String(c.id) === targetId) ||
    (targetTitle && c.title?.toLowerCase().trim() === targetTitle)
  );

  const fallbackPoster = KNOWN_TITLE_POSTERS[targetTitle];

  if (found) {
    return {
      ...found,
      ...movie,
      id: movie.id || found.id,
      movieId: movie.movieId || found.id,
      poster_path: movie.poster_path || found.poster_path || fallbackPoster,
      backdrop_path: movie.backdrop_path || found.backdrop_path,
      vote_average: movie.vote_average || found.vote_average,
      release_date: movie.release_date || found.release_date || found.year,
      year: movie.year || found.year,
      media_type: movie.media_type || found.media_type || 'movie'
    };
  }

  if (fallbackPoster && !movie.poster_path) {
    return {
      ...movie,
      poster_path: fallbackPoster
    };
  }

  return movie;
}

export const db = {
  // Users
  getUsers: () => readDb().users,
  getUserById: (id) => readDb().users.find(u => u.id === id),
  getUserByUsername: (username) => readDb().users.find(u => u.username.toLowerCase() === username.toLowerCase()),
  createUser: (userData) => {
    const data = readDb();
    const newUser = {
      id: 'user-' + Date.now(),
      createdAt: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'Cinema lover exploring new stories.',
      ...userData
    };
    data.users.push(newUser);
    writeDb(data);
    return newUser;
  },
  updateUser: (id, updates) => {
    const data = readDb();
    const idx = data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    data.users[idx] = {
      ...data.users[idx],
      ...updates
    };
    writeDb(data);
    return data.users[idx];
  },

  // Watchlist
  getWatchlist: (userId) => {
    const data = readDb();
    return data.watchlists.filter(w => w.userId === userId).map(enrichMovieMetadata);
  },
  addToWatchlist: (userId, movie) => {
    const data = readDb();
    const movieId = movie.movieId || movie.id;
    const existing = data.watchlists.find(w => w.userId === userId && (String(w.movieId) === String(movieId) || String(w.id) === String(movie.id)));
    if (existing) return enrichMovieMetadata(existing);
    const enriched = enrichMovieMetadata(movie);
    const item = {
      id: 'wl-' + Date.now(),
      userId,
      movieId: movieId,
      title: movie.title,
      poster_path: enriched.poster_path || movie.poster_path,
      backdrop_path: enriched.backdrop_path || movie.backdrop_path || movie.backdrop,
      vote_average: enriched.vote_average || movie.vote_average || 8.0,
      release_date: enriched.release_date || enriched.year || movie.year || '2024',
      year: enriched.year || movie.year || '2024',
      media_type: enriched.media_type || movie.media_type || 'movie',
      addedAt: new Date().toISOString()
    };
    data.watchlists.push(item);
    writeDb(data);
    return item;
  },
  removeFromWatchlist: (userId, movieId) => {
    const data = readDb();
    data.watchlists = data.watchlists.filter(w => !(w.userId === userId && (String(w.movieId) === String(movieId) || String(w.id) === String(movieId))));
    writeDb(data);
    return true;
  },

  // Watched & History
  getHistory: (userId) => {
    const data = readDb();
    return data.watchedHistory.filter(h => h.userId === userId).map(enrichMovieMetadata);
  },
  recordWatched: (userId, movie, userRating = 5, reviewText = '', tags = []) => {
    const data = readDb();
    // Remove previous entry if any
    data.watchedHistory = data.watchedHistory.filter(h => !(h.userId === userId && String(h.movieId) === String(movie.id)));
    const enriched = enrichMovieMetadata(movie);
    const item = {
      id: 'wh-' + Date.now(),
      userId,
      movieId: movie.id,
      title: movie.title,
      year: enriched.year || movie.year || movie.release_date?.substring(0, 4) || '2024',
      poster_path: enriched.poster_path,
      genres: movie.genres || enriched.genres || [],
      userRating: Number(userRating),
      reviewText: reviewText || '',
      tags: Array.isArray(tags) ? tags : [],
      watchedAt: new Date().toISOString()
    };
    data.watchedHistory.unshift(item);
    writeDb(data);
    return item;
  },
  deleteHistoryItem: (userId, historyId) => {
    const data = readDb();
    data.watchedHistory = data.watchedHistory.filter(h => !(h.userId === userId && (h.id === historyId || String(h.movieId) === String(historyId))));
    writeDb(data);
    return true;
  },

  // Favorites
  getFavorites: (userId) => {
    const data = readDb();
    return data.favorites.filter(f => f.userId === userId).map(enrichMovieMetadata);
  },
  toggleFavorite: (userId, movie) => {
    const data = readDb();
    const index = data.favorites.findIndex(f => f.userId === userId && String(f.movieId) === String(movie.id));
    if (index >= 0) {
      data.favorites.splice(index, 1);
      writeDb(data);
      return { favorited: false };
    } else {
      const enriched = enrichMovieMetadata(movie);
      const item = {
        id: 'fav-' + Date.now(),
        userId,
        movieId: movie.id,
        title: movie.title,
        poster_path: enriched.poster_path,
        backdrop_path: enriched.backdrop_path,
        vote_average: enriched.vote_average,
        addedAt: new Date().toISOString()
      };
      data.favorites.push(item);
      writeDb(data);
      return { favorited: true, item };
    }
  },

  // Config (TMDB Key)
  getConfig: () => readDb().config || {},
  setTmdbKey: (key) => {
    const data = readDb();
    if (!data.config) data.config = {};
    data.config.tmdbApiKey = key;
    writeDb(data);
    return true;
  }
};
