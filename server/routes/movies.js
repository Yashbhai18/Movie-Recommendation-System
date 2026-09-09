import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db.js';
import { searchTmdb, getTmdbDetails, tmdbRequest, getTmdbApiKey } from '../services/tmdb.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory TTL Cache (5 minutes TTL for trending/search, 1 hour for details)
const movieCache = new Map();

function getCached(key) {
  const item = movieCache.get(key);
  if (item && Date.now() - item.time < (item.ttl || 300000)) {
    return item.data;
  }
  return null;
}

function setCached(key, data, ttlMs = 300000) {
  movieCache.set(key, { data, time: Date.now(), ttl: ttlMs });
}

// Load curated offline movies
const curatedPath = path.join(__dirname, '../data/curatedMovies.json');
let curatedMovies = [];
let curatedLastRead = 0;

function getCuratedMovies() {
  try {
    const stat = fs.statSync(curatedPath);
    if (!curatedMovies.length || stat.mtimeMs > curatedLastRead) {
      curatedMovies = JSON.parse(fs.readFileSync(curatedPath, 'utf-8'));
      curatedLastRead = stat.mtimeMs;
      movieCache.clear();
    }
  } catch (err) {
    console.error('Failed to load curatedMovies.json in movies.js:', err);
  }
  return curatedMovies;
}

// Initial load
getCuratedMovies();

// Helper to get active TMDB key (prioritize environment variable)
function getTmdbKey() {
  return getTmdbApiKey();
}

// GET /api/movies/trending
router.get('/trending', async (req, res) => {
  const cached = getCached('trending', 600000); // 10 minutes cache
  if (cached) {
    res.setHeader('Cache-Control', 'public, max-age=600');
    return res.json(cached);
  }

  try {
    const response = await tmdbRequest('trending/movie/week');
    if (response.ok && response.data?.results?.length) {
      const results = response.data.results.map(m => ({
        id: m.id,
        title: m.title || m.name,
        media_type: m.media_type || 'movie',
        release_date: m.release_date || m.first_air_date,
        year: (m.release_date || m.first_air_date) ? parseInt((m.release_date || m.first_air_date).split('-')[0]) : null,
        vote_average: m.vote_average ? parseFloat(m.vote_average.toFixed(1)) : 0,
        overview: m.overview || '',
        poster_path: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
        backdrop_path: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : null,
        genre_ids: m.genre_ids || []
      }));
      const payload = { source: 'tmdb', results };
      setCached('trending', payload);
      res.setHeader('Cache-Control', 'public, max-age=600');
      return res.json(payload);
    }
  } catch (e) {
    console.warn('TMDB trending error, using fallback:', e.message);
  }

  // Fallback: return top curated movies
  const sorted = [...getCuratedMovies()].sort((a, b) => b.vote_average - a.vote_average);
  const payload = { source: 'curated', results: sorted };
  setCached('trending', payload);
  res.setHeader('Cache-Control', 'public, max-age=600');
  res.json(payload);
});

// GET /api/movies/search?q=...&type=all|movie|tv
router.get('/search', async (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();
  const searchType = (req.query.type || 'all').toLowerCase(); // 'all', 'movie', 'tv'

  if (!query) {
    return res.json({ source: 'none', results: [] });
  }

  const cacheKey = `search_${searchType}_${query}`;
  const cached = getCached(cacheKey, 300000); // 5 min cache
  if (cached) {
    return res.json(cached);
  }

  // Live dynamic TMDB search
  try {
    const tmdbResults = await searchTmdb(query, searchType);
    if (tmdbResults && tmdbResults.length > 0) {
      const payload = { source: 'tmdb', results: tmdbResults, count: tmdbResults.length };
      setCached(cacheKey, payload);
      return res.json(payload);
    }
  } catch (e) {
    console.warn('TMDB search error, falling back to curated:', e.message);
  }

  // Fallback search in curated movies / series
  const curated = getCuratedMovies();
  const normalizedQuery = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const scoredMatches = [];
  for (const m of curated) {
    const isTv = m.media_type === 'tv';
    if (searchType === 'movie' && isTv) continue;
    if (searchType === 'tv' && !isTv) continue;

    const rawTitle = (m.title || '').toLowerCase();
    const cleanTitle = rawTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let score = 0;

    if (rawTitle === query || cleanTitle === normalizedQuery) {
      score += 100;
    } else if (rawTitle.startsWith(query) || cleanTitle.startsWith(normalizedQuery)) {
      score += 80;
    } else if (rawTitle.includes(query) || cleanTitle.includes(normalizedQuery)) {
      score += 60;
    } else if (m.director?.toLowerCase().includes(query)) {
      score += 35;
    } else if (m.cast?.some(c => (typeof c === 'string' ? c : c.name).toLowerCase().includes(query))) {
      score += 30;
    } else if (m.genres?.some(g => g.toLowerCase().includes(query))) {
      score += 25;
    } else if (m.keywords?.some(k => k.toLowerCase() === query)) {
      score += 20;
    } else if (m.keywords?.some(k => k.toLowerCase().includes(query))) {
      score += 10;
    }

    if (score > 0) {
      scoredMatches.push({ m, score });
    }
  }

  scoredMatches.sort((a, b) => b.score - a.score || (b.m.vote_average || 0) - (a.m.vote_average || 0));
  const matches = scoredMatches.map(item => item.m);

  const normalizedMatches = matches.map(m => ({
    id: m.id,
    title: m.title,
    media_type: m.media_type || 'movie',
    release_date: m.release_date || (m.year ? `${m.year}-01-01` : null),
    year: m.year || (m.release_date ? parseInt(m.release_date.split('-')[0]) : null),
    vote_average: m.vote_average ? parseFloat(m.vote_average.toFixed(1)) : 0,
    vote_count: m.vote_count || 100,
    overview: m.overview || m.synopsis || '',
    poster_path: m.poster_path || null,
    backdrop_path: m.backdrop_path || null,
    genre_ids: m.genre_ids || []
  }));

  const payload = { source: 'curated', results: normalizedMatches, count: normalizedMatches.length };
  setCached(cacheKey, payload, 5000); // Only 5 seconds for fallback
  res.json(payload);
});

