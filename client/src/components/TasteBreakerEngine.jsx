import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const INITIAL_SPECIMENS = [
  {
    id: 104,
    title: 'Paprika',
    director: 'Satoshi Kon',
    year: '2006',
    rating: 'R',
    cerebralMatch: '98%',
    tasteDelta: '+64%',
    genre: 'Surrealist Anime / Sci-Fi Mystery',
    runtime: '90 MIN',
    soundtrack: 'Susumu Hirasawa OST',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    tags: ['Radical Pivot', 'Montage Surrealism'],
    whyBreaksBubble: 'You typically watch 85% Western Hard Sci-Fi & Linear Neo-Noirs; this surrealist Japanese psychological anime matches your demand for high-cerebral narrative complexity while shattering formal pacing through hyper-kinetic non-linear montage theory.',
    quote: "Don't you think the dreams and the internet are similar? They are both areas where the repressed conscious mind vents.",
    quoteAuthor: 'Paprika / Chiba Atsuko',
    familiarity: 22,
    cognitiveLoad: 94,
    sensoryNovelty: 88,
    varianceDelta: '+64.8% EXPANDED',
    media_type: 'movie',
    radarPoints: [
      { x: 50, y: 8, label: 'Pacing & Structure' },
      { x: 92, y: 38, label: 'Origin (Asia)' },
      { x: 78, y: 88, label: 'Visual Abstraction' },
      { x: 22, y: 82, label: 'Tone (Challenger)' },
      { x: 12, y: 28, label: 'Narrative Entanglement' }
    ]
  },
  {
    id: 105,
    title: 'Anatomy of a Fall',
    director: 'Justine Triet',
    year: '2023',
    rating: 'R',
    cerebralMatch: '95%',
    tasteDelta: '+52%',
    genre: 'French Legal Thriller / Neo-Realism',
    runtime: '151 MIN',
    soundtrack: 'Bacao Rhythm & Steel Band',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    tags: ['Forensic Realism', 'Ambiguity Thesis'],
    whyBreaksBubble: 'Departs from high-concept CGI spectacles into an intensely claustrophobic, multilingual courtroom autopsy where truth is not uncovered, but rhetorically constructed.',
    quote: 'When you lack evidence, you have to interpret. And interpretation is narrative fiction.',
    quoteAuthor: 'Sandra Voyter / Sandra Hüller',
    familiarity: 31,
    cognitiveLoad: 89,
    sensoryNovelty: 76,
    varianceDelta: '+52.4% EXPANDED',
    media_type: 'movie',
    radarPoints: [
      { x: 50, y: 20, label: 'Pacing & Structure' },
      { x: 82, y: 48, label: 'Origin (Europe)' },
      { x: 70, y: 75, label: 'Visual Realism' },
      { x: 30, y: 85, label: 'Psychological Tension' },
      { x: 18, y: 35, label: 'Linguistic Layering' }
    ]
  },
  {
    id: 106,
    title: 'Stalker',
    director: 'Andrei Tarkovsky',
    year: '1979',
    rating: 'PG',
    cerebralMatch: '99%',
    tasteDelta: '+71%',
    genre: 'Philosophical Sci-Fi / Slow Cinema',
    runtime: '162 MIN',
    soundtrack: 'Eduard Artemyev',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    tags: ['Temporal Dilation', 'Metaphysical Void'],
    whyBreaksBubble: 'Substitutes adrenaline-fueled conflict for 10-minute uninterrupted takes across poisoned industrial wetlands, transforming science fiction into an existential religious pilgrimage.',
    quote: 'Let everything that has been planned come true. Let them believe. And let them have a laugh at their passions.',
    quoteAuthor: 'The Stalker / Aleksandr Kaidanovsky',
    familiarity: 15,
    cognitiveLoad: 97,
    sensoryNovelty: 94,
    varianceDelta: '+71.2% EXPANDED',
    media_type: 'movie',
    radarPoints: [
      { x: 50, y: 5, label: 'Hypnotic Slowness' },
      { x: 95, y: 32, label: 'Soviet Poetics' },
      { x: 85, y: 92, label: 'Celluloid Texture' },
      { x: 15, y: 88, label: 'Spiritual Weight' },
      { x: 8, y: 22, label: 'Radical Minimalism' }
    ]
  },
  {
    id: 107,
    title: 'Drive My Car',
    director: 'Ryusuke Hamaguchi',
    year: '2021',
    rating: 'Unrated',
    cerebralMatch: '93%',
    tasteDelta: '+48%',
    genre: 'Introspective Drama / Murakami Adaptation',
    runtime: '179 MIN',
    soundtrack: 'Eiko Ishibashi Ambient Score',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    tags: ['Acoustic Intimacy', 'Cathartic Drive'],
    whyBreaksBubble: 'Forces meditative vulnerability through multilingual Chekhov theater rehearsals inside a vintage red Saab 900 Turbo driving through Hiroshima.',
    quote: 'Those who survive keep thinking about the dead. In one way or another, that will continue.',
    quoteAuthor: 'Yusuke Kafuku / Hidetoshi Nishijima',
    familiarity: 28,
    cognitiveLoad: 84,
    sensoryNovelty: 82,
    varianceDelta: '+48.5% EXPANDED',
    media_type: 'movie',
    radarPoints: [
      { x: 50, y: 25, label: 'Literary Pacing' },
      { x: 88, y: 42, label: 'Japanese Spatiality' },
      { x: 65, y: 80, label: 'Naturalistic Light' },
      { x: 25, y: 78, label: 'Repressed Grief' },
      { x: 20, y: 30, label: 'Verbal Cadence' }
    ]
  },
  {
    id: 108,
    title: 'Beau Travail',
    director: 'Claire Denis',
    year: '1999',
    rating: 'Unrated',
    cerebralMatch: '96%',
    tasteDelta: '+67%',
    genre: 'Poetic Realism / Queer Post-Colonial Noir',
    runtime: '92 MIN',
    soundtrack: 'Benjamin Britten & Corona Dance',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=80',
    tags: ['Choreographic Body', 'Sun-Baked Cinema'],
    whyBreaksBubble: 'Replaces traditional plot momentum with ritualized physical choreography in the Djibouti desert set to hypnotic opera and Eurodance.',
    quote: 'We had no purpose. We were rhythmic machines operating in the blinding salt plains of the Horn.',
    quoteAuthor: 'Galoup / Denis Lavant',
    familiarity: 19,
    cognitiveLoad: 92,
    sensoryNovelty: 91,
    varianceDelta: '+67.0% EXPANDED',
    media_type: 'movie',
    radarPoints: [
      { x: 50, y: 12, label: 'Physical Rhythm' },
      { x: 90, y: 35, label: 'French Post-Colonial' },
      { x: 80, y: 85, label: 'Visual Ecstasy' },
      { x: 20, y: 80, label: 'Obsessive Envy' },
      { x: 15, y: 25, label: 'Sound Collage' }
    ]
  },
  {
    id: 70523,
    title: 'Dark',
    director: 'Baran bo Odar',
    year: '2017',
    rating: 'TV-MA',
    cerebralMatch: '99%',
    tasteDelta: '+78%',
    genre: 'Mystery / Sci-Fi Time Labyrinth',
    runtime: '60 MIN / EP',
    soundtrack: 'Ben Frost Dark Ambient Score',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    tags: ['Temporal Paradox', 'German Noir Series'],
    whyBreaksBubble: 'A mind-bending German television masterwork spanning four generations across an intricate bootstrap paradox, proving television can achieve unmatched philosophical and existential complexity.',
    quote: 'The question is not where, but when.',
    quoteAuthor: 'The Stranger / Andreas Pietschmann',
    familiarity: 18,
    cognitiveLoad: 99,
    sensoryNovelty: 96,
    varianceDelta: '+78.3% EXPANDED',
    media_type: 'tv',
    radarPoints: [
      { x: 50, y: 5, label: 'Infinite Time Loops' },
      { x: 90, y: 30, label: 'German Precision' },
      { x: 80, y: 90, label: 'Nocturnal Tone' },
      { x: 18, y: 85, label: 'Existential Dread' },
      { x: 10, y: 20, label: 'Symmetrical Narrative' }
    ]
  },
  {
    id: 95557,
    title: 'Severance',
    director: 'Ben Stiller',
    year: '2022',
    rating: 'TV-MA',
    cerebralMatch: '97%',
    tasteDelta: '+69%',
    genre: 'Corporate Thriller / Dystopian Satire',
    runtime: '50 MIN / EP',
    soundtrack: 'Theodore Shapiro Minimalist Piano',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    tags: ['Corporate Isolation', 'Dystopian Satire'],
    whyBreaksBubble: 'Subverts standard thriller expectations through eerie fluorescent corporate brutalism, anatomizing modern alienated labor through an ingenious cognitive severance procedure.',
    quote: 'Please try to enjoy each fact equally, and not show preference for any over the others.',
    quoteAuthor: 'Ms. Casey / Dichen Lachman',
    familiarity: 24,
    cognitiveLoad: 93,
    sensoryNovelty: 92,
    varianceDelta: '+69.1% EXPANDED',
    media_type: 'tv',
    radarPoints: [
      { x: 50, y: 15, label: 'Fluorescent Pacing' },
      { x: 88, y: 35, label: 'Liminal Architecture' },
      { x: 70, y: 80, label: 'Sterile Aesthetics' },
      { x: 22, y: 85, label: 'Identity Partition' },
      { x: 15, y: 25, label: 'Cold Paranoia' }
    ]
  }
];

