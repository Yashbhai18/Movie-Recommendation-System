import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/auth/profiles - list available demo profiles
router.get('/profiles', (req, res) => {
  const users = db.getUsers().map(u => ({
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    avatar: u.avatar,
    bio: u.bio,
    tasteBubble: u.tasteBubble
  }));
  res.json({ profiles: users });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, password, displayName } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const existing = db.getUserByUsername(username);
  if (existing) {
    return res.status(409).json({ error: 'Username is already taken' });
  }

  const newUser = db.createUser({
    username,
    password,
    displayName: displayName || username
  });

  res.json({
    user: {
      id: newUser.id,
      username: newUser.username,
      displayName: newUser.displayName,
      avatar: newUser.avatar,
      bio: newUser.bio
    }
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.getUserByUsername(username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      bio: user.bio,
      tasteBubble: user.tasteBubble
    }
  });
});

// GET /api/auth/user/:id
router.get('/user/:id', (req, res) => {
  const user = db.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email || `${user.username}@cinepulse.ai`,
      avatar: user.avatar,
      bio: user.bio,
      tagline: user.tagline || 'Lead Cinematographer & Sensory Vector Scout',
      tasteBubble: user.tasteBubble
    }
  });
});

// PUT /api/auth/user/:id - update user profile
router.put('/user/:id', (req, res) => {
  const { displayName, email, bio, avatar, tagline } = req.body;
  const updated = db.updateUser(req.params.id, {
    ...(displayName && { displayName }),
    ...(email !== undefined && { email }),
    ...(bio !== undefined && { bio }),
    ...(avatar && { avatar }),
    ...(tagline !== undefined && { tagline })
  });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json({
    user: {
      id: updated.id,
      username: updated.username,
      displayName: updated.displayName,
      email: updated.email || `${updated.username}@cinepulse.ai`,
      avatar: updated.avatar,
      bio: updated.bio,
      tagline: updated.tagline || 'Lead Cinematographer & Sensory Vector Scout',
      tasteBubble: updated.tasteBubble
    }
  });
});

// Watchlist endpoints
router.get('/user/:userId/watchlist', (req, res) => {
  const list = db.getWatchlist(req.params.userId);
  res.json({ watchlist: list });
});

router.post('/user/:userId/watchlist', (req, res) => {
  const { movie } = req.body;
  if (!movie || !movie.id) return res.status(400).json({ error: 'Valid movie object required' });
  const item = db.addToWatchlist(req.params.userId, movie);
  res.json({ success: true, item });
});

router.delete('/user/:userId/watchlist/:movieId', (req, res) => {
  db.removeFromWatchlist(req.params.userId, req.params.movieId);
  res.json({ success: true });
});

// Favorites endpoints
router.get('/user/:userId/favorites', (req, res) => {
  const favs = db.getFavorites(req.params.userId);
  res.json({ favorites: favs });
});

router.post('/user/:userId/favorites', (req, res) => {
  const { movie } = req.body;
  if (!movie || !movie.id) return res.status(400).json({ error: 'Valid movie object required' });
  const result = db.toggleFavorite(req.params.userId, movie);
  res.json(result);
});

// History / Watched endpoints
router.get('/user/:userId/history', (req, res) => {
  const history = db.getHistory(req.params.userId);
  res.json({ history });
});

router.post('/user/:userId/history', (req, res) => {
  const { movie, rating, reviewText, tags } = req.body;
  if (!movie || !movie.id) return res.status(400).json({ error: 'Valid movie object required' });
  const item = db.recordWatched(req.params.userId, movie, rating || 5, reviewText, tags);
  res.json({ success: true, item });
});

router.delete('/user/:userId/history/:historyId', (req, res) => {
  db.deleteHistoryItem(req.params.userId, req.params.historyId);
  res.json({ success: true });
});

// TMDB Key configuration
router.get('/config/tmdb', (req, res) => {
  const config = db.getConfig();
  const key = config.tmdbApiKey || process.env.TMDB_API_KEY || '';
  res.json({
    hasKey: !!key,
    keyPreview: key ? `${key.substring(0, 4)}...${key.slice(-4)}` : null
  });
});

router.post('/config/tmdb', async (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) {
    db.setTmdbKey('');
    return res.json({ success: true, message: 'TMDB key cleared. Using curated catalog.' });
  }

  // Validate key against TMDB
  try {
    const testRes = await fetch(`https://api.themoviedb.org/3/authentication?api_key=${apiKey.trim()}`);
    if (testRes.ok) {
      db.setTmdbKey(apiKey.trim());
      return res.json({ success: true, message: 'TMDB API key verified and connected successfully!' });
    } else {
      return res.status(400).json({ error: 'Invalid TMDB API Key. Please check your credentials.' });
    }
  } catch (err) {
    // If offline or network error, save anyway
    db.setTmdbKey(apiKey.trim());
    return res.json({ success: true, message: 'TMDB API key saved.' });
  }
});

export default router;
