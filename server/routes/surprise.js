import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db.js';
import { tmdbRequest } from '../services/tmdb.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load curated offline catalog with dynamic reloading
const curatedPath = path.join(__dirname, '../data/curatedMovies.json');
let moviesCatalog = [];
let catalogLastRead = 0;

function getCuratedCatalog() {
  try {
    const stat = fs.statSync(curatedPath);
    if (!moviesCatalog.length || stat.mtimeMs > catalogLastRead) {
      moviesCatalog = JSON.parse(fs.readFileSync(curatedPath, 'utf-8'));
      catalogLastRead = stat.mtimeMs;
    }
  } catch (err) {
    console.error('Error loading movies catalog in surprise.js:', err);
  }
  return moviesCatalog;
}

// Initial load
getCuratedCatalog();

const TMDB_GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
  10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News', 10764: 'Reality',
  10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics'
};

function formatSpecimen(item) {
  const isTv = item.media_type === 'tv' || (!item.media_type && (Boolean(item.first_air_date) || Boolean(item.name)));
  const title = item.title || item.name || 'Untitled Discovery';
  const year = item.year || (item.release_date || item.first_air_date ? parseInt((item.release_date || item.first_air_date).split('-')[0]) : 2021);
  const ratingVal = item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 7.8;

  // Genres
  let genres = [];
  if (Array.isArray(item.genres) && item.genres.length > 0) {
    genres = item.genres.map(g => typeof g === 'string' ? g : g.name).filter(Boolean);
  } else if (Array.isArray(item.genre_ids) && item.genre_ids.length > 0) {
    genres = item.genre_ids.map(id => TMDB_GENRE_MAP[id]).filter(Boolean);
  }
  if (genres.length === 0) genres = [isTv ? 'Prestige Drama' : 'Cinematic Vision'];

  // Director / Creator
  let director = item.director;
  if (!director) {
    if (isTv) {
      director = item.created_by?.[0]?.name || (item.cast?.[0] ? `${item.cast[0]} Series` : 'Showrunner Vision');
    } else {
      director = item.cast?.[0] ? `Dir. ${item.cast[0]}` : 'Cinema Visionary';
    }
  }
  if (!director.includes(' ')) {
    director = `${director} Studio`;
  }

  // Content rating
  let rating = item.rating;
  if (!rating) {
    if (isTv) rating = ratingVal >= 8.3 ? 'TV-MA' : 'TV-14';
    else rating = ratingVal >= 8.2 ? 'R' : (ratingVal >= 7.6 ? 'PG-13' : 'PG');
  }

  // Poster
  let poster = item.poster_path;
  if (poster && !poster.startsWith('http')) {
    poster = `https://image.tmdb.org/t/p/w500${poster}`;
  }
  if (!poster) {
    poster = item.backdrop_path
      ? (item.backdrop_path.startsWith('http') ? item.backdrop_path : `https://image.tmdb.org/t/p/w500${item.backdrop_path}`)
      : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80';
  }

  // Runtime
  let runtime = '115 MIN';
  if (item.runtime) runtime = `${item.runtime} MIN`;
  else if (item.episode_run_time?.[0]) runtime = `${item.episode_run_time[0]} MIN / EP`;
  else if (isTv) runtime = '50 MIN / EP';

  // Soundtrack / Audio
  const soundtrack = item.soundtrack || `${director.split(' ')[0]} Master Score`;

  // Quote
  let quote = item.tagline;
  if (!quote || quote.length < 5) {
    if (item.overview) {
      const sentence = item.overview.split(/[.!?]/)[0];
      quote = sentence && sentence.length > 20 ? `${sentence.trim()}.` : item.overview.slice(0, 110).trim() + '...';
    } else {
      quote = 'A singular artistic breakthrough defying formulaic storytelling.';
    }
  }
  const quoteAuthor = item.quoteAuthor || item.cast?.[0] || (isTv ? `${title} (Series)` : director);

  // Tags
  const primaryGenre = genres[0] || (isTv ? 'Prestige TV' : 'Avant-Garde');
  const secondaryTag = isTv ? 'Binge Dissonance' : (item.country ? `${item.country} Cinema` : 'Radical Aesthetic');
  const tags = [primaryGenre, secondaryTag];

  // Why breaks bubble
  const countryPhrase = item.country && item.country !== 'United States' ? ` ${item.country}` : '';
  const mediaTypePhrase = isTv ? 'high-stakes television odyssey' : `${countryPhrase} cinematic landmark`;
  const whyBreaksBubble = item.whyBreaksBubble ||
    `Shatters standard algorithmic repetition by plunging into an intense ${mediaTypePhrase} that synthesizes ${genres.slice(0, 2).join(' and ')} to challenge conventional narrative pacing.`;

  // Dynamic Disruption Metrics
  const cerebralMatch = `${Math.min(99, Math.max(88, Math.floor(ratingVal * 11 + Math.random() * 3)))}%`;
  const tasteDeltaNum = Math.floor(45 + Math.random() * 45);
  const tasteDelta = `+${tasteDeltaNum}%`;
  const varianceDelta = `+${(tasteDeltaNum + Math.random()).toFixed(1)}% EXPANDED`;
  const familiarity = Math.floor(10 + Math.random() * 25);
  const cognitiveLoad = Math.min(99, Math.max(72, Math.floor(75 + ratingVal * 2.2 + Math.random() * 5)));
  const sensoryNovelty = Math.floor(76 + Math.random() * 22);

  // Dynamic Radar Polygon Points
  const radarPoints = [
    { x: 50, y: Math.floor(5 + Math.random() * 20), label: 'Pacing & Rhythm' },
    { x: Math.floor(75 + Math.random() * 18), y: Math.floor(30 + Math.random() * 20), label: item.country ? `Origin (${item.country})` : 'Cultural Origin' },
    { x: Math.floor(65 + Math.random() * 22), y: Math.floor(75 + Math.random() * 18), label: 'Visual Style' },
    { x: Math.floor(14 + Math.random() * 22), y: Math.floor(70 + Math.random() * 20), label: 'Thematic Depth' },
    { x: Math.floor(8 + Math.random() * 20), y: Math.floor(20 + Math.random() * 20), label: 'Narrative Rigor' }
  ];

  return {
    id: item.id,
    title,
    director,
    year,
    rating,
    cerebralMatch,
    tasteDelta,
    genre: genres.slice(0, 2).join(' / '),
    runtime,
    soundtrack,
    poster,
    backdrop: item.backdrop_path ? (item.backdrop_path.startsWith('http') ? item.backdrop_path : `https://image.tmdb.org/t/p/original${item.backdrop_path}`) : null,
    tags,
    whyBreaksBubble,
    quote,
    quoteAuthor,
    familiarity,
    cognitiveLoad,
    sensoryNovelty,
    varianceDelta,
    radarPoints,
    media_type: isTv ? 'tv' : 'movie'
  };
}

