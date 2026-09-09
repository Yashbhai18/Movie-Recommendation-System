import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

// 8 Categorical Mood Frequencies
const MOOD_FREQUENCIES = [
  {
    id: 'mind-bending',
    emoji: '🤯',
    label: 'Mind-Bending & Existential',
    vectorX: 46,
    vectorY: -22,
    pacing: 42,
    acoustic: 84,
    grain: 70,
    entropy: 85,
    tag: 'EXISTENTIAL'
  },
  {
    id: 'bleak',
    emoji: '🖤',
    label: 'Bleak & Melancholic',
    vectorX: -30,
    vectorY: -45,
    pacing: 25,
    acoustic: 60,
    grain: 85,
    entropy: 65,
    tag: 'MELANCHOLIC'
  },
  {
    id: 'adrenaline',
    emoji: '⚡',
    label: 'High-Octane Adrenaline',
    vectorX: -55,
    vectorY: 60,
    pacing: 95,
    acoustic: 90,
    grain: 40,
    entropy: 45,
    tag: 'KINETIC'
  },
  {
    id: 'nocturnal',
    emoji: '🌙',
    label: 'Nocturnal Solitude / 2AM Vibe',
    vectorX: 20,
    vectorY: -35,
    pacing: 35,
    acoustic: 70,
    grain: 75,
    entropy: 55,
    tag: 'NOCTURNE'
  },
  {
    id: 'zen',
    emoji: '🧘',
    label: 'Zen & Meditative',
    vectorX: 15,
    vectorY: 30,
    pacing: 18,
    acoustic: 30,
    grain: 45,
    entropy: 30,
    tag: 'MEDITATIVE'
  },
  {
    id: 'visceral',
    emoji: '🫀',
    label: 'Raw Visceral Tension',
    vectorX: -45,
    vectorY: -25,
    pacing: 65,
    acoustic: 85,
    grain: 90,
    entropy: 75,
    tag: 'VISCERAL'
  },
  {
    id: 'cosmic',
    emoji: '🪐',
    label: 'Cosmic Awe & Transcendence',
    vectorX: 60,
    vectorY: 40,
    pacing: 30,
    acoustic: 80,
    grain: 55,
    entropy: 80,
    tag: 'TRANSCENDENT'
  },
  {
    id: 'nostalgia',
    emoji: '💔',
    label: 'Bittersweet Nostalgia',
    vectorX: 25,
    vectorY: -15,
    pacing: 40,
    acoustic: 50,
    grain: 80,
    entropy: 50,
    tag: 'NOSTALGIC'
  }
];

// 20 Cinematic Genre Vectors across 4 Bauhaus Thematic Clusters
export const GENRE_CATEGORIES = [
  { id: 'all', label: 'All Vectors', count: 20 },
  { id: 'speculative', label: '🚀 Speculative & Sci-Fi', count: 5 },
  { id: 'adrenaline', label: '💥 Adrenaline & Suspense', count: 5 },
  { id: 'drama', label: '🎬 Drama & Emotion', count: 5 },
  { id: 'visionary', label: '🎨 Visionary & Art', count: 5 }
];

export const GENRE_VECTORS = [
  // Cluster 1: Speculative & Sci-Fi
  { id: 'sci-fi', emoji: '🚀', label: 'Hard Sci-Fi', tag: 'SCI-FI', tmdbGenre: 'Science Fiction', category: 'speculative' },
  { id: 'cyberpunk', emoji: '🕵️', label: 'Cyberpunk / Neo-Noir', tag: 'NEO-NOIR', tmdbGenre: 'Mystery', category: 'speculative' },
  { id: 'fantasy', emoji: '🐉', label: 'Fantasy & Mythic', tag: 'FANTASY', tmdbGenre: 'Fantasy', category: 'speculative' },
  { id: 'surreal', emoji: '🎭', label: 'Absurdist / Surreal', tag: 'SURREAL', tmdbGenre: 'Fantasy', category: 'speculative' },
  { id: 'adventure', emoji: '🧭', label: 'Adventure & Odyssey', tag: 'ADVENTURE', tmdbGenre: 'Adventure', category: 'speculative' },

  // Cluster 2: Adrenaline & Suspense
  { id: 'thriller', emoji: '🔪', label: 'High-Stakes Thriller', tag: 'THRILLER', tmdbGenre: 'Thriller', category: 'adrenaline' },
  { id: 'action', emoji: '💥', label: 'Action & Martial Arts', tag: 'ACTION', tmdbGenre: 'Action', category: 'adrenaline' },
  { id: 'horror', emoji: '🩸', label: 'Psychological Horror', tag: 'HORROR', tmdbGenre: 'Horror', category: 'adrenaline' },
  { id: 'crime', emoji: '🌆', label: 'Urban Crime & Heist', tag: 'CRIME', tmdbGenre: 'Crime', category: 'adrenaline' },
  { id: 'mystery', emoji: '🔍', label: 'Mystery & Whodunit', tag: 'MYSTERY', tmdbGenre: 'Mystery', category: 'adrenaline' },

  // Cluster 3: Drama & Emotion
  { id: 'drama', emoji: '🎬', label: 'Prestige Drama', tag: 'DRAMA', tmdbGenre: 'Drama', category: 'drama' },
  { id: 'slow-cinema', emoji: '🌿', label: 'Slow Cinema / Poetic Realism', tag: 'SLOW CINEMA', tmdbGenre: 'Drama', category: 'drama' },
  { id: 'historical', emoji: '🏛️', label: 'Period Drama / Historical', tag: 'PERIOD', tmdbGenre: 'History', category: 'drama' },
  { id: 'romance', emoji: '❤️', label: 'Romance & Melodrama', tag: 'ROMANCE', tmdbGenre: 'Romance', category: 'drama' },
  { id: 'war', emoji: '⚔️', label: 'War & Conflict Epic', tag: 'WAR', tmdbGenre: 'War', category: 'drama' },

  // Cluster 4: Visionary & Art
  { id: 'comedy', emoji: '🖤', label: 'Dark Comedy & Satire', tag: 'SATIRE', tmdbGenre: 'Comedy', category: 'visionary' },
  { id: 'animation', emoji: '✨', label: 'Cyber Animation & Anime', tag: 'ANIMATION', tmdbGenre: 'Animation', category: 'visionary' },
  { id: 'western', emoji: '🤠', label: 'Acid Western & Frontier', tag: 'WESTERN', tmdbGenre: 'Western', category: 'visionary' },
  { id: 'documentary', emoji: '📽️', label: 'Mind-Expanding Documentary', tag: 'DOCS', tmdbGenre: 'Documentary', category: 'visionary' },
  { id: 'music', emoji: '🎵', label: 'Sonic & Musical Avant-Garde', tag: 'SONIC', tmdbGenre: 'Music', category: 'visionary' }
];

