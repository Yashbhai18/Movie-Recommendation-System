import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory cache for computed recommendations
const recommendationCache = new Map();

// Load curated offline catalog
const curatedPath = path.join(__dirname, '../data/curatedMovies.json');
let moviesCatalog = [];
let catalogLastRead = 0;

function getCatalog() {
  try {
    const stat = fs.statSync(curatedPath);
    if (!moviesCatalog.length || stat.mtimeMs > catalogLastRead) {
      moviesCatalog = JSON.parse(fs.readFileSync(curatedPath, 'utf-8'));
      catalogLastRead = stat.mtimeMs;
      recommendationCache.clear();
    }
  } catch (err) {
    console.error('Error loading movies catalog in recommend.js:', err);
  }
  return moviesCatalog;
}

// Initial load
getCatalog();

// Explanation templates mapped to Mood + Context
const explanationMap = {
  'feel-good': {
    'alone': 'Warm, uplifting comfort storytelling that feels like a quiet hug for the soul.',
    'date-night': 'Charming romantic chemistry and lighthearted warmth to set the perfect affectionate mood.',
    'family': 'Heartwarming and wholesome magic that will have every generation smiling together.',
    'friends': 'Infectious optimism and vibrant fun that gets everyone in an upbeat, celebratory spirit.',
    'background': 'Light, sunny, low-stakes comfort cinema you can happily glance at while doing chores.',
    'late-night': 'A sweet, peaceful nightcap film to leave you feeling peaceful before sleep.'
  },
  'mind-bending': {
    'alone': 'A complex cerebral puzzle that rewards deep, solitary, undistracted contemplation.',
    'date-night': 'Intriguing philosophical twists that guarantee hours of animated post-movie discussion.',
    'family': 'Smart, wondrous sci-fi mysteries that awaken curiosity and wonder without being too graphic.',
    'friends': 'Jaw-dropping plot twists and shocking reveals that will have everyone theorizing out loud.',
    'background': 'A layered conceptual universe with an awesome score you can drop into whenever you focus.',
    'late-night': 'Hypnotic late-night reality-warping that hits completely differently when the world outside is quiet.'
  },
  'heartbreaking': {
    'alone': 'Profound, cathartic emotional release designed for an honest, solitary cry.',
    'date-night': 'A poignant and tender reflection on love, loss, and the beauty of human connection.',
    'family': 'An emotionally resonant masterpiece teaching resilience, empathy, and enduring familial bonds.',
    'friends': 'An unforgettable tearjerker that will have the entire room bonded over shared tissues.',
    'background': 'Melancholic, beautifully scored cinema that wraps your room in quiet poetic longing.',
    'late-night': 'A midnight emotional journey that cuts straight through the noise of the day into your heart.'
  },
  'tense-thrilling': {
    'alone': 'Intense psychological claustrophobia that will make you double-check the locks on your doors.',
    'date-night': 'Electrifying edge-of-your-seat suspense that keeps you both clutching each other tight.',
    'family': 'Gripping, high-stakes adventure with clean suspense the whole family can rally behind.',
    'friends': 'High-octane adrenaline and unpredictable set-pieces built for gasps and cheers.',
    'background': 'Punchy pacing and visceral momentum that grabs your eye whenever action explodes on screen.',
    'late-night': 'Shadowy suspense and nail-biting tension tailored for the pitch-black hours of the night.'
  },
  'nostalgic': {
    'alone': 'A sentimental portal to simpler times, evoking childhood wonder and vintage aesthetics.',
    'date-night': 'Cozy retro charm with timeless storytelling that evokes sweet memories for both of you.',
    'family': 'A beloved generational classic you grew up on, now passed down to the kids.',
    'friends': 'Quotable one-liners, retro synth soundtracks, and pure golden-era energy to celebrate together.',
    'background': 'Comfort food in movie form—familiar beats you can listen to with zero effort.',
    'late-night': 'Midnight retro vibes and warm analog nostalgia to soothe late-night restlessness.'
  },
  'funny': {
    'alone': 'Witty, laugh-out-loud writing that will keep you chuckling in your pajamas with zero judgment.',
    'date-night': 'Playful banter and humorous charm that breaks the ice and keeps the laughter flowing naturally.',
    'family': 'Clever slapstick and witty animated humor that works on multiple levels for kids and parents.',
    'friends': 'Riotous, side-splitting comedic timing that sparks uncontrollable group laughter.',
    'background': 'Quick quips and breezy pacing where you can catch a laugh every time you look up.',
    'late-night': 'Silly, irreverent midnight comedy to wash away whatever stress the day brought.'
  },
  'inspiring': {
    'alone': 'A stirring triumph of human spirit and vision that will reignite your inner drive and purpose.',
    'date-night': 'Deeply moving courage and ambition that sparks meaningful dreams and shared aspirations.',
    'family': 'Empowering role models and moral triumphs that show children that anything is possible.',
    'friends': 'An epic against-all-odds story that leaves the entire group hyped and ready to conquer the world.',
    'background': 'Majestic orchestrations and soaring themes that provide motivating backdrop ambiance.',
    'late-night': 'Quiet, dignified perseverance that provides a profound sense of hope before heading to bed.'
  },
  'dark': {
    'alone': 'An unflinching character study delving into the abyss of human nature in complete solitude.',
    'date-night': 'A provocative, atmospheric thriller for couples who love cynical wit and moody aesthetics.',
    'family': 'A cautionary myth with gothic beauty and moral nuance for mature family viewing.',
    'friends': 'Gritty neo-noir realism and morbid irony that will leave the room buzzing with debates.',
    'background': 'Moody ambient lighting and brooding textures that turn your space into a midnight lounge.',
    'late-night': 'Bleak nocturnal brilliance meant to be swallowed whole in the deepest hours of the dark.'
  }
};