// POST /api/recommend/surprise
router.post('/surprise', async (req, res) => {
  const {
    userId,
    excludeIds = [],
    mediaType = 'all',
    temporalWindow = 0,
    dissonanceLevel = 3
  } = req.body;

  // Set of excluded IDs
  const seenIds = new Set((excludeIds || []).map(String));

  // Also include user's watchlist and history if userId provided
  const effectiveUserId = userId || 'demo-scifi';
  let dominantGenres = ['Science Fiction', 'Action'];
  try {
    const history = db.getHistory(effectiveUserId) || [];
    const watchlist = db.getWatchlist(effectiveUserId) || [];
    history.forEach(h => seenIds.add(String(h.movieId)));
    watchlist.forEach(w => seenIds.add(String(w.movieId)));

    const genreCounts = {};
    history.forEach(item => {
      (item.genres || []).forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });
    const sorted = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) dominantGenres = sorted.slice(0, 2).map(([g]) => g);
  } catch (err) {
    // Ignore history error
  }

  let selected = null;

  // 1. Try TMDB live discovery (approx 65% of the time, to tap into thousands of worldwide movies/shows)
  const shouldTryTmdb = Math.random() > 0.35;
  if (shouldTryTmdb) {
    try {
      const targetType = mediaType === 'tv' ? 'tv' : (mediaType === 'movie' ? 'movie' : (Math.random() > 0.45 ? 'tv' : 'movie'));
      const endpoint = targetType === 'tv' ? 'discover/tv' : 'discover/movie';

      const params = {
        sort_by: Math.random() > 0.5 ? 'popularity.desc' : 'vote_average.desc',
        'vote_count.gte': targetType === 'tv' ? 80 : 200,
        page: Math.floor(Math.random() * 25) + 1
      };

      // Temporal window
      if (temporalWindow === 1) { // 1920-1959
        if (targetType === 'movie') { params['primary_release_date.lte'] = '1959-12-31'; }
      } else if (temporalWindow === 2) { // 1960-1989
        if (targetType === 'movie') {
          params['primary_release_date.gte'] = '1960-01-01';
          params['primary_release_date.lte'] = '1989-12-31';
        }
      } else if (temporalWindow === 3) { // 1990-2017
        if (targetType === 'movie') {
          params['primary_release_date.gte'] = '1990-01-01';
          params['primary_release_date.lte'] = '2017-12-31';
        }
      } else if (temporalWindow === 4) { // 2018+
        if (targetType === 'movie') {
          params['primary_release_date.gte'] = '2018-01-01';
        }
      }

      const tmdbRes = await tmdbRequest(endpoint, params);
      if (tmdbRes.ok && Array.isArray(tmdbRes.data?.results) && tmdbRes.data.results.length > 0) {
        // Filter out seen IDs and items without poster
        const candidates = tmdbRes.data.results.filter(m => !seenIds.has(String(m.id)) && m.poster_path);
        if (candidates.length > 0) {
          const raw = candidates[Math.floor(Math.random() * candidates.length)];
          raw.media_type = targetType;
          selected = raw;
        }
      }
    } catch (e) {
      // TMDB fetch failed, fallback to curated catalog
    }
  }

  // 2. Fallback to Curated Catalog (225 top movies & TV shows)
  if (!selected) {
    const catalog = getCuratedCatalog();
    let candidates = catalog.filter(item => !seenIds.has(String(item.id)));

    // Apply mediaType filter
    if (mediaType === 'tv') {
      const tvCandidates = candidates.filter(item => item.media_type === 'tv');
      if (tvCandidates.length > 0) candidates = tvCandidates;
    } else if (mediaType === 'movie') {
      const movieCandidates = candidates.filter(item => item.media_type !== 'tv');
      if (movieCandidates.length > 0) candidates = movieCandidates;
    }

    // Apply temporalWindow filter if requested
    if (temporalWindow > 0) {
      const filteredByEra = candidates.filter(item => {
        const y = item.year || (item.release_date ? parseInt(item.release_date.split('-')[0]) : 2020);
        if (temporalWindow === 1) return y < 1960;
        if (temporalWindow === 2) return y >= 1960 && y < 1990;
        if (temporalWindow === 3) return y >= 1990 && y < 2018;
        if (temporalWindow === 4) return y >= 2018;
        return true;
      });
      if (filteredByEra.length > 0) {
        candidates = filteredByEra;
      }
    }

    // If all candidates in catalog have been seen, reset exclude list
    if (candidates.length === 0) {
      candidates = catalog;
    }

    // Truly random pick from candidates
    selected = candidates[Math.floor(Math.random() * candidates.length)];
  }

  const specimen = formatSpecimen(selected);
  const whyNote = specimen.whyBreaksBubble;

  res.json({
    movie: selected,
    specimen,
    whyNote,
    divergenceStats: {
      userBubbleGenres: dominantGenres,
      surpriseGenre: specimen.genre,
      rating: selected.vote_average || 8.0,
      mediaType: specimen.media_type
    }
  });
});

export default router;