// Direct Directorial Signature Presets
const DIRECTOR_PRESETS = [
  {
    id: 'villeneuve',
    label: 'VILLENEUVE SCALE',
    vectorX: 46,
    vectorY: -22,
    pacing: 42,
    pacingLabel: '42 Hz // Slow-Burn',
    acoustic: 84,
    acousticLabel: '84 dB // Sub-Bass Drone',
    grain: 70,
    grainLabel: '35mm Brutalist // 70%',
    entropy: 85,
    entropyLabel: '85% Non-Linear',
    entropyFactor: '0.442',
    moodId: 'mind-bending',
    genres: ['sci-fi', 'cyberpunk'],
    targetLabel: 'TARGET: EXISTENTIAL SCI-FI NOIR'
  },
  {
    id: 'kubrick',
    label: 'KUBRICK PROTOCOL',
    vectorX: 65,
    vectorY: 45,
    pacing: 28,
    pacingLabel: '28 Hz // Symmetrical',
    acoustic: 92,
    acousticLabel: '92 dB // Classical Wall',
    grain: 50,
    grainLabel: '70mm Pristine // 50%',
    entropy: 90,
    entropyLabel: '90% Cryptic Logic',
    entropyFactor: '0.512',
    moodId: 'cosmic',
    genres: ['sci-fi', 'surreal'],
    targetLabel: 'TARGET: TRANSCENDENTAL METAPHYSICS'
  },
  {
    id: 'tarkovsky',
    label: 'TARKOVSKY SCULPT',
    vectorX: 30,
    vectorY: -45,
    pacing: 15,
    pacingLabel: '15 Hz // Sculpted Time',
    acoustic: 40,
    acousticLabel: '40 dB // Environmental Mist',
    grain: 85,
    grainLabel: 'Celluloid Patina // 85%',
    entropy: 95,
    entropyLabel: '95% Dream Stasis',
    entropyFactor: '0.380',
    moodId: 'zen',
    genres: ['slow-cinema', 'sci-fi'],
    targetLabel: 'TARGET: POETIC TIME STASIS'
  },
  {
    id: 'lynch',
    label: 'LYNCH DREAM LOGIC',
    vectorX: -20,
    vectorY: -15,
    pacing: 35,
    pacingLabel: '35 Hz // Hypnotic hum',
    acoustic: 78,
    acousticLabel: '78 dB // Industrial Drone',
    grain: 80,
    grainLabel: 'Grain Distortion // 80%',
    entropy: 100,
    entropyLabel: '100% Subconscious Logic',
    entropyFactor: '0.620',
    moodId: 'mind-bending',
    genres: ['surreal', 'horror'],
    targetLabel: 'TARGET: UNCANNY SUBCONSCIOUS'
  },
  {
    id: 'wong-kar-wai',
    label: 'WONG KAR-WAI NOCTURNE',
    vectorX: -35,
    vectorY: 20,
    pacing: 48,
    pacingLabel: '48 Hz // Step-Printed Waltz',
    acoustic: 65,
    acousticLabel: '65 dB // Muted Bolero',
    grain: 92,
    grainLabel: 'Neon Saturated // 92%',
    entropy: 60,
    entropyLabel: '60% Elliptical Drift',
    entropyFactor: '0.410',
    moodId: 'nostalgia',
    genres: ['cyberpunk', 'slow-cinema'],
    targetLabel: 'TARGET: LUSH NOCTURNAL YEARNING'
  }
];