// Fallback dynamic reasoning generator if specific combinations are customized
function generateReason(movie, mood, context) {
  const base = explanationMap[mood]?.[context];
  if (base) return base;

  // Dynamic fallback synthesis
  const moodDesc = {
    'feel-good': 'radiates genuine joy and warmth',
    'mind-bending': 'bends perception with intricate philosophical questions',
    'heartbreaking': 'touches profound emotional depths',
    'tense-thrilling': 'delivers tight, pulse-pounding pacing',
    'nostalgic': 'evokes timeless cinema magic and classic charm',
    'funny': 'features rapid-fire wit and comedic charm',
    'inspiring': 'showcases the triumph of human spirit',
    'dark': 'explores deep moral grey areas and atmospheric grit'
  }[mood] || 'delivers unforgettable cinema';

  const contextDesc = {
    'alone': 'tailored for focused solo immersion',
    'date-night': 'balancing tone and romance for two',
    'family': 'with wholesome appeal for all ages',
    'friends': 'designed for collective energy and shared reactions',
    'background': 'breezy and digestible while working or relaxing',
    'late-night': 'crafted for the quiet midnight hours'
  }[context] || 'perfect for right now';

  return `${movie.title} ${moodDesc}, ${contextDesc}.`;
}


// POST /api/recommend/mood-context
router.post('/mood-context', (req, res) => {
  const { mood, context, limit = 24, mediaType = 'movie' } = req.body;

  if (!mood || !context) {
    return res.status(400).json({ error: 'Both mood and context are required.' });
  }

  const normalizedMood = mood.toLowerCase().trim();
  const normalizedContext = context.toLowerCase().trim();
  const rawType = (mediaType || 'movie').toLowerCase().trim();
  const genresKey = Array.isArray(req.body.genres) && req.body.genres.length > 0
    ? [...req.body.genres].sort().join(',')
    : normalizedContext;
  const cacheKey = `${normalizedMood}__${genresKey}__${parsedLimit}__${normalizedType}`;

  // Check cache first for 0ms latency
  if (recommendationCache.has(cacheKey)) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(recommendationCache.get(cacheKey));
  }

  // Filter candidates strictly by mediaType ('movie' vs 'tv')
  const catalog = getCatalog();
  const filteredCatalog = catalog.filter(movie => {
    if (!movie) return false;
    if (normalizedType === 'tv') return movie.media_type === 'tv';
    return !movie.media_type || movie.media_type === 'movie';
  });

  // Scoring algorithm
  const scored = filteredCatalog.map(movie => {
    let score = 50; // base score
    const isTv = movie.media_type === 'tv';
    const genres = (movie.genres || []).map(g => g.toLowerCase());
    const keywords = (movie.keywords || []).map(k => k.toLowerCase());
    const runtime = movie.runtime || 120;
    const year = movie.year || 2010;
    const rating = movie.vote_average || 7.0;

    // 1. MOOD SCORING
    switch (normalizedMood) {
      case 'feel-good':
        if (genres.includes('animation') || genres.includes('family')) score += 25;
        if (genres.includes('comedy')) score += 20;
        if (genres.includes('adventure')) score += 15;
        if (genres.includes('romance')) score += 15;
        if (genres.includes('horror') || genres.includes('war')) score -= 40;
        if (keywords.some(k => ['wholesome', 'friendship', 'kindness', 'feel-good', 'magic'].includes(k))) score += 20;
        break;

      case 'mind-bending':
        if (genres.includes('science fiction')) score += 30;
        if (genres.includes('mystery')) score += 25;
        if (genres.includes('thriller')) score += 15;
        if (keywords.some(k => ['mind-bending', 'time travel', 'dreams', 'amnesia', 'subconscious', 'twist', 'simulation', 'relativity'].includes(k))) score += 30;
        if (genres.includes('family') && !genres.includes('science fiction')) score -= 20;
        break;

      case 'heartbreaking':
        if (genres.includes('drama')) score += 30;
        if (genres.includes('romance')) score += 20;
        if (genres.includes('history') || genres.includes('war')) score += 15;
        if (keywords.some(k => ['heartbreaking', 'loss', 'grief', 'tragic romance', 'bittersweet', 'father and son'].includes(k))) score += 25;
        if (genres.includes('comedy') && !genres.includes('drama')) score -= 25;
        break;

      case 'tense-thrilling':
        if (genres.includes('thriller')) score += 30;
        if (genres.includes('crime')) score += 20;
        if (genres.includes('action')) score += 15;
        if (genres.includes('mystery')) score += 15;
        if (keywords.some(k => ['serial killer', 'intense', 'suspense', 'tense', 'claustrophobic', 'chase', 'heist'].includes(k))) score += 25;
        if (genres.includes('romance') && !genres.includes('thriller')) score -= 20;
        break;

      case 'nostalgic':
        if (year <= 2004) score += 30;
        if (year <= 1995) score += 15;
        if (keywords.some(k => ['nostalgic', 'classic', '1980s', '1990s', 'childhood', 'retro'].includes(k))) score += 25;
        if (genres.includes('adventure') || genres.includes('fantasy')) score += 15;
        break;

      case 'funny':
        if (genres.includes('comedy')) score += 35;
        if (genres.includes('animation')) score += 15;
        if (keywords.some(k => ['funny', 'slapstick', 'satire', 'wit', 'dark comedy', 'ogre'].includes(k))) score += 25;
        if (genres.includes('drama') && !genres.includes('comedy')) score -= 25;
        break;

      case 'inspiring':
        if (genres.includes('drama')) score += 20;
        if (genres.includes('history') || genres.includes('adventure')) score += 15;
        if (keywords.some(k => ['inspiring', 'hope', 'triumph', 'meaning of life', 'courage', 'resilience'].includes(k))) score += 30;
        if (genres.includes('horror')) score -= 30;
        break;

      case 'dark':
        if (genres.includes('crime')) score += 25;
        if (genres.includes('thriller')) score += 20;
        if (keywords.some(k => ['dark', 'gotham', 'joker', 'serial killer', 'mafia', 'isolation'].includes(k))) score += 30;
        if (genres.includes('animation') && !keywords.includes('dark')) score -= 30;
        break;
    }

    // 2. CONTEXT & GENRE VECTOR SCORING
    const genreAliases = {
      'sci-fi': ['science fiction', 'sci-fi & fantasy'],
      'science fiction': ['science fiction', 'sci-fi & fantasy'],
      'cyberpunk': ['science fiction', 'mystery', 'crime'],
      'neo-noir': ['crime', 'mystery', 'thriller'],
      'horror': ['horror'],
      'historical': ['history', 'drama'],
      'surreal': ['fantasy', 'mystery', 'drama'],
      'crime': ['crime'],
      'slow-cinema': ['drama'],
      'thriller': ['thriller'],
      'action': ['action', 'action & adventure'],
      'drama': ['drama'],
      'mystery': ['mystery'],
      'comedy': ['comedy'],
      'fantasy': ['fantasy', 'sci-fi & fantasy'],
      'animation': ['animation'],
      'romance': ['romance'],
      'war': ['war'],
      'western': ['western'],
      'documentary': ['documentary'],
      'adventure': ['adventure', 'action & adventure'],
      'music': ['music']
    };

    // Check target genres passed via req.body.genres or normalizedContext
    const activeGenres = Array.isArray(req.body.genres) && req.body.genres.length > 0
      ? req.body.genres.map(g => g.toLowerCase().trim())
      : [normalizedContext];

    activeGenres.forEach(g => {
      const mapped = genreAliases[g] || [g];
      if (mapped.some(targetG => genres.includes(targetG))) {
        score += 35;
      }
      if (keywords.some(k => k.includes(g))) {
        score += 15;
      }
    });

    switch (normalizedContext) {
      case 'background':
        // Favor shorter runtime (< 105 mins) or TV shows (episodes are naturally ~20-50 mins)
        if (isTv || runtime <= 105) score += 25;
        else if (runtime > 140) score -= 35; // Heavy penalty for long epics
        if (genres.includes('animation') || genres.includes('comedy')) score += 20;
        if (keywords.some(k => ['background noise', 'comfort', 'wholesome'].includes(k))) score += 25;
        if (genres.includes('mystery') && runtime > 130 && !isTv) score -= 25;
        break;

      case 'date-night':
        // Balance romance, comedy, captivating mystery, visually stunning films
        if (genres.includes('romance')) score += 25;
        if (genres.includes('comedy')) score += 15;
        if (keywords.some(k => ['date night', 'cinematography', 'visually stunning', 'witty banter'].includes(k))) score += 20;
        // Avoid extreme gore or depressing war films
        if (genres.includes('war') || (genres.includes('crime') && keywords.includes('serial killer'))) score -= 30;
        if (runtime >= 95 && runtime <= 135) score += 10;
        break;

      case 'family':
        // Strict family friendly
        if (genres.includes('family') || genres.includes('animation')) score += 40;
        if (genres.includes('adventure')) score += 15;
        if (genres.includes('crime') || genres.includes('horror') || keywords.includes('serial killer') || keywords.includes('mafia')) score -= 60;
        if (rating >= 7.5) score += 15;
        break;

      case 'friends':
        // High energy, entertaining, laughs or spectacles, friendship bonds
        if (genres.includes('action') || genres.includes('adventure') || genres.includes('comedy')) score += 25;
        if (keywords.some(k => ['friends', 'friendship', 'college', 'road trip', 'brotherhood', 'multiverse', 'spectacle', 'space outlaws', 'laugh-out-loud'].includes(k))) score += 25;
        break;

      case 'alone':
        // Complex, contemplative, slow-burns, psychological, no runtime penalty
        if (runtime > 130) score += 15; // Long epics welcomed
        if (keywords.some(k => ['alone', 'existential', 'character study', 'solitude', 'labyrinth'].includes(k))) score += 25;
        if (genres.includes('mystery') || genres.includes('science fiction') || genres.includes('drama')) score += 15;
        break;

      case 'late-night':
        // Moody, suspenseful, dark, or calming
        if (keywords.some(k => ['late night', 'tense', 'paranoia', 'nocturnal', 'noir', 'quiet'].includes(k))) score += 25;
        if (genres.includes('thriller') || genres.includes('mystery') || genres.includes('crime')) score += 20;
        if (runtime <= 125) score += 10;
        break;
    }

    // Quality boost
    score += (rating - 7.0) * 8;

    // Determine dynamic badge
    let badge = 'Top Vibe Pick';
    if (score >= 90) badge = 'Exact Match';
    else if (runtime <= 100) badge = 'Brisk & Breezy';
    else if (rating >= 8.4) badge = 'Masterpiece';
    else if (year < 2000) badge = 'Retro Gem';

    // Calculate match percentage between 78% and 98%
    const matchPercentage = Math.min(99, Math.max(78, Math.round(score)));

    return {
      ...movie,
      score,
      matchPercentage,
      badge,
      recommendationReason: generateReason(movie, normalizedMood, normalizedContext)
    };
  });

  // Sort by score descending and deduplicate by ID and title
  scored.sort((a, b) => b.score - a.score);
  const seenShortlistIds = new Set();
  const seenShortlistTitles = new Set();
  const uniqueScored = [];
  for (const item of scored) {
    const strId = String(item.id);
    const normTitle = (item.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seenShortlistIds.has(strId) && !seenShortlistTitles.has(normTitle)) {
      seenShortlistIds.add(strId);
      seenShortlistTitles.add(normTitle);
      uniqueScored.push(item);
    }
  }
  const shortlist = uniqueScored.slice(0, parsedLimit);

  const payload = {
    mood: normalizedMood,
    context: normalizedContext,
    mediaType: normalizedType,
    count: shortlist.length,
    results: shortlist
  };

  // Cache for future requests
  recommendationCache.set(cacheKey, payload);
  res.setHeader('X-Cache', 'MISS');
  res.json(payload);
});

export default router;