// Helper cache for people photos and known character names
const peopleCachePath = path.join(__dirname, '../data/peopleCache.json');
const knownCharsPath = path.join(__dirname, '../data/knownCharacters.json');

function getPeopleCache() {
  try {
    if (fs.existsSync(peopleCachePath)) {
      return JSON.parse(fs.readFileSync(peopleCachePath, 'utf8'));
    }
  } catch (e) {}
  return {};
}

function getKnownCharacters() {
  try {
    if (fs.existsSync(knownCharsPath)) {
      return JSON.parse(fs.readFileSync(knownCharsPath, 'utf8'));
    }
  } catch (e) {}
  return {};
}

function getPersonPhoto(name) {
  if (!name) return null;
  const cache = getPeopleCache();
  if (cache[name]?.photo) return cache[name].photo;
  // If multiple names (e.g. "Vince Gilligan, Peter Gould")
  if (name.includes(',')) {
    const primary = name.split(',')[0].trim();
    if (cache[primary]?.photo) return cache[primary].photo;
  }
  return null;
}

async function resolvePersonPhoto(name) {
  if (!name) return null;
  const cached = getPersonPhoto(name);
  if (cached) return cached;

  const targetName = name.includes(',') ? name.split(',')[0].trim() : name.trim();
  const cache = getPeopleCache();

  try {
    const queries = [
      targetName.replace(/ /g, '_'),
      `${targetName.replace(/ /g, '_')}_(actor)`,
      `${targetName.replace(/ /g, '_')}_(director)`,
      `${targetName.replace(/ /g, '_')}_(filmmaker)`
    ];
    for (const q of queries) {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`, {
        headers: { 'User-Agent': 'CinePulse/1.0 (contact@cinepulse.app)' }
      });
      if (res.ok) {
        const d = await res.json();
        if (d.thumbnail?.source) {
          cache[name] = { name, photo: d.thumbnail.source };
          cache[targetName] = { name: targetName, photo: d.thumbnail.source };
          try {
            fs.writeFileSync(peopleCachePath, JSON.stringify(cache, null, 2), 'utf8');
          } catch (e) {}
          return d.thumbnail.source;
        }
      }
    }
  } catch (err) {}
  return null;
}

function getCharacterName(movieId, actorName, index) {
  const chars = getKnownCharacters();
  if (chars[movieId] && chars[movieId][actorName]) {
    return chars[movieId][actorName];
  }
  if (index === 0) return 'Leading Role';
  if (index === 1) return 'Co-Lead';
  if (index === 2) return 'Key Ensemble';
  return 'Supporting Cast';
}

// GET /api/movies/details/:id?type=movie|tv
router.get('/details/:id', async (req, res) => {
  const movieId = req.params.id;
  const requestedType = (req.query.type || '').toLowerCase().trim(); // 'movie', 'tv'
  const cacheKey = requestedType ? `details_v6_${requestedType}_${movieId}` : `details_v6_${movieId}`;
  const cached = getCached(cacheKey, 3600000); // 1 hr cache
  if (cached) {
    return res.json(cached);
  }

  // Check curated offline catalog for matching item
  const curated = getCuratedMovies();
  const localMatch = curated.find(m => String(m.id) === String(movieId));

  try {
    const tmdbData = await getTmdbDetails(movieId, requestedType || localMatch?.media_type || 'movie');
    if (tmdbData) {
      const director = tmdbData.director || localMatch?.director || 'Director';
      const directorPhoto = await resolvePersonPhoto(director);
      const payload = {
        ...tmdbData,
        director,
        director_photo: directorPhoto,
        keywords: localMatch?.keywords || tmdbData.genres || []
      };
      setCached(cacheKey, payload);
      return res.json(payload);
    }
  } catch (e) {
    console.warn('TMDB details error, checking curated fallback:', e.message);
  }

  // Curated fallback
  const found = getCuratedMovies().find(m => String(m.id) === String(movieId));
  if (found) {
    const director = found.director || 'Director';
    const directorPhoto = await resolvePersonPhoto(director);
    
    const enrichedCast = await Promise.all((found.cast || []).map(async (c, idx) => {
      const name = typeof c === 'string' ? c : c.name;
      const character = (typeof c === 'object' && c.character && c.character !== 'Cast')
        ? c.character
        : getCharacterName(String(found.id), name, idx);
      const profilePath = (typeof c === 'object' && c.profile_path)
        ? c.profile_path
        : await resolvePersonPhoto(name);

      return {
        name,
        character,
        profile_path: profilePath
      };
    }));

    const payload = {
      ...found,
      director,
      director_photo: directorPhoto,
      cast: enrichedCast
    };
    setCached(cacheKey, payload);
    return res.json(payload);
  }

  res.status(404).json({ error: 'Movie not found' });
});

// GET /api/movies/genres
router.get('/genres', (req, res) => {
  res.json({
    genres: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentary" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Family" },
      { id: 14, name: "Fantasy" },
      { id: 36, name: "History" },
      { id: 27, name: "Horror" },
      { id: 10402, name: "Music" },
      { id: 9648, name: "Mystery" },
      { id: 10749, name: "Romance" },
      { id: 878, name: "Science Fiction" },
      { id: 53, name: "Thriller" },
      { id: 10752, name: "War" },
      { id: 37, name: "Western" }
    ]
  });
});
// GET /api/movies/marvel - Return ALL Marvel movies & TV shows sorted newest to oldest
router.get('/marvel', (req, res) => {
  const catalog = getCuratedMovies();
  const marvelList = catalog.filter(m => {
    const kw = (m.keywords || []).map(k => (k || '').toLowerCase());
    const title = (m.title || '').toLowerCase();
    return kw.some(k => ['marvel', 'mcu', 'avengers', 'spider-man', 'x-men', 'mutants', 'superhero team'].includes(k)) ||
           title.includes('spider-man') ||
           title.includes('iron man') ||
           title.includes('avengers') ||
           title.includes('thor') ||
           title.includes('captain america') ||
           title.includes('guardians of the galaxy') ||
           title.includes('black panther') ||
           title.includes('deadpool') ||
           title.includes('wolverine') ||
           title.includes('loki') ||
           title.includes('x-men') ||
           title.includes('wandavision') ||
           title.includes('hawkeye') ||
           title.includes('moon knight') ||
           title.includes('ms. marvel') ||
           title.includes('she-hulk') ||
           title.includes('secret invasion') ||
           title.includes('agatha all along') ||
           title.includes('daredevil') ||
           title.includes('the punisher') ||
           title.includes('the incredible hulk') ||
           title.includes('ant-man') ||
           title.includes('black widow') ||
           title.includes('shang-chi') ||
           title.includes('eternals') ||
           title.includes('the marvels') ||
           title.includes('what if...?');
  });

  // Strict chronological sorting: newest released first, oldest released last
  marvelList.sort((a, b) => {
    const dateA = a.release_date || (a.year ? `${a.year}-01-01` : '1900-01-01');
    const dateB = b.release_date || (b.year ? `${b.year}-01-01` : '1900-01-01');
    return dateB.localeCompare(dateA);
  });

  // Strict deduplication by ID and normalized title
  const seenIds = new Set();
  const seenTitles = new Set();
  const uniqueMarvel = [];
  for (const m of marvelList) {
    const strId = String(m.id);
    const normTitle = (m.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seenIds.has(strId) && !seenTitles.has(normTitle)) {
      seenIds.add(strId);
      seenTitles.add(normTitle);
      uniqueMarvel.push(m);
    }
  }

  res.json({ source: 'curated', results: uniqueMarvel, total: uniqueMarvel.length });
});

export default router;