// Plotted Cartesian Coordinate Canonical Films (Movie Mode)
const CARTESIAN_NODES = [
  { id: 'br2049', title: 'BR 2049', fullName: 'Blade Runner 2049', tmdbId: 335984, mediaType: 'movie', x: 298, y: 252, coordX: 46, coordY: -22, match: 98, color: '#0055ff', poster: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', year: '2017', director: 'Denis Villeneuve' },
  { id: 'solaris', title: 'Solaris', fullName: 'Solaris', tmdbId: 593, mediaType: 'movie', x: 280, y: 265, coordX: 40, coordY: -32, match: 97, color: '#e63b2e', poster: 'https://image.tmdb.org/t/p/w500/pgqj7QoBPWFLLKtLEpPmFYFRMgB.jpg', year: '1972', director: 'Andrei Tarkovsky' },
  { id: 'arrival', title: 'Arrival', fullName: 'Arrival', tmdbId: 329865, mediaType: 'movie', x: 310, y: 218, coordX: 55, coordY: -9, match: 95, color: '#ffcc00', poster: 'https://image.tmdb.org/t/p/w500/pEzNVQfdzYDzVK0XqxERIw2x2se.jpg', year: '2016', director: 'Denis Villeneuve' },
  { id: 'stalker', title: 'Stalker', fullName: 'Stalker', tmdbId: 1398, mediaType: 'movie', x: 260, y: 290, coordX: 30, coordY: -45, match: 94, color: '#1a1a1a', poster: 'https://image.tmdb.org/t/p/w500/1qhOyf5C4s9ZdvY8d5JDx9DFMeT.jpg', year: '1979', director: 'Andrei Tarkovsky' },
  { id: 'odyssey', title: '2001: Odyssey', fullName: '2001: A Space Odyssey', tmdbId: 62, mediaType: 'movie', x: 330, y: 110, coordX: 65, coordY: 45, match: 96, color: '#0055ff', poster: 'https://image.tmdb.org/t/p/w500/ve72VxNqjGM69Uky4WTo2bK6rfq.jpg', year: '1968', director: 'Stanley Kubrick' },
  { id: 'dune2', title: 'Dune: Pt 2', fullName: 'Dune: Part Two', tmdbId: 693134, mediaType: 'movie', x: 315, y: 150, coordX: 57, coordY: 25, match: 94, color: '#ffcc00', poster: 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg', year: '2024', director: 'Denis Villeneuve' },
  { id: 'parasite', title: 'Parasite', fullName: 'Parasite', tmdbId: 496243, mediaType: 'movie', x: 120, y: 280, coordX: -40, coordY: -40, match: 91, color: '#e63b2e', poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', year: '2019', director: 'Bong Joon-ho' },
  { id: 'eeaao', title: 'EEAAO', fullName: 'Everything Everywhere All At Once', tmdbId: 545611, mediaType: 'movie', x: 110, y: 100, coordX: -45, coordY: 50, match: 92, color: '#0055ff', poster: 'https://image.tmdb.org/t/p/w500/u68AjlvlutfEIcpmbYpKcdi09ut.jpg', year: '2022', director: 'Daniel Kwan, Daniel Scheinert' }
];

// Plotted Cartesian Coordinate Canonical TV Series (Series Mode)
const CARTESIAN_TV_NODES = [
  { id: 'breaking-bad', title: 'Breaking Bad', fullName: 'Breaking Bad', tmdbId: 1396, mediaType: 'tv', x: 295, y: 250, coordX: 45, coordY: -25, match: 99, color: '#0055ff', poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', year: '2008-2013', director: 'Vince Gilligan' },
  { id: 'better-call-saul', title: 'Better Call Saul', fullName: 'Better Call Saul', tmdbId: 60059, mediaType: 'tv', x: 280, y: 265, coordX: 40, coordY: -32, match: 96, color: '#ffcc00', poster: 'https://image.tmdb.org/t/p/w500/zjg4jpK1Wp2kiRvtt5ND0kznako.jpg', year: '2015-2022', director: 'Vince Gilligan, Peter Gould' },
  { id: 'dark', title: 'Dark', fullName: 'Dark', tmdbId: 70523, mediaType: 'tv', x: 310, y: 220, coordX: 55, coordY: -10, match: 98, color: '#e63b2e', poster: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg', year: '2017-2020', director: 'Baran bo Odar' },
  { id: 'severance', title: 'Severance', fullName: 'Severance', tmdbId: 115036, mediaType: 'tv', x: 260, y: 290, coordX: 30, coordY: -45, match: 94, color: '#1a1a1a', poster: 'https://image.tmdb.org/t/p/w500/fAzHg1AB7ZleOnnxip85DNu165d.jpg', year: '2022-', director: 'Ben Stiller' },
  { id: 'stranger-things', title: 'Stranger Things', fullName: 'Stranger Things', tmdbId: 66732, mediaType: 'tv', x: 330, y: 110, coordX: 65, coordY: 45, match: 95, color: '#0055ff', poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', year: '2016-', director: 'The Duffer Brothers' },
  { id: 'arcane', title: 'Arcane', fullName: 'Arcane', tmdbId: 94605, mediaType: 'tv', x: 315, y: 150, coordX: 57, coordY: 25, match: 96, color: '#ffcc00', poster: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg', year: '2021-2024', director: 'Christian Linke, Alex Yee' },
  { id: 'chernobyl', title: 'Chernobyl', fullName: 'Chernobyl', tmdbId: 87108, mediaType: 'tv', x: 120, y: 280, coordX: -40, coordY: -40, match: 97, color: '#e63b2e', poster: 'https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg', year: '2019', director: 'Craig Mazin, Johan Renck' },
  { id: 'true-detective', title: 'True Detective', fullName: 'True Detective', tmdbId: 46648, mediaType: 'tv', x: 110, y: 100, coordX: -45, coordY: 50, match: 95, color: '#0055ff', poster: 'https://image.tmdb.org/t/p/w500/in1R2dDc421JxsoRWaIIAqVI2KE.jpg', year: '2014-', director: 'Nic Pizzolatto, Cary Joji Fukunaga' }
];

// 4 Canonical Default Targets matching Stitch Screen exactly
const CANONICAL_TARGETS = [
  {
    id: 335984,
    title: 'Blade Runner 2049',
    director: 'DENIS VILLENEUVE',
    year: '2017',
    runtime: '164 MIN',
    matchPercentage: 98,
    emojis: '🤯 🚀 🕵️',
    overview: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years amidst a desolate architectural sprawl.",
    metric1Label: 'Cognitive Tension',
    metric1Value: '9.8 / 10',
    metric2Label: 'Acoustic Immersion',
    metric2Value: '9.6 / 10',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2hh8XVAroZm5-A6dzbAZc8VtCqKXH8DBLlr7z9qljcUrOXK7s7tEsHTqCGp2GVhBjlFAtMj3XQ0NqtvB4oUJiiKnVwfZu2jxytLEENZEQ6ENLdGiSoXc6ikZH0BxnqO5kBLn3Zwxj6Cjz-zaF3HhgbHS2xVCPD--XXg8NXPPcuwgIK3AL9Msjhq3_2UHsJvcEcXkiPNml14v9Vg9ukvQVkdR14cRil1ePocgDsBj_NFD6x3TxGW9JJA',
    trailerKey: 'gCcx85zbxz4'
  },
  {
    id: 593,
    title: 'Solaris',
    director: 'ANDREI TARKOVSKY',
    year: '1972',
    runtime: '167 MIN',
    matchPercentage: 97,
    emojis: '🤯 🪐 🧘',
    overview: 'A psychologist is sent to a space station orbiting a mysterious ocean world to discover what has driven the cosmonaut crew into madness, confronting physical manifestations of his grief.',
    metric1Label: 'Existential Depth',
    metric1Value: '9.9 / 10',
    metric2Label: 'Temporal Stasis',
    metric2Value: '9.4 / 10',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVA_6wPzI33m838-TgMYm9bpdnsk0lvzBeFXVHBhZJbi_IdgebofGn_uAMD8vUMOEgrR2Ws3gWtj8ytRo4WeBCfmI2r0kbMf9fG3CkhpFTtejWa1fQrSQNrZUV09jLo9dExQ8mMs7pP91ZOcAYves56Ps_XJybxNRpOUSAlbnp5TCLeta09EARfhaNe7PdlhuIzSbxjKEki8CvfflAAupN3piltF97e4r3DW4MKQgziIQ4VPU9cjh95Q',
    trailerKey: 'R4vS9kG4GCo'
  },
  {
    id: 329865,
    title: 'Arrival',
    director: 'DENIS VILLENEUVE',
    year: '2016',
    runtime: '116 MIN',
    matchPercentage: 95,
    emojis: '🤯 🚀 💔',
    overview: 'Linguistics professor Louise Banks leads an elite team of investigators when gigantic extraterrestrial crafts touch down across 12 locations around the globe, deciphering nonlinear time.',
    metric1Label: 'Linguistic Awe',
    metric1Value: '9.5 / 10',
    metric2Label: 'Emotional Gravitas',
    metric2Value: '9.3 / 10',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2cAzZmEpAvXRgPbQcQZ_ko2KBcKfd9qISfaXEchTiCvmtyQAcL-03uYygPhFuZTaQDsqSh4QjA_Hdb5TUVkt6PMsxpSq3EVEp3jUCelRUWFGzSG8M8BWjtn1Ho86JyHILXFfgJMF1WPkI70_5gjOmd60wW-2TJubETiHdr20yUfUyekfGhmcrTOzMS47-cqd1Xv1xCVY7cgFUisB5N0l3GjHgVIjjN2htYOgMXE0EkODfCmSpPRGbqA',
    trailerKey: 'tFMo3UJ4B4g'
  },
  {
    id: 1398,
    title: 'Stalker',
    director: 'ANDREI TARKOVSKY',
    year: '1979',
    runtime: '162 MIN',
    matchPercentage: 94,
    emojis: '🤯 🌿 🖤',
    overview: "A guide leads two men through a hazardous, military-cordoned wasteland known as 'The Zone' to find 'The Room' which reportedly grants a person's deepest subconscious desire.",
    metric1Label: 'Philosophical Dread',
    metric1Value: '9.7 / 10',
    metric2Label: 'Hypnotic Pacing',
    metric2Value: '9.6 / 10',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-uFcQGtK_gHVYStgvqgMq8Ex8hIM-j0W1vFb0y85PUSUjzFP5K4Mnj0q5xKTiPiUeqK9QIkZHeqEWfqJdMgX-H44df2sLre49BcdMaYHW8pX7y5n-uhPmSgGdMH6zm2Iv0XAvdrmNT6jTNKNGdYmZ0p8P2WtelY9FupZjTauPcUgsGWXSqkqThGYHqy5lKwbqtPorvyWLanB_Wna3wKOK0oW-2I4xxdqYaUhD9hInphZgXacC0p5rfQ',
    trailerKey: 'Q3hBLv-HCE8'
  }
];

export default function MoodContextPicker({ onSelectMovie, onPlayTrailer, pickerRef }) {
  const { watchlist, toggleWatchlist } = useAuth();
  
  // State for active mood token
  const [selectedMoodId, setSelectedMoodId] = useState('mind-bending');
  
  // State for selected genre tokens (multi-select)
  const [selectedGenres, setSelectedGenres] = useState(['sci-fi', 'cyberpunk']);

  // Genre filtering & search state
  const [genreCategory, setGenreCategory] = useState('all');
  const [genreSearch, setGenreSearch] = useState('');

  // Hover state for interactive Cartesian manifold specimen tooltip
  const [hoveredNode, setHoveredNode] = useState(null);
  
  // Cartesian Target Coordinates (origin is at center: [0, 0], bounds: [-100, 100])
  const [coordX, setCoordX] = useState(46);
  const [coordY, setCoordY] = useState(-22);
  
  // 4 Telemetry Sliders
  const [pacing, setPacing] = useState(42);
  const [acoustic, setAcoustic] = useState(84);
  const [grain, setGrain] = useState(70);
  const [entropy, setEntropy] = useState(85);
  
  // Active Directorial Preset
  const [activePreset, setActivePreset] = useState('villeneuve');
  
  // Media Type: 'movie' vs 'tv'
  const [mediaType, setMediaType] = useState('movie');

  // Active Cartesian Nodes based on Media Type
  const activeCartesianNodes = mediaType === 'tv' ? CARTESIAN_TV_NODES : CARTESIAN_NODES;

  // Filtered genres based on active category & search query
  const filteredGenres = useMemo(() => {
    return GENRE_VECTORS.filter(g => {
      const matchesCat = genreCategory === 'all' || g.category === genreCategory;
      const q = genreSearch.trim().toLowerCase();
      const matchesSearch = !q || 
        g.label.toLowerCase().includes(q) || 
        g.tmdbGenre.toLowerCase().includes(q) ||
        g.tag.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [genreCategory, genreSearch]);
  
  // Dynamic recommendations & loading
  const [recommendations, setRecommendations] = useState(CANONICAL_TARGETS);
  const [loading, setLoading] = useState(false);
  const [coherenceScore, setCoherenceScore] = useState(98.4);
  const [toastMessage, setToastMessage] = useState('');
  
  const svgRef = useRef(null);

  // Active mood definition
  const currentMood = MOOD_FREQUENCIES.find(m => m.id === selectedMoodId) || MOOD_FREQUENCIES[0];

  // Dynamic Coherence Score calculation
  useEffect(() => {
    const baseCoherence = 94.0;
    const moodBonus = 2.4;
    const genreBonus = Math.min(selectedGenres.length * 1.0, 3.0);
    const sliderHarmonics = ((pacing + acoustic + grain + entropy) / 400) * 1.5;
    const computed = Math.min(99.8, parseFloat((baseCoherence + moodBonus + genreBonus + sliderHarmonics).toFixed(1)));
    setCoherenceScore(computed);
  }, [selectedMoodId, selectedGenres, pacing, acoustic, grain, entropy]);

  // Fetch real movie recommendations dynamically based on mood, genre, and mediaType
  const fetchLiveRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      // If default combination, maintain the iconic canonical 4 targets
      const isDefault = selectedMoodId === 'mind-bending' &&
        selectedGenres.includes('sci-fi') &&
        selectedGenres.includes('cyberpunk') &&
        selectedGenres.length === 2 &&
        mediaType === 'movie';

      if (isDefault) {
        setRecommendations(CANONICAL_TARGETS);
        setLoading(false);
        return;
      }

      // Map to backend api with multi-genre vector support
      const moodParam = currentMood.id;
      const primaryGenre = selectedGenres[0] || 'sci-fi';
      const data = await api.getMoodContextRecommendations(moodParam, primaryGenre, 12, mediaType, selectedGenres);
      
      if (data?.results && data.results.length >= 4) {
        const mapped = data.results.slice(0, 4).map((m, idx) => {
          const matchVal = 98 - (idx * 2);
          const genreEmojis = selectedGenres.map(g => GENRE_VECTORS.find(gv => gv.id === g)?.emoji).filter(Boolean).join(' ') || '🎬';
          return {
            id: m.id,
            title: m.title || m.name,
            director: m.director || (m.cast ? m.cast[0] : 'ACCLAIMED VISIONARY'),
            year: (m.year || m.release_date || '2023').toString().slice(0, 4),
            runtime: m.runtime ? `${m.runtime} MIN` : '124 MIN',
            matchPercentage: matchVal,
            emojis: `${currentMood.emoji} ${genreEmojis}`,
            overview: m.overview || 'A hypnotic exploration of cinematic depth, atmospheric soundscapes, and sensory resonance.',
            metric1Label: idx % 2 === 0 ? 'Cognitive Tension' : 'Existential Depth',
            metric1Value: `${(9.9 - idx * 0.2).toFixed(1)} / 10`,
            metric2Label: idx % 2 === 0 ? 'Acoustic Immersion' : 'Temporal Resonance',
            metric2Value: `${(9.7 - idx * 0.2).toFixed(1)} / 10`,
            image: m.backdrop_path || m.poster_path || CANONICAL_TARGETS[idx % CANONICAL_TARGETS.length].image,
            trailerKey: m.trailer_key || ''
          };
        });
        setRecommendations(mapped);
      } else {
        setRecommendations(CANONICAL_TARGETS);
      }
    } catch (err) {
      console.warn('Using canonical fallbacks:', err);
      setRecommendations(CANONICAL_TARGETS);
    } finally {
      setLoading(false);
    }
  }, [selectedMoodId, selectedGenres, mediaType, currentMood]);

  useEffect(() => {
    fetchLiveRecommendations();
  }, [fetchLiveRecommendations]);

  // Handle Mood selection
  const handleSelectMood = (mood) => {
    setSelectedMoodId(mood.id);
    setCoordX(mood.vectorX);
    setCoordY(mood.vectorY);
    setPacing(mood.pacing);
    setAcoustic(mood.acoustic);
    setGrain(mood.grain);
    setEntropy(mood.entropy);
    setActivePreset('');
  };

  // Handle Genre toggle
  const handleToggleGenre = (genreId) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(g => g !== genreId);
      }
      return [...prev, genreId];
    });
    setActivePreset('');
  };

  // Handle Shuffle Vibe
  const handleShuffle = () => {
    const randomMood = MOOD_FREQUENCIES[Math.floor(Math.random() * MOOD_FREQUENCIES.length)];
    const shuffledGenres = [...GENRE_VECTORS].sort(() => 0.5 - Math.random());
    const randomGenreCount = Math.random() > 0.5 ? 2 : 3;
    const selected = shuffledGenres.slice(0, randomGenreCount).map(g => g.id);

    setSelectedMoodId(randomMood.id);
    setSelectedGenres(selected);
    setCoordX(randomMood.vectorX + Math.floor(Math.random() * 15 - 7));
    setCoordY(randomMood.vectorY + Math.floor(Math.random() * 15 - 7));
    setPacing(Math.floor(Math.random() * 70 + 20));
    setAcoustic(Math.floor(Math.random() * 60 + 35));
    setGrain(Math.floor(Math.random() * 60 + 30));
    setEntropy(Math.floor(Math.random() * 60 + 35));
    setActivePreset('');
  };

  // Handle Reset to Default Vibe
  const handleReset = () => {
    setSelectedMoodId('mind-bending');
    setSelectedGenres(['sci-fi', 'cyberpunk']);
    setCoordX(46);
    setCoordY(-22);
    setPacing(42);
    setAcoustic(84);
    setGrain(70);
    setEntropy(85);
    setActivePreset('villeneuve');
  };

  // Handle Director Preset click
  const handleSelectPreset = (preset) => {
    setActivePreset(preset.id);
    setCoordX(preset.vectorX);
    setCoordY(preset.vectorY);
    setPacing(preset.pacing);
    setAcoustic(preset.acoustic);
    setGrain(preset.grain);
    setEntropy(preset.entropy);
    setSelectedMoodId(preset.moodId);
    setSelectedGenres(preset.genres);
  };

  // Handle Click on Cartesian SVG Grid to position Target Reticle
  const handleSvgClick = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Convert click in 0..rect.width to -100..100 coordinates
    const normX = Math.round(((clickX / rect.width) * 400 - 200) / 1.8);
    const normY = Math.round((200 - (clickY / rect.height) * 400) / 1.8);
    
    const boundedX = Math.max(-95, Math.min(95, normX));
    const boundedY = Math.max(-95, Math.min(95, normY));
    
    setCoordX(boundedX);
    setCoordY(boundedY);
    setActivePreset('');
  };

  // Convert current coordinates to SVG canvas space (0..400)
  const svgReticleX = 200 + (coordX * 1.8);
  const svgReticleY = 200 - (coordY * 1.8);

  // Dynamic Entropy Factor
  const dynamicEntropyFactor = `Δ ${(0.300 + (entropy / 100) * 0.2 + (Math.abs(coordX) + Math.abs(coordY)) / 1000).toFixed(3)}`;

  // Toast feedback trigger
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3200);
  };

  return (
    <div ref={pickerRef} id="mood-matrix" className="flex flex-col w-full text-on-surface select-none">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-8 z-50 bg-primary-container text-on-primary-container px-5 py-2.5 rounded-xl border-2 border-primary shadow-[4px_4px_0px_#1a1a1a] font-headline font-bold text-sm flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. LIVE TELEMETRY STRIP & ARCHITECTURAL HEADER */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 pt-6">
        
        {/* Telemetry Status Ticker */}
        <div className="w-full bg-surface-container-highest border-2 border-primary p-3 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-widest font-mono shadow-[3px_3px_0px_#1a1a1a]">
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-2.5 h-2.5 bg-secondary rounded-full animate-ping"></span>
            <span className="font-bold text-primary">LIVE VECTOR FEED // CARTESIAN CONSTRUCT 05.01</span>
          </div>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <span>CALIBRATION: <strong className="text-primary font-bold">99.1%</strong></span>
            <span className="hidden sm:inline">|</span>
            <span>RESONANCE: <strong className="text-tertiary font-bold">HARMONIC</strong></span>
            <span className="hidden md:inline">|</span>
            <span className="bg-primary-container text-on-primary-container px-2 py-0.5 border border-primary font-bold">
              BAUHAUS V4.9
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-secondary inline-block border border-primary"></span>
            <span className="w-3 h-3 bg-tertiary inline-block border border-primary"></span>
            <span className="w-3 h-3 bg-primary-container inline-block border border-primary"></span>
          </div>
        </div>

        {/* Title and Tri-Color Accent block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-2 border-primary pb-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-4 h-4 bg-secondary border border-primary"></div>
              <div className="w-4 h-4 bg-tertiary border border-primary"></div>
              <div className="w-4 h-4 bg-primary-container border border-primary"></div>
              <span className="text-xs uppercase tracking-widest font-mono font-bold ml-2 text-on-surface-variant">
                COGNITIVE SENSORY KINETICS
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-headline font-extrabold tracking-tight uppercase leading-[0.95] text-primary">
              Mood Matrix &amp;<br />Sensory Continuum
            </h1>
            <p className="font-body text-base sm:text-lg text-on-surface-variant mt-3 max-w-2xl">
              Plot cinema along psychological vectors, aesthetic entropy, and emotional frequency. Calibrate your sensory affinity through tactile emoji tokens and cartesian coordinate mapping.
            </p>
          </div>

          {/* Quick stats block with brutalist offset */}
          <div className="bg-surface-bright border-2 border-primary p-4 shadow-[4px_4px_0px_#1a1a1a] flex gap-6 self-start lg:self-auto">
            <div>
              <span className="block text-[11px] text-on-surface-variant uppercase font-mono font-bold">ENTROPY FACTOR</span>
              <span className="text-2xl font-black font-headline text-primary">{dynamicEntropyFactor}</span>
            </div>
            <div className="border-l-2 border-primary pl-6">
              <span className="block text-[11px] text-on-surface-variant uppercase font-mono font-bold">TARGET HARMONIC</span>
              <span className="text-2xl font-black font-headline text-tertiary">
                [{coordX >= 0 ? `+${coordX}` : coordX}, {coordY >= 0 ? `+${coordY}` : coordY}]
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EMOJI FREQUENCY & GENRE SELECTOR DOCK */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 mt-8">
        <div className="bg-surface-bright border-2 border-primary p-4 sm:p-6 shadow-[6px_6px_0px_#1a1a1a]">
          
          {/* Header of the module */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-primary pb-3 mb-5 gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 bg-secondary rounded-full border border-primary"></span>
              <h2 className="font-headline font-bold text-lg sm:text-xl tracking-tight uppercase">
                EMOJI FREQUENCY &amp; GENRE MATRIX // WHAT DO YOU WANT TO FEEL?
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider bg-surface-container px-3 py-1 border border-primary font-semibold">
                MODE: MULTI-VECTOR AFFINITY
              </span>
              
              {/* Media Type Toggle: Movies vs TV */}
              <div className="inline-flex rounded-full bg-surface-container p-0.5 border border-primary">
                <button
                  onClick={() => setMediaType('movie')}
                  className={`px-3 py-1 rounded-full text-xs font-headline font-bold uppercase transition-all ${
                    mediaType === 'movie'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  Movies
                </button>
                <button
                  onClick={() => setMediaType('tv')}
                  className={`px-3 py-1 rounded-full text-xs font-headline font-bold uppercase transition-all ${
                    mediaType === 'tv'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  Series
                </button>
              </div>
            </div>
          </div>

          {/* Category A: Emotional & Vibe State */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-secondary">psychology</span>
                CATEGORY A: EMOTIONAL &amp; VIBE STATE
              </span>
              <span className="text-xs text-on-surface-variant hidden sm:inline font-mono">
                1 ACTIVE / {MOOD_FREQUENCIES.length} FREQUENCIES
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {MOOD_FREQUENCIES.map((mood) => {
                const isActive = selectedMoodId === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => handleSelectMood(mood)}
                    className={`rounded-full px-4 py-2 font-headline text-sm tracking-tight flex items-center gap-2 border-2 border-primary transition-all ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-bold shadow-[3px_3px_0px_#1a1a1a] -translate-y-0.5'
                        : 'bg-surface-container text-on-surface font-semibold shadow-[2px_2px_0px_#1a1a1a] hover:bg-primary-container hover:text-on-primary-container hover:-translate-y-0.5'
                    }`}
                    type="button"
                  >
                    <span className="text-lg">{mood.emoji}</span>
                    <span>{mood.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-primary inline-block ml-1"></span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category B: Cinematic Genre Vectors */}
          <div className="mb-5 pt-3 border-t border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 gap-2">
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-tertiary">movie_filter</span>
                CATEGORY B: CINEMATIC GENRE VECTORS ({selectedGenres.length} ACTIVE)
              </span>
              <span className="text-xs text-on-surface-variant font-mono flex items-center gap-2">
                <span className="bg-primary-container text-on-primary-container px-2 py-0.5 font-bold border border-primary">
                  {selectedGenres.length} SELECTED / {GENRE_VECTORS.length} GENRES
                </span>
                {selectedGenres.length > 1 && (
                  <button
                    onClick={() => setSelectedGenres([selectedGenres[0]])}
                    className="text-[11px] underline hover:text-secondary font-bold"
                    type="button"
                  >
                    Clear Extra
                  </button>
                )}
              </span>
            </div>

            {/* Category Filter & Search Strip */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 mb-3 bg-surface-container/50 p-2 border border-primary/30">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
                {GENRE_CATEGORIES.map((cat) => {
                  const isCatActive = genreCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setGenreCategory(cat.id)}
                      className={`px-3 py-1 text-xs font-headline uppercase font-bold rounded-full border-2 transition-all whitespace-nowrap ${
                        isCatActive
                          ? 'bg-primary text-white border-primary shadow-[2px_2px_0px_#1a1a1a] scale-105'
                          : 'bg-surface-container text-on-surface border-primary/30 hover:border-primary'
                      }`}
                      type="button"
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Search & Quick Genre Presets */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-48">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                    search
                  </span>
                  <input
                    type="text"
                    value={genreSearch}
                    onChange={(e) => setGenreSearch(e.target.value)}
                    placeholder="Search genres..."
                    className="w-full pl-8 pr-7 py-1 text-xs font-mono bg-surface-container border border-primary rounded-full focus:outline-none focus:bg-white"
                  />
                  {genreSearch && (
                    <button
                      onClick={() => setGenreSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant hover:text-primary font-bold"
                      type="button"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Quick Presets */}
                <button
                  onClick={() => {
                    setSelectedGenres(['sci-fi', 'cyberpunk']);
                    showToast('Preset: Sci-Fi Neo-Noir selected');
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-surface-bright border border-primary hover:bg-tertiary hover:text-white transition-all rounded-full hidden sm:inline-block"
                  type="button"
                  title="Sci-Fi + Cyberpunk"
                >
                  Noir
                </button>
                <button
                  onClick={() => {
                    setSelectedGenres(['action', 'thriller']);
                    showToast('Preset: High-Stakes Adrenaline selected');
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-surface-bright border border-primary hover:bg-tertiary hover:text-white transition-all rounded-full hidden sm:inline-block"
                  type="button"
                  title="Action + Thriller"
                >
                  Action
                </button>
                <button
                  onClick={() => {
                    setSelectedGenres(['drama', 'slow-cinema']);
                    showToast('Preset: Poetic Drama selected');
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-surface-bright border border-primary hover:bg-tertiary hover:text-white transition-all rounded-full hidden sm:inline-block"
                  type="button"
                  title="Drama + Slow Cinema"
                >
                  Drama
                </button>
              </div>
            </div>

            {/* 20 Genre Pills Grid */}
            <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1">
              {filteredGenres.map((genre) => {
                const isSelected = selectedGenres.includes(genre.id);
                return (
                  <button
                    key={genre.id}
                    onClick={() => handleToggleGenre(genre.id)}
                    className={`rounded-full px-3.5 py-1.5 font-headline text-xs sm:text-sm tracking-tight flex items-center gap-1.5 border-2 border-primary transition-all ${
                      isSelected
                        ? 'bg-tertiary text-on-tertiary font-bold shadow-[3px_3px_0px_#1a1a1a] -translate-y-0.5'
                        : 'bg-surface-container text-on-surface font-semibold shadow-[2px_2px_0px_#1a1a1a] hover:bg-tertiary hover:text-on-tertiary hover:-translate-y-0.5'
                    }`}
                    type="button"
                  >
                    <span className="text-base">{genre.emoji}</span>
                    <span>{genre.label}</span>
                    {isSelected ? (
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    ) : (
                      <span className="text-[9px] font-mono opacity-60 px-1 border border-primary/30 rounded">
                        {genre.tag}
                      </span>
                    )}
                  </button>
                );
              })}
              {filteredGenres.length === 0 && (
                <div className="w-full py-4 text-center text-xs font-mono text-on-surface-variant">
                  No genres found for "{genreSearch}".{' '}
                  <button
                    onClick={() => {
                      setGenreSearch('');
                      setGenreCategory('all');
                    }}
                    className="underline text-primary font-bold ml-1"
                    type="button"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Active Blend readout & Control pill buttons */}
          <div className="bg-primary text-on-primary border-2 border-primary p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-[4px_4px_0px_#1a1a1a]">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm">
              <span className="text-primary-container font-black uppercase tracking-wider">SELECTED VECTOR:</span>
              <span className="bg-surface-bright text-primary px-2.5 py-0.5 rounded-full font-bold border border-primary">
                {currentMood.emoji} {currentMood.label.split(' ')[0]}
              </span>
              {selectedGenres.map((g) => {
                const gObj = GENRE_VECTORS.find(item => item.id === g);
                if (!gObj) return null;
                return (
                  <React.Fragment key={g}>
                    <span className="text-primary-container font-bold">+</span>
                    <span className="bg-surface-bright text-primary px-2.5 py-0.5 rounded-full font-bold border border-primary">
                      {gObj.emoji} {gObj.label.split('/')[0].trim()}
                    </span>
                  </React.Fragment>
                );
              })}
              <span className="text-primary-container font-bold">➔</span>
              <span className="text-primary-container font-black uppercase underline decoration-2">
                Coherence Score: {coherenceScore}%
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
              <button
                onClick={handleShuffle}
                className="rounded-full bg-secondary text-white font-headline font-bold text-xs uppercase tracking-wider px-4 py-2 border-2 border-primary shadow-[2px_2px_0px_#ffffff] hover:bg-white hover:text-secondary transition-all flex items-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">shuffle</span>
                <span>Shuffle Vibe</span>
              </button>
              <button
                onClick={handleReset}
                className="rounded-full bg-surface-bright text-primary font-headline font-bold text-xs uppercase tracking-wider px-4 py-2 border-2 border-primary shadow-[2px_2px_0px_#ffffff] hover:bg-primary hover:text-white transition-all flex items-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CARTESIAN MOOD MATRIX FIELD & VECTOR CALIBRATION */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDE: 2D CARTESIAN GRID (7 Cols) */}
          <div className="lg:col-span-7 bg-surface-bright border-2 border-primary p-4 sm:p-6 shadow-[6px_6px_0px_#1a1a1a] flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-primary pb-2 mb-4 gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-tertiary border border-primary"></span>
                  <span className="font-headline font-bold text-sm tracking-wider uppercase">
                    CARTESIAN 2D MANIFOLD // TMDB HARMONICS
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-secondary bg-surface-container px-2 py-0.5 border border-primary">
                    <span className="material-symbols-outlined text-xs">touch_app</span>
                    CLICK SPECIMEN TO VIEW DETAILS
                  </span>
                  <span className="font-mono text-xs font-bold text-on-surface-variant hidden sm:inline">
                    GRID: 100×100
                  </span>
                </div>
              </div>

              {/* The SVG Interactive Matrix */}
              <div
                onClick={handleSvgClick}
                className="relative w-full aspect-square max-h-[520px] bg-surface border-2 border-primary mx-auto p-4 select-none overflow-hidden cursor-crosshair group"
              >
                {/* Floating Live Dossier Preview on Specimen Hover */}
                {hoveredNode && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectMovie && hoveredNode.tmdbId) {
                        onSelectMovie(hoveredNode.tmdbId);
                      }
                    }}
                    className="absolute bottom-4 right-4 z-30 bg-surface-bright border-2 border-primary p-3 shadow-[5px_5px_0px_#1a1a1a] max-w-[270px] pointer-events-auto cursor-pointer animate-fade-in hover:bg-primary-container/25 transition-all"
                  >
                    <div className="flex gap-2.5 items-center">
                      <img
                        src={hoveredNode.poster}
                        alt={hoveredNode.fullName}
                        className="w-12 h-16 object-cover border-2 border-primary shrink-0 shadow-sm"
                        onError={(e) => {
                          e.target.src = 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] font-mono font-bold bg-secondary text-white px-1.5 py-0.2 uppercase">
                            {hoveredNode.mediaType === 'tv' ? 'SERIES' : 'FILM'}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-on-surface-variant">
                            {hoveredNode.year}
                          </span>
                        </div>
                        <h4 className="font-headline font-bold text-xs uppercase leading-tight truncate text-primary">
                          {hoveredNode.fullName}
                        </h4>
                        <span className="text-[10px] font-mono text-on-surface-variant block truncate">
                          DIR. {hoveredNode.director}
                        </span>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[9px] font-mono font-black text-primary bg-primary-container px-1 border border-primary">
                            {hoveredNode.match}% MATCH
                          </span>
                          <span className="text-[10px] font-headline font-bold uppercase text-secondary underline flex items-center gap-0.5">
                            Open Details ↗
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Axis Labels */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] sm:text-xs font-bold font-headline uppercase px-2.5 py-0.5 rounded-full border border-primary shadow-[2px_2px_0px_#ffcc00] z-20 pointer-events-none">
                  ▲ EUPHORIC / TRANSCENDENT
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] sm:text-xs font-bold font-headline uppercase px-2.5 py-0.5 rounded-full border border-primary shadow-[2px_2px_0px_#ffcc00] z-20 pointer-events-none">
                  ▼ MELANCHOLIC / BLEAK
                </div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 bg-primary text-on-primary text-[10px] sm:text-xs font-bold font-headline uppercase px-2.5 py-0.5 rounded-full border border-primary shadow-[2px_2px_0px_#ffcc00] z-20 origin-center pointer-events-none">
                  ◀ VISCERAL &amp; INSTINCTUAL
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 bg-primary text-on-primary text-[10px] sm:text-xs font-bold font-headline uppercase px-2.5 py-0.5 rounded-full border border-primary shadow-[2px_2px_0px_#ffcc00] z-20 origin-center pointer-events-none">
                  INTELLECTUAL COMPLEXITY ▶
                </div>

                {/* Quadrant Labels */}
                <div className="absolute top-8 left-8 text-on-surface-variant font-mono font-bold text-[11px] uppercase tracking-wider opacity-60 pointer-events-none">
                  QUADRANT II<br /><span className="text-[9px] font-normal">VISCERAL × EUPHORIC</span>
                </div>
                <div className="absolute top-8 right-8 text-right text-on-surface-variant font-mono font-bold text-[11px] uppercase tracking-wider opacity-60 pointer-events-none">
                  QUADRANT I<br /><span className="text-[9px] font-normal">EUPHORIC × INTELLECTUAL</span>
                </div>
                <div className="absolute bottom-8 left-8 text-on-surface-variant font-mono font-bold text-[11px] uppercase tracking-wider opacity-60 pointer-events-none">
                  QUADRANT III<br /><span className="text-[9px] font-normal">BLEAK × VISCERAL</span>
                </div>
                <div className="absolute bottom-8 right-8 text-right text-on-surface-variant font-mono font-bold text-[11px] uppercase tracking-wider opacity-60 pointer-events-none">
                  QUADRANT IV<br /><span className="text-[9px] font-normal">BLEAK × CEREBRAL</span>
                </div>

                {/* SVG Canvas */}
                <svg ref={svgRef} className="w-full h-full" fill="none" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="bauhaus-subgrid" patternUnits="userSpaceOnUse" width="40" height="40">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a1a1a" strokeOpacity="0.2" strokeWidth="0.75" />
                    </pattern>
                  </defs>
                  <rect width="400" height="400" fill="url(#bauhaus-subgrid)" />

                  {/* Cross Axes */}
                  <line x1="200" y1="20" x2="200" y2="380" stroke="#1a1a1a" strokeWidth="2" strokeDasharray="4 2" />
                  <line x1="20" y1="200" x2="380" y2="200" stroke="#1a1a1a" strokeWidth="2" strokeDasharray="4 2" />

                  {/* Dynamic Target Reticle */}
                  <g className="transition-transform duration-300">
                    <circle
                      className="animate-spin-slow"
                      cx={svgReticleX}
                      cy={svgReticleY}
                      r="32"
                      stroke="#e63b2e"
                      strokeDasharray="4 3"
                      strokeWidth="2"
                      style={{ transformOrigin: `${svgReticleX}px ${svgReticleY}px` }}
                    />
                    <circle
                      cx={svgReticleX}
                      cy={svgReticleY}
                      r="14"
                      fill="#ffcc00"
                      fillOpacity="0.35"
                      stroke="#1a1a1a"
                      strokeWidth="2"
                    />
                    <circle cx={svgReticleX} cy={svgReticleY} r="4" fill="#e63b2e" />
                    <line x1={svgReticleX - 32} y1={svgReticleY} x2={svgReticleX + 32} y2={svgReticleY} stroke="#e63b2e" strokeWidth="1.5" />
                    <line x1={svgReticleX} y1={svgReticleY - 32} x2={svgReticleX} y2={svgReticleY + 32} stroke="#e63b2e" strokeWidth="1.5" />
                  </g>

                  {/* Plotted Film & Series Nodes (Interactive: Click to open full details) */}
                  {activeCartesianNodes.map((node) => {
                    const isNearTarget = Math.abs(node.coordX - coordX) < 15 && Math.abs(node.coordY - coordY) < 15;
                    const isHovered = hoveredNode?.id === node.id;
                    const rectWidth = node.title.length * 8 + 48;
                    const rectX = node.x > 200 ? node.x - rectWidth + 8 : node.x + 10;
                    
                    return (
                      <g
                        key={node.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCoordX(node.coordX);
                          setCoordY(node.coordY);
                          showToast(`Opening ${node.fullName} full dossier...`);
                          if (onSelectMovie && node.tmdbId) {
                            onSelectMovie(node.tmdbId);
                          }
                        }}
                        onMouseEnter={() => setHoveredNode(node)}
                        onMouseLeave={() => setHoveredNode(null)}
                        className="cursor-pointer group/node"
                      >
                        {/* Interactive pulsating ring on hover or reticle alignment */}
                        {(isNearTarget || isHovered) && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={15}
                            fill={node.color}
                            fillOpacity="0.25"
                            className="animate-ping"
                          />
                        )}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isNearTarget || isHovered ? 8.5 : 6.5}
                          fill={node.color}
                          stroke="#1a1a1a"
                          strokeWidth="2"
                          className="transition-transform group-hover/node:scale-150"
                        />
                        <rect
                          x={rectX}
                          y={node.y - 10}
                          width={rectWidth}
                          height="20"
                          rx="3"
                          fill={isHovered ? '#ffcc00' : isNearTarget ? '#1a1a1a' : '#ffffff'}
                          stroke="#1a1a1a"
                          strokeWidth={isHovered || isNearTarget ? '2' : '1.5'}
                          className="transition-all duration-200 group-hover/node:shadow-md"
                        />
                        <text
                          x={rectX + 6}
                          y={node.y + 4}
                          fill={isHovered ? '#1a1a1a' : isNearTarget ? '#ffffff' : '#1a1a1a'}
                          fontFamily="Space Grotesk"
                          fontSize="9.5"
                          fontWeight="700"
                        >
                          {node.title} ({node.match}%) ↗
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Target Reticle Badge Info */}
            <div className="mt-4 bg-secondary text-white border-2 border-primary p-3 flex items-center justify-between shadow-[3px_3px_0px_#1a1a1a]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">my_location</span>
                <div>
                  <span className="block text-[10px] font-mono tracking-widest uppercase font-bold text-white/80">
                    LOCK DETECTED
                  </span>
                  <span className="font-headline font-bold text-sm tracking-tight">
                    TARGET: {currentMood.label.toUpperCase()} × {selectedGenres.map(g => g.toUpperCase()).join(' & ')}
                  </span>
                </div>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="bg-primary px-2.5 py-1 rounded border border-white font-bold text-primary-container">
                  [{coordX >= 0 ? `+${coordX}` : coordX}, {coordY >= 0 ? `+${coordY}` : coordY}]
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: VECTOR CALIBRATION DECK (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Calibration Sliders Card */}
            <div className="bg-surface-bright border-2 border-primary p-4 sm:p-6 shadow-[6px_6px_0px_#1a1a1a]">
              <div className="flex items-center justify-between border-b-2 border-primary pb-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary-container border border-primary"></span>
                  <h3 className="font-headline font-bold text-sm tracking-wider uppercase">
                    SENSORY TELEMETRY SLIDERS
                  </h3>
                </div>
                <span className="text-xs font-mono text-on-surface-variant font-bold">4 PARAMETERS</span>
              </div>

              {/* Slider 1: Pacing Frequency */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className="uppercase font-headline flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-secondary inline-block"></span>
                    Pacing Frequency
                  </span>
                  <span className="font-mono bg-surface-container px-2 py-0.5 border border-primary text-[11px]">
                    {pacing} Hz // {pacing < 30 ? 'Contemplative' : pacing < 60 ? 'Slow-Burn' : 'Kinetic'}
                  </span>
                </div>
                <div className="relative w-full h-5 flex items-center">
                  <input
                    type="range"
                    min="10"
                    max="120"
                    value={pacing}
                    onChange={(e) => { setPacing(Number(e.target.value)); setActivePreset(''); }}
                    className="w-full appearance-none bg-surface-container h-3 border-2 border-primary accent-primary cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant mt-0.5">
                  <span>CONTEMPLATIVE (12 Hz)</span>
                  <span>KINETIC (120 Hz)</span>
                </div>
              </div>

              {/* Slider 2: Acoustic Weight */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className="uppercase font-headline flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-tertiary inline-block"></span>
                    Acoustic Weight
                  </span>
                  <span className="font-mono bg-surface-container px-2 py-0.5 border border-primary text-[11px]">
                    {acoustic} dB // {acoustic < 40 ? 'Minimalist' : acoustic < 75 ? 'Sub-Bass Drone' : 'Wall-Of-Sound'}
                  </span>
                </div>
                <div className="relative w-full h-5 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={acoustic}
                    onChange={(e) => { setAcoustic(Number(e.target.value)); setActivePreset(''); }}
                    className="w-full appearance-none bg-surface-container h-3 border-2 border-primary accent-tertiary cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant mt-0.5">
                  <span>SILENCE (0 dB)</span>
                  <span>OPPRESSIVE WALL (100 dB)</span>
                </div>
              </div>

              {/* Slider 3: Visual Grain */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className="uppercase font-headline flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-primary-container inline-block"></span>
                    Visual Grain
                  </span>
                  <span className="font-mono bg-surface-container px-2 py-0.5 border border-primary text-[11px]">
                    {grain < 40 ? 'Digital Clean' : '35mm Brutalist'} // {grain}%
                  </span>
                </div>
                <div className="relative w-full h-5 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={grain}
                    onChange={(e) => { setGrain(Number(e.target.value)); setActivePreset(''); }}
                    className="w-full appearance-none bg-surface-container h-3 border-2 border-primary accent-primary-container cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant mt-0.5">
                  <span>DIGITAL CLEAN (0%)</span>
                  <span>HEAVY CELLULOID (100%)</span>
                </div>
              </div>

              {/* Slider 4: Narrative Entropy */}
              <div className="mb-2">
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className="uppercase font-headline flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-primary inline-block"></span>
                    Narrative Entropy
                  </span>
                  <span className="font-mono bg-surface-container px-2 py-0.5 border border-primary text-[11px]">
                    {entropy}% {entropy < 40 ? 'Three-Act' : entropy < 80 ? 'Non-Linear' : 'Dream Logic'}
                  </span>
                </div>
                <div className="relative w-full h-5 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={entropy}
                    onChange={(e) => { setEntropy(Number(e.target.value)); setActivePreset(''); }}
                    className="w-full appearance-none bg-surface-container h-3 border-2 border-primary accent-primary cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant mt-0.5">
                  <span>THREE-ACT RIGID (0%)</span>
                  <span>DREAM LOGIC (100%)</span>
                </div>
              </div>
            </div>

            {/* Direct Preset Vector Pills */}
            <div className="bg-surface-bright border-2 border-primary p-4 shadow-[6px_6px_0px_#1a1a1a]">
              <span className="block text-xs font-mono uppercase font-bold tracking-widest text-on-surface-variant mb-2">
                DIRECT DIRECTORIAL SIGNATURE PRESETS:
              </span>
              <div className="flex flex-wrap gap-2">
                {DIRECTOR_PRESETS.map((preset) => {
                  const isActive = activePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`rounded-full border-2 border-primary px-3 py-1 font-headline text-xs uppercase tracking-tight transition-all ${
                        isActive
                          ? 'bg-primary-container text-on-primary-container font-bold shadow-[2px_2px_0px_#1a1a1a] -translate-y-0.5'
                          : 'bg-surface-container text-on-surface font-semibold shadow-[2px_2px_0px_#1a1a1a] hover:bg-primary-container hover:-translate-y-0.5'
                      }`}
                      type="button"
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Spectrum Quotient Metric Tile */}
            <div className="bg-primary-container border-2 border-primary p-4 shadow-[6px_6px_0px_#1a1a1a] flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                  SPECTRUM HARMONIC QUOTIENT
                </span>
                <span className="text-2xl font-black font-headline tracking-tight text-primary">
                  0.865 // ULTRA HIGH FIDELITY
                </span>
              </div>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white border-2 border-primary shadow-[2px_2px_0px_#1a1a1a]">
                <span className="material-symbols-outlined text-xl">graphic_eq</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CURATED CINEMA RESONANCES (DENSE NEO-BRUTALIST CARDS) */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-primary pb-3 mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 bg-secondary"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant">
                AFFINITY CONVERGENCE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-headline font-black uppercase tracking-tight text-primary">
              Curated Cinema Resonances ({recommendations.length} Targets)
            </h2>
          </div>
          <span className="font-mono text-xs bg-surface-bright px-3 py-1.5 border-2 border-primary shadow-[2px_2px_0px_#1a1a1a]">
            FILTERS: [{currentMood.emoji} {currentMood.tag}] + {selectedGenres.map(g => `[${GENRE_VECTORS.find(gv => gv.id === g)?.emoji} ${GENRE_VECTORS.find(gv => gv.id === g)?.tag}]`).join(' + ')}
          </span>
        </div>

        {/* 4-Card Bauhaus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {recommendations.map((movie) => {
            const inWatchlist = watchlist.some(w => w.id === movie.id);
            return (
              <article
                key={movie.id}
                onClick={() => onSelectMovie(movie.id)}
                className="bg-surface-bright border-2 border-primary shadow-[6px_6px_0px_#1a1a1a] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[10px_10px_0px_#1a1a1a] transition-all duration-200 cursor-pointer group"
              >
                <div>
                  {/* Image Container with Overlaid Brutalist Badges */}
                  <div className="relative w-full h-56 border-b-2 border-primary overflow-hidden bg-surface-dim">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-primary text-on-primary font-headline font-black text-xs px-2.5 py-1 border border-primary rounded-full shadow-[2px_2px_0px_#ffcc00]">
                      {movie.matchPercentage}% VECTOR MATCH
                    </div>
                    <div className="absolute top-2 right-2 bg-surface-bright border border-primary px-2 py-0.5 text-sm rounded-full font-bold shadow-[2px_2px_0px_#1a1a1a]">
                      {movie.emojis}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-secondary text-white font-mono text-[10px] font-bold px-2 py-0.5 uppercase border border-primary">
                      {movie.year} // {movie.runtime}
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-4">
                    <h3 className="font-headline font-extrabold text-xl uppercase tracking-tight text-primary leading-tight group-hover:text-primary-container transition-colors">
                      {movie.title}
                    </h3>
                    <span className="block font-mono text-xs text-on-surface-variant font-bold mt-0.5">
                      DIR. {movie.director}
                    </span>
                    <p className="font-body text-sm text-on-surface-variant mt-2 line-clamp-3">
                      {movie.overview}
                    </p>

                    {/* Vector Metrics */}
                    <div className="mt-4 border-t-2 border-primary/20 pt-2 flex flex-col gap-1.5 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">{movie.metric1Label}:</span>
                        <span className="font-bold text-primary bg-primary-container px-1.5 border border-primary">
                          {movie.metric1Value}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">{movie.metric2Label}:</span>
                        <span className="font-bold text-tertiary bg-tertiary-container px-1.5 border border-primary">
                          {movie.metric2Value}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="p-4 pt-0 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayTrailer(movie.id);
                    }}
                    className="flex-1 rounded-full bg-primary text-on-primary font-headline font-bold text-xs uppercase tracking-wider py-2.5 border-2 border-primary shadow-[2px_2px_0px_#ffcc00] hover:bg-primary-container hover:text-primary transition-all flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px]"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">play_arrow</span>
                    <span>Trailer</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist({
                        id: movie.id,
                        title: movie.title,
                        poster_path: movie.image,
                        year: movie.year,
                        vote_average: 8.5
                      });
                      showToast(inWatchlist ? `Removed ${movie.title} from Vault` : `Added ${movie.title} to Vault`);
                    }}
                    aria-label="Add to watchlist"
                    className={`rounded-full w-10 h-10 border-2 border-primary flex items-center justify-center shadow-[2px_2px_0px_#1a1a1a] transition-all ${
                      inWatchlist
                        ? 'bg-secondary text-white'
                        : 'bg-surface-container text-primary hover:bg-secondary hover:text-white'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">
                      {inWatchlist ? 'bookmark_added' : 'bookmark_add'}
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. ARCHITECTURAL MANIFESTO & TELEMETRY FOOTPRINT */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 mt-14 mb-8">
        <div className="border-2 border-primary bg-surface-bright p-6 sm:p-8 shadow-[8px_8px_0px_#1a1a1a] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-primary text-white text-[11px] font-mono font-bold uppercase">
                BAUHAUS PROTOCOL 01
              </span>
              <span className="text-xs font-mono font-bold text-on-surface-variant">
                // SENSORY HOMOLOGY
              </span>
            </div>
            <h4 className="text-2xl font-headline font-black uppercase text-primary tracking-tight">
              Form Follows Emotion: The Cartesian Vector Thesis
            </h4>
            <p className="font-body text-sm sm:text-base text-on-surface-variant mt-2 max-w-2xl">
              Cinema recommendation algorithms fail when they rely purely on metadata tags like actors and release years. CinePulse constructs an ambient vector continuum where subjective emotional state dictates harmonic visual frequency.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col gap-2.5">
            <button
              onClick={() => {
                showToast(`Vector Profile [${currentMood.tag}] Saved to CinePulse Vault`);
              }}
              className="w-full rounded-full bg-primary-container text-primary font-headline font-black text-xs uppercase tracking-widest py-3 border-2 border-primary shadow-[4px_4px_0px_#1a1a1a] hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
              type="button"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              <span>Save Vector Profile</span>
            </button>
            <button
              onClick={() => {
                const vectorUrl = `${window.location.origin}/#vector=${coordX},${coordY}`;
                navigator.clipboard?.writeText(vectorUrl);
                showToast(`Copied Vector Coordinates [${coordX}, ${coordY}] to Clipboard!`);
              }}
              className="w-full rounded-full bg-surface-container text-primary font-headline font-bold text-xs uppercase tracking-widest py-3 border-2 border-primary shadow-[4px_4px_0px_#1a1a1a] hover:bg-tertiary hover:text-white transition-all flex items-center justify-center gap-2"
              type="button"
            >
              <span className="material-symbols-outlined text-base">share</span>
              <span>Export Coordinate [{coordX}, {coordY}]</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