export default function TasteBreakerEngine({ onSelectMovie, onPlayTrailer }) {
  const { currentUser, watchlist, addToWatchlist, removeFromWatchlist } = useAuth();

  // Randomize initial pick across the pool on first load
  const initialRandomIndex = useRef(Math.floor(Math.random() * INITIAL_SPECIMENS.length)).current;
  const [history, setHistory] = useState(() => [INITIAL_SPECIMENS[initialRandomIndex]]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [excludedIds, setExcludedIds] = useState(() => [String(INITIAL_SPECIMENS[initialRandomIndex].id)]);

  const [dissonanceLevel, setDissonanceLevel] = useState(4);
  const [temporalWindow, setTemporalWindow] = useState(3);
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all'); // 'all', 'movie', 'tv'
  const [isRotating, setIsRotating] = useState(false);
  const [streakCount, setStreakCount] = useState(1);

  const specimen = history[currentIndex] || INITIAL_SPECIMENS[0];
  const isSaved = watchlist.some(m => String(m.id) === String(specimen.id) || m.title === specimen.title);

  // Fetch a genuinely random surprise pick from the server API
  const fetchRandomSurprise = useCallback(async (currentExcluded = []) => {
    setIsRotating(true);
    try {
      const data = await api.getSurpriseRecommendation(currentUser?.id, currentExcluded, {
        mediaType: mediaTypeFilter,
        temporalWindow,
        dissonanceLevel
      });

      if (data?.specimen) {
        const nextSpecimen = data.specimen;
        setHistory(prev => {
          const updated = [...prev, nextSpecimen];
          setCurrentIndex(updated.length - 1);
          return updated;
        });
        setExcludedIds(prev => [...new Set([...prev, String(nextSpecimen.id)])]);
        setStreakCount(s => s + 1);
      } else {
        // Fallback: pick another initial specimen not seen yet
        const unseen = INITIAL_SPECIMENS.filter(s => !currentExcluded.includes(String(s.id)));
        const fallbackPick = unseen.length > 0
          ? unseen[Math.floor(Math.random() * unseen.length)]
          : INITIAL_SPECIMENS[Math.floor(Math.random() * INITIAL_SPECIMENS.length)];
        
        setHistory(prev => {
          const updated = [...prev, fallbackPick];
          setCurrentIndex(updated.length - 1);
          return updated;
        });
        setExcludedIds(prev => [...new Set([...prev, String(fallbackPick.id)])]);
        setStreakCount(s => s + 1);
      }
    } catch (err) {
      console.warn('Network issue fetching surprise recommendation, using client fallback:', err);
      const unseen = INITIAL_SPECIMENS.filter(s => !currentExcluded.includes(String(s.id)));
      const fallbackPick = unseen.length > 0
        ? unseen[Math.floor(Math.random() * unseen.length)]
        : INITIAL_SPECIMENS[Math.floor(Math.random() * INITIAL_SPECIMENS.length)];

      setHistory(prev => {
        const updated = [...prev, fallbackPick];
        setCurrentIndex(updated.length - 1);
        return updated;
      });
      setExcludedIds(prev => [...new Set([...prev, String(fallbackPick.id)])]);
      setStreakCount(s => s + 1);
    } finally {
      setTimeout(() => setIsRotating(false), 300);
    }
  }, [currentUser, mediaTypeFilter, temporalWindow, dissonanceLevel]);

  const handleNextPick = () => {
    if (isRotating) return;
    fetchRandomSurprise(excludedIds);
  };

  const handleResetMatrix = () => {
    setDissonanceLevel(4);
    setTemporalWindow(3);
    setMediaTypeFilter('all');
    fetchRandomSurprise([]);
  };

  const getDissonanceLabel = (lvl) => {
    switch (lvl) {
      case 1: return 'LEVEL 1 — MILD STRETCH';
      case 2: return 'LEVEL 2 — SUBTLE PIVOT';
      case 3: return 'LEVEL 3 — LATERAL LEAP';
      case 4: return 'LEVEL 4 — AVANT-GARDE';
      case 5: return 'LEVEL 5 — TOTAL CHAOS';
      default: return 'LEVEL 4 — AVANT-GARDE';
    }
  };

  const getTemporalLabel = (era) => {
    switch (era) {
      case 1: return '1920 — 1959 (SILENT/GOLDEN)';
      case 2: return '1960 — 1989 (NEW WAVE)';
      case 3: return '1990 — 2017 (MODERN)';
      case 4: return '2018 — PRESENT (CONTEMPORARY)';
      default: return 'ALL ERAS';
    }
  };

  const toggleWatchlist = () => {
    if (!specimen) return;
    if (isSaved) {
      removeFromWatchlist(specimen.id);
    } else {
      addToWatchlist({
        id: specimen.id,
        title: specimen.title,
        year: specimen.year,
        director: specimen.director,
        poster_path: specimen.poster,
        vote_average: 8.5,
        sensory_match: specimen.cerebralMatch,
        genres: [specimen.genre],
        media_type: specimen.media_type || 'movie'
      });
    }
  };

  const defaultRadarPoints = [
    { x: 50, y: 20, label: 'Pacing & Structure' },
    { x: 80, y: 40, label: 'Origin' },
    { x: 70, y: 75, label: 'Visual Realism' },
    { x: 30, y: 85, label: 'Tension' },
    { x: 20, y: 35, label: 'Layering' }
  ];

  const radarPoints = specimen?.radarPoints && specimen.radarPoints.length >= 5
    ? specimen.radarPoints
    : defaultRadarPoints;

  const radarSvgPoints = radarPoints.map(p => `${p.x},${p.y}`).join(' ');

  const directorFirst = (specimen.director || 'Cinema').split(' ')[0];
  const tagsList = Array.isArray(specimen.tags) && specimen.tags.length > 0 ? specimen.tags : ['Cinema Leap', 'Unseen Narrative'];

  return (
    <div className="w-full flex flex-col">
      
      {/* Top Section: Kinetic Taste-Breaker Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 pb-6 w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-outline">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-white font-label text-xs uppercase font-bold tracking-widest mb-3 shadow-[2px_2px_0px_#1a1a1a] border border-outline">
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>Serendipity Protocol 04-X</span>
            </div>
            <h1 className="font-headline font-bold text-4xl sm:text-6xl uppercase tracking-tighter text-on-surface leading-none">
              The Taste-Breaker Engine
            </h1>
            <p className="font-body text-on-surface-variant text-sm sm:text-base mt-2 max-w-2xl">
              Step outside your cinematic comfort bubble. Endless randomized discoveries from worldwide cinema and prestige TV series, calibrated to induce productive aesthetic dissonance.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-surface-container-highest px-4 py-3 border-2 border-outline shadow-[3px_3px_0px_#1a1a1a] flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-primary-fixed animate-ping border border-outline"></div>
              <div>
                <div className="font-label text-[10px] uppercase font-bold tracking-wider text-on-surface-variant leading-none">
                  Discovery Pool
                </div>
                <div className="font-headline font-bold text-lg text-on-surface mt-0.5">
                  10,000+ UNLOCKED
                </div>
              </div>
            </div>
            <button
              onClick={handleResetMatrix}
              className="px-5 py-3 rounded-full bg-primary text-on-primary font-label text-xs uppercase tracking-wider font-bold border-2 border-outline shadow-[3px_3px_0px_#1a1a1a] hover:bg-primary-fixed hover:text-on-primary-fixed transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              Reset Matrix
            </button>
          </div>
        </div>
      </section>

      {/* Main Showcase Bento Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Center: Interactive Reveal Showcase (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Kinetic Reveal Card Container */}
            <div className={`relative bg-surface-container-lowest border-2 border-outline shadow-[6px_6px_0px_#1a1a1a] transition-all duration-300 overflow-hidden ${isRotating ? 'opacity-50 scale-[0.99]' : 'opacity-100 scale-100'}`}>
              
              {/* Bauhaus Top Marker Strip */}
              <div className="flex items-center justify-between px-6 py-3 bg-surface-variant border-b-2 border-outline">
                <div className="flex items-center gap-3 font-label text-xs font-bold uppercase tracking-wider text-on-surface">
                  <span className="w-2.5 h-2.5 bg-secondary border border-outline"></span>
                  <span>Disruption Vector #{specimen.id}</span>
                  <span className="text-on-surface-variant font-normal">/ {directorFirst} Specimen</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold border border-outline uppercase ${specimen.media_type === 'tv' ? 'bg-secondary text-white' : 'bg-primary text-on-primary'}`}>
                    {specimen.media_type === 'tv' ? 'TV Series' : 'Movie'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {tagsList.map((tag, i) => (
                    <span
                      key={`${tag}-${i}`}
                      className={`text-[10px] font-label font-bold px-2 py-0.5 uppercase border border-outline ${
                        i === 0 ? 'bg-primary text-on-primary' : 'bg-tertiary text-white'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Body Split: Poster & Disruption Analytics - Fixed height on md+ so it never jumps or resizes between movies */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:h-[580px]">
                
                {/* Poster Showcase Column - Fills height fully without dead space */}
                <div className="md:col-span-5 relative bg-primary flex flex-col border-b-2 md:border-b-0 md:border-r-2 border-outline h-full">
                  <div className="relative w-full h-[360px] md:h-auto md:flex-1 min-h-0 overflow-hidden group bg-surface-container-high">
                    <img
                      src={specimen.poster}
                      alt={specimen.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent pointer-events-none"></div>
                    
                    {/* Floating Poster Overlay Badge */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="bg-primary-fixed text-on-primary-fixed px-2 py-1 font-label text-[11px] font-bold uppercase border border-outline shadow-[2px_2px_0px_#1a1a1a]">
                          {specimen.cerebralMatch} Cerebral Match
                        </span>
                        <p className="font-headline font-bold text-white text-lg sm:text-xl mt-1.5 tracking-tight truncate max-w-[220px]">
                          {specimen.director}, {specimen.year}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center border-2 border-outline font-label font-bold text-xs shadow-[1.5px_1.5px_0px_#1a1a1a] shrink-0">
                        {specimen.rating}
                      </div>
                    </div>
                  </div>

                  {/* Auditory Teaser Strip */}
                  <div className="p-3.5 bg-surface-container border-t-2 border-outline flex items-center justify-between text-xs font-label uppercase font-bold text-on-surface shrink-0">
                    <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                      <span className="material-symbols-outlined text-base text-secondary shrink-0">graphic_eq</span>
                      <span className="truncate">{specimen.soundtrack}</span>
                    </span>
                    <span className="text-on-surface-variant font-mono shrink-0 ml-2">{specimen.runtime}</span>
                  </div>
                </div>

                {/* Analysis & Break-Bubble Deep Dive - Consistent layout with fixed spacing */}
                <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between bg-surface-container-lowest h-full overflow-hidden">
                  <div className="flex flex-col gap-4">
                    {/* Title & Meta Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <span className="font-label text-xs uppercase tracking-widest text-secondary font-bold">
                          Unseen Territory
                        </span>
                        <h2 
                          className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tighter text-on-surface mt-0.5 leading-tight line-clamp-2"
                          title={specimen.title}
                        >
                          {specimen.title}
                        </h2>
                      </div>
                      
                      {/* Variance Gauge Pill */}
                      <div className="flex flex-col items-end shrink-0">
                        <div className="bg-tertiary-container text-on-tertiary-container px-3 py-1 font-label font-bold text-xs uppercase border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-tertiary">trending_up</span>
                          <span>{specimen.tasteDelta} Taste Delta</span>
                        </div>
                        <span className="text-[10px] font-label text-on-surface-variant mt-1 uppercase font-semibold">
                          Exploration Leap
                        </span>
                      </div>
                    </div>

                    {/* Callout Box: Why This Breaks Your Bubble */}
                    <div className="p-3.5 bg-surface-container border-2 border-outline shadow-[3px_3px_0px_#1a1a1a] relative mt-1">
                      <div className="absolute -top-2.5 left-3 bg-secondary text-white px-2 py-0.5 font-label text-[9px] font-bold uppercase tracking-wider border border-outline">
                        Why This Breaks Your Bubble
                      </div>
                      <p className="font-body text-xs sm:text-sm text-on-surface leading-relaxed mt-0.5 line-clamp-3" title={specimen.whyBreaksBubble}>
                        {specimen.whyBreaksBubble}
                      </p>
                    </div>

                    {/* Curated Quote Strip */}
                    <div className="pl-3.5 border-l-4 border-primary">
                      <p className="font-body italic text-xs sm:text-sm text-on-surface-variant leading-snug line-clamp-2 sm:line-clamp-3" title={specimen.quote}>
                        "{specimen.quote}"
                      </p>
                      <span className="font-label text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-on-surface block mt-1 truncate">
                        — {specimen.quoteAuthor}
                      </span>
                    </div>

                    {/* Taste Delta Data Visualizer Inline */}
                    <div className="pt-3 border-t-2 border-surface-variant grid grid-cols-3 gap-2.5 text-center">
                      <div className="bg-surface-container-high p-2 sm:p-2.5 border border-outline">
                        <div className="font-label text-[9px] sm:text-[10px] uppercase font-bold text-on-surface-variant">Familiarity</div>
                        <div className="font-headline font-bold text-lg sm:text-xl text-on-surface mt-0.5">{specimen.familiarity}%</div>
                        <div className="w-full bg-surface-variant h-1.5 mt-1.5 overflow-hidden border border-outline/30">
                          <div className="bg-outline h-full transition-all duration-500" style={{ width: `${specimen.familiarity}%` }}></div>
                        </div>
                      </div>
                      <div className="bg-surface-container-high p-2 sm:p-2.5 border border-outline">
                        <div className="font-label text-[9px] sm:text-[10px] uppercase font-bold text-on-surface-variant">Cognitive Load</div>
                        <div className="font-headline font-bold text-lg sm:text-xl text-secondary mt-0.5">{specimen.cognitiveLoad}%</div>
                        <div className="w-full bg-surface-variant h-1.5 mt-1.5 overflow-hidden border border-outline/30">
                          <div className="bg-secondary h-full transition-all duration-500" style={{ width: `${specimen.cognitiveLoad}%` }}></div>
                        </div>
                      </div>
                      <div className="bg-surface-container-high p-2 sm:p-2.5 border border-outline">
                        <div className="font-label text-[9px] sm:text-[10px] uppercase font-bold text-on-surface-variant">Sensory Novelty</div>
                        <div className="font-headline font-bold text-lg sm:text-xl text-tertiary mt-0.5">{specimen.sensoryNovelty}%</div>
                        <div className="w-full bg-surface-variant h-1.5 mt-1.5 overflow-hidden border border-outline/30">
                          <div className="bg-tertiary h-full transition-all duration-500" style={{ width: `${specimen.sensoryNovelty}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Controls: Curved Pill Action Bar */}
                  <div className="mt-4 flex flex-wrap items-center gap-2.5 pt-3.5 border-t-2 border-outline shrink-0">
                    {/* Next Surprise Pick (Yellow Pill) */}
                    <button
                      onClick={handleNextPick}
                      disabled={isRotating}
                      className="group relative px-6 py-3 rounded-full bg-primary-fixed text-on-primary-fixed font-label font-bold text-xs uppercase tracking-wider border-2 border-outline shadow-[4px_4px_0px_#1a1a1a] hover:shadow-[1px_1px_0px_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5 active:bg-primary active:text-on-primary transition-all duration-200 flex items-center gap-2 overflow-hidden cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-lg ${isRotating ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`}>
                        autorenew
                      </span>
                      <span>{isRotating ? 'Finding Pick...' : 'Next Surprise Pick'}</span>
                      <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                    </button>

                    {/* Watchlist Pill */}
                    <button
                      onClick={toggleWatchlist}
                      className={`px-5 py-3 rounded-full font-label font-bold text-xs uppercase tracking-wider border-2 border-outline shadow-[3px_3px_0px_#1a1a1a] transition-all flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                        isSaved ? 'bg-secondary text-white' : 'bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-on-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isSaved ? 'bookmark_added' : 'bookmark_add'}
                      </span>
                      <span>{isSaved ? 'In Vault' : '+ Watchlist'}</span>
                    </button>

                    {/* Trailer Pill */}
                    <button
                      onClick={() => onPlayTrailer && onPlayTrailer(specimen.id, specimen.media_type || 'movie')}
                      className="px-5 py-3 rounded-full bg-surface-container-lowest text-on-surface font-label font-bold text-xs uppercase tracking-wider border-2 border-outline shadow-[3px_3px_0px_#1a1a1a] hover:bg-secondary hover:text-white transition-all flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">play_circle</span>
                      <span>Trailer</span>
                    </button>

                    {/* Full Dossier Trigger */}
                    <button
                      onClick={() => onSelectMovie && onSelectMovie(specimen.id, specimen.media_type || 'movie')}
                      className="ml-auto px-4 py-3 rounded-full bg-surface-variant text-on-surface font-label font-bold text-xs uppercase tracking-wider border-2 border-outline hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Dossier</span>
                      <span className="material-symbols-outlined text-sm">north_east</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* Serendipity Calibration Strip (Sliders & Filters) */}
            <div className="bg-surface-container-low border-2 border-outline p-6 shadow-[4px_4px_0px_#1a1a1a]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b-2 border-surface-variant gap-2">
                <div>
                  <span className="font-headline font-bold text-lg uppercase tracking-tight text-on-surface block">
                    Calibration Controls
                  </span>
                  <p className="font-body text-xs text-on-surface-variant">
                    Dial how violently the algorithm wrenches you from familiar habits
                  </p>
                </div>

                {/* Media Type Quick Filters */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setMediaTypeFilter('all')}
                    className={`px-2.5 py-1 font-label text-[11px] font-bold uppercase border border-outline transition-all cursor-pointer ${
                      mediaTypeFilter === 'all' ? 'bg-primary text-on-primary shadow-[2px_2px_0px_#1a1a1a]' : 'bg-surface hover:bg-surface-variant text-on-surface'
                    }`}
                  >
                    All Types
                  </button>
                  <button
                    onClick={() => setMediaTypeFilter('movie')}
                    className={`px-2.5 py-1 font-label text-[11px] font-bold uppercase border border-outline transition-all cursor-pointer ${
                      mediaTypeFilter === 'movie' ? 'bg-secondary text-white shadow-[2px_2px_0px_#1a1a1a]' : 'bg-surface hover:bg-surface-variant text-on-surface'
                    }`}
                  >
                    Movies
                  </button>
                  <button
                    onClick={() => setMediaTypeFilter('tv')}
                    className={`px-2.5 py-1 font-label text-[11px] font-bold uppercase border border-outline transition-all cursor-pointer ${
                      mediaTypeFilter === 'tv' ? 'bg-tertiary text-white shadow-[2px_2px_0px_#1a1a1a]' : 'bg-surface hover:bg-surface-variant text-on-surface'
                    }`}
                  >
                    TV Shows
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Slider 1: Familiarity vs Radical Experimental */}
                <div>
                  <div className="flex justify-between items-center text-xs font-label uppercase font-bold text-on-surface mb-2">
                    <span>Dissonance Level</span>
                    <span className="text-secondary font-mono">{getDissonanceLabel(dissonanceLevel)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={dissonanceLevel}
                    onChange={(e) => setDissonanceLevel(Number(e.target.value))}
                    className="w-full h-3 bg-surface-variant border-2 border-outline accent-secondary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-label uppercase text-on-surface-variant mt-1.5 font-bold">
                    <span>Mild</span>
                    <span>Subtle</span>
                    <span>Lateral</span>
                    <span className="text-secondary">Avant-Garde</span>
                    <span>Chaos</span>
                  </div>
                </div>

                {/* Slider 2: Era Scope */}
                <div>
                  <div className="flex justify-between items-center text-xs font-label uppercase font-bold text-on-surface mb-2">
                    <span>Temporal Window</span>
                    <span className="text-tertiary font-mono">{getTemporalLabel(temporalWindow)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={temporalWindow}
                    onChange={(e) => setTemporalWindow(Number(e.target.value))}
                    className="w-full h-3 bg-surface-variant border-2 border-outline accent-tertiary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-label uppercase text-on-surface-variant mt-1.5 font-bold">
                    <span>Silent (20-59)</span>
                    <span>Wave (60-89)</span>
                    <span className="text-tertiary">Modern (90-17)</span>
                    <span>Current (2018+)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Bubble Radar, Streak & History (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Bubble Radar Widget */}
            <div className="bg-surface-container-lowest border-2 border-outline p-6 shadow-[5px_5px_0px_#1a1a1a]">
              <div className="flex items-center justify-between pb-3 border-b-2 border-outline">
                <span className="font-headline font-bold text-sm uppercase tracking-wider text-on-surface">
                  Bubble Penetration Radar
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-base">radar</span>
              </div>

              {/* Bauhaus Geometric Radar Chart */}
              <div className="relative w-full aspect-square flex items-center justify-center my-4 bg-surface-container-low border border-outline overflow-hidden">
                {/* Concentric Grid Circles */}
                <div className="absolute w-[80%] h-[80%] rounded-full border border-outline/20"></div>
                <div className="absolute w-[55%] h-[55%] rounded-full border border-outline/30"></div>
                <div className="absolute w-[30%] h-[30%] rounded-full border border-outline/40"></div>
                
                {/* Axis lines */}
                <div className="absolute inset-x-4 h-[1px] bg-outline/20"></div>
                <div className="absolute inset-y-4 w-[1px] bg-outline/20"></div>
                <div className="absolute inset-0 rotate-45 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-[1px] bg-outline/10"></div>
                </div>

                {/* Dynamic Polygon SVG */}
                <svg className="absolute inset-0 w-full h-full p-4 overflow-visible" viewBox="0 0 100 100">
                  {/* Regular User Orbit (faded dashed) */}
                  <polygon
                    points="50,22 74,45 68,78 30,72 26,42"
                    fill="none"
                    stroke="#1a1a1a"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    opacity="0.4"
                  />
                  {/* Current Pick Disruption Vector */}
                  <polygon
                    points={radarSvgPoints}
                    fill="#ffcc00"
                    fillOpacity="0.35"
                    stroke="#e63b2e"
                    strokeWidth="2.5"
                  />
                  {/* Focus nodes */}
                  {radarPoints.map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r={i === 0 ? 3.5 : 3}
                      fill={i === 0 ? '#e63b2e' : i === 1 ? '#0055ff' : '#1a1a1a'}
                      stroke="#1a1a1a"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>

                {/* Labels Around Radar */}
                <span className="absolute top-2 font-label text-[9px] font-bold uppercase bg-surface px-1 border border-outline">
                  {radarPoints[0]?.label || 'Pacing'}
                </span>
                <span className="absolute right-2 font-label text-[9px] font-bold uppercase bg-surface px-1 border border-outline">
                  {radarPoints[1]?.label || 'Origin'}
                </span>
                <span className="absolute bottom-2 font-label text-[9px] font-bold uppercase bg-surface px-1 border border-outline">
                  {radarPoints[2]?.label || 'Visual'}
                </span>
                <span className="absolute left-2 font-label text-[9px] font-bold uppercase bg-surface px-1 border border-outline">
                  {radarPoints[3]?.label || 'Tone'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-label">
                <span className="text-on-surface-variant uppercase font-semibold">Variance Delta</span>
                <span className="font-bold text-secondary tracking-widest">{specimen.varianceDelta}</span>
              </div>
            </div>

            {/* Session Streak & Stats */}
            <div className="bg-primary text-on-primary border-2 border-outline p-6 shadow-[5px_5px_0px_#1a1a1a]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-fixed">local_fire_department</span>
                  <span className="font-label text-xs uppercase font-bold tracking-wider">Serendipity Streak</span>
                </div>
                <span className="bg-primary-fixed text-on-primary-fixed font-headline font-bold text-sm px-2 py-0.5 border border-outline">
                  {streakCount} DISCOVERED
                </span>
              </div>
              <p className="font-body text-xs text-[#d6d1c9] mt-2 leading-relaxed">
                You have explored {streakCount} out-of-bubble recommendations in this session across worldwide cinema and television without repetition.
              </p>
              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between font-label text-xs">
                <span className="uppercase text-[#d6d1c9]">Library Horizon</span>
                <span className="font-bold text-primary-fixed">Infinite Stream</span>
              </div>
            </div>

            {/* Recent Serendipity History Track */}
            <div className="bg-surface-container-lowest border-2 border-outline p-6 shadow-[5px_5px_0px_#1a1a1a]">
              <div className="flex items-center justify-between pb-3 border-b-2 border-outline mb-4">
                <span className="font-headline font-bold text-sm uppercase tracking-wider text-on-surface">
                  Recent Bubble Breakers
                </span>
                <span className="font-mono text-xs text-on-surface-variant font-bold">[{String(history.length).padStart(2, '0')}]</span>
              </div>

              <div className="space-y-2.5 font-body max-h-[380px] overflow-y-auto pr-1">
                {history.map((item, idx) => {
                  const isActive = idx === currentIndex;
                  const itemDirector = (item.director || 'Cinema').split(' ').pop();
                  const itemGenre = (item.genre || 'Cinema').split('/')[0];
                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      onClick={() => setCurrentIndex(idx)}
                      className={`p-2.5 border-2 border-outline transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'bg-primary-fixed/30 shadow-[2px_2px_0px_#1a1a1a]'
                          : 'bg-surface-container hover:bg-surface-variant'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`font-mono font-bold text-xs px-1.5 py-0.5 border border-outline ${
                          isActive ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <div className="font-headline font-bold text-xs uppercase text-on-surface truncate">
                            {item.title}
                          </div>
                          <div className="font-label text-[10px] text-on-surface-variant truncate">
                            {itemDirector} • {item.year} • {itemGenre}
                          </div>
                        </div>
                      </div>
                      <span className={`font-label font-bold text-xs shrink-0 ml-2 ${
                        idx % 2 === 0 ? 'text-secondary' : 'text-tertiary'
                      }`}>
                        {item.tasteDelta}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Unlocked Horizons */}
              <div className="mt-6 pt-4 border-t-2 border-outline">
                <span className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                  Active Disruption Scope
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 bg-tertiary-container text-on-tertiary-container font-label text-[10px] font-bold uppercase border border-outline">
                    Worldwide Cinema
                  </span>
                  <span className="px-2 py-1 bg-secondary-container text-on-secondary-container font-label text-[10px] font-bold uppercase border border-outline">
                    Prestige TV Series
                  </span>
                  <span className="px-2 py-1 bg-surface-container-high text-on-surface font-label text-[10px] font-bold uppercase border border-outline">
                    Infinite Variety
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
