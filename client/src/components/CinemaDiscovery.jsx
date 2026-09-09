import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import MovieCard from './MovieCard';
import {
  Play,
  Star,
  Sparkles,
  Film,
  Tv,
  ArrowRight,
  SlidersHorizontal,
  Compass,
  Flame,
  Bookmark,
  Check,
  Layers,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

const SHOWCASE_ITEMS = [
  {
    id: 693134,
    mediaType: 'movie',
    title: 'Dune: Part Two',
    displayTitle: (
      <>
        DUNE<span className="text-primary-fixed">:</span> PART TWO
      </>
    ),
    year: '2024',
    runtime: '2h 46m',
    format: 'IMAX 70MM',
    archiveNo: 'Archive No. 0429',
    genre: 'Epic Sci-Fi Thriller',
    tagline: 'Long live the fighters.',
    rating: '8.8',
    sensoryMatch: '98% Match',
    sensoryLabel: 'Mind-Bending Spectrum',
    poster_path: 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    trailerKey: 'Way9Dexny3w',
    chapters: [
      { id: 1, number: '01', title: 'Prophecy Awakens', time: '00:00 - 00:52', startSec: 0 },
      { id: 2, number: '02', title: 'Shai-Hulud Trial', time: '00:53 - 01:45', startSec: 53 },
      { id: 3, number: '03', title: 'Giedi Prime Arena', time: '01:46 - 02:24', startSec: 106 },
      { id: 4, number: '04', title: 'Holy War Reckoning', time: '02:25 - 03:02', startSec: 145 },
    ]
  },
  {
    id: 1396,
    mediaType: 'tv',
    title: 'Breaking Bad',
    displayTitle: (
      <>
        BREAKING <span className="text-emerald-400">BAD</span>
      </>
    ),
    year: '2008-2013',
    runtime: '5 Seasons',
    format: '4K DOLBY VISION',
    archiveNo: 'Archive No. 1396',
    genre: 'Crime Drama Thriller',
    tagline: 'Remember my name.',
    rating: '8.9',
    sensoryMatch: '99% Match',
    sensoryLabel: 'High Moral Entropy',
    poster_path: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    trailerKey: 'HhesaQXLuRY',
    chapters: [
      { id: 1, number: '01', title: 'The Diagnosis', time: '00:00 - 00:45', startSec: 0 },
      { id: 2, number: '02', title: 'Desert RV Cook', time: '00:46 - 01:30', startSec: 46 },
      { id: 3, number: '03', title: 'Heisenberg Rises', time: '01:31 - 02:15', startSec: 91 },
      { id: 4, number: '04', title: 'Empire Fallen', time: '02:16 - 03:00', startSec: 136 },
    ]
  },
  {
    id: 157336,
    mediaType: 'movie',
    title: 'Interstellar',
    displayTitle: (
      <>
        INTER<span className="text-secondary">STELLAR</span>
      </>
    ),
    year: '2014',
    runtime: '2h 49m',
    format: 'IMAX 70MM 4K',
    archiveNo: 'Archive No. 0157',
    genre: 'Sci-Fi Cosmic Odyssey',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    rating: '8.7',
    sensoryMatch: '97% Match',
    sensoryLabel: 'Spacetime Dilatation',
    poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    trailerKey: 'zSWdZVtXT7E',
    chapters: [
      { id: 1, number: '01', title: 'Leaving Earth', time: '00:00 - 00:50', startSec: 0 },
      { id: 2, number: '02', title: 'Gargantua Singularity', time: '00:51 - 01:35', startSec: 51 },
      { id: 3, number: '03', title: "Miller's Tidal Wave", time: '01:36 - 02:20', startSec: 96 },
      { id: 4, number: '04', title: 'The Tesseract', time: '02:21 - 03:00', startSec: 141 },
    ]
  },
  {
    id: 60059,
    mediaType: 'tv',
    title: 'Better Call Saul',
    displayTitle: (
      <>
        BETTER CALL <span className="text-primary-fixed">SAUL</span>
      </>
    ),
    year: '2015-2022',
    runtime: '6 Seasons',
    format: '4K HDR MASTER',
    archiveNo: 'Archive No. 6005',
    genre: 'Legal Noir Tragedy',
    tagline: "It's all good, man.",
    rating: '8.7',
    sensoryMatch: '96% Match',
    sensoryLabel: 'Psychological Pacing',
    poster_path: 'https://image.tmdb.org/t/p/w500/zjg4jpK1Wp2kiRvtt5ND0kznako.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/rfxryDIv8huejujg4JueDJx8zCz.jpg',
    trailerKey: 'HN4oydykJFc',
    chapters: [
      { id: 1, number: '01', title: "Slippin' Jimmy", time: '00:00 - 00:44', startSec: 0 },
      { id: 2, number: '02', title: 'Davis & Main Pivot', time: '00:45 - 01:28', startSec: 45 },
      { id: 3, number: '03', title: 'Point and Shoot', time: '01:29 - 02:14', startSec: 89 },
      { id: 4, number: '04', title: 'Saul Gone', time: '02:15 - 02:58', startSec: 135 },
    ]
  },
  {
    id: 872585,
    mediaType: 'movie',
    title: 'Oppenheimer',
    displayTitle: (
      <>
        OPPEN<span className="text-secondary">HEIMER</span>
      </>
    ),
    year: '2023',
    runtime: '3h 00m',
    format: 'IMAX 70MM ORIGINAL',
    archiveNo: 'Archive No. 8725',
    genre: 'Historical Bio-Epic',
    tagline: 'The world forever changes.',
    rating: '8.6',
    sensoryMatch: '98% Match',
    sensoryLabel: 'Auditory Shockwave',
    poster_path: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    trailerKey: 'uYPbbksJxIg',
    chapters: [
      { id: 1, number: '01', title: 'Can You Hear Music', time: '00:00 - 00:48', startSec: 0 },
      { id: 2, number: '02', title: 'Los Alamos Grid', time: '00:49 - 01:32', startSec: 49 },
      { id: 3, number: '03', title: 'Trinity Countdown', time: '01:33 - 02:18', startSec: 93 },
      { id: 4, number: '04', title: 'Atmospheric Chain', time: '02:19 - 03:05', startSec: 139 },
    ]
  },
  {
    id: 66732,
    mediaType: 'tv',
    title: 'Stranger Things',
    displayTitle: (
      <>
        STRANGER <span className="text-tertiary">THINGS</span>
      </>
    ),
    year: '2016-2025',
    runtime: '4 Seasons',
    format: 'DOLBY ATMOS 4K',
    archiveNo: 'Archive No. 6673',
    genre: 'Supernatural Mystery',
    tagline: 'One summer can change everything.',
    rating: '8.6',
    sensoryMatch: '95% Match',
    sensoryLabel: 'Retro Synth Suspense',
    poster_path: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    trailerKey: 'b9EkMc79ZSU',
    chapters: [
      { id: 1, number: '01', title: 'The Vanishing', time: '00:00 - 00:42', startSec: 0 },
      { id: 2, number: '02', title: 'The Upside Down', time: '00:43 - 01:26', startSec: 43 },
      { id: 3, number: '03', title: 'Running Up That Hill', time: '01:27 - 02:12', startSec: 87 },
      { id: 4, number: '04', title: "Vecna's Curse", time: '02:13 - 02:56', startSec: 133 },
    ]
  }
];

// Curated Thematic Resonances dynamically mapped to whichever slide is currently active
const THEMATIC_RESONANCES = {
  693134: { // Dune: Part Two
    themeLabel: 'Cosmic Scale & Reality Architecture',
    curatorNote: 'Monumental cinema sharing Denis Villeneuve’s colossal visual architecture, desert mysticism, and transcendent world-building.',
    items: [
      {
        id: 603,
        title: 'The Matrix',
        year: '1999',
        media_type: 'movie',
        poster_path: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        vote_average: 8.2,
        matchPercentage: 98,
        resonance: 'Chosen One cyber-messianic awakening & reality distortion',
        genres: ['Action', 'Sci-Fi']
      },
      {
        id: 27205,
        title: 'Inception',
        year: '2010',
        media_type: 'movie',
        poster_path: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
        vote_average: 8.4,
        matchPercentage: 96,
        resonance: 'Architectural subconscious mindscape & visionary visual scale',
        genres: ['Action', 'Sci-Fi']
      },
      {
        id: 264660,
        title: 'Ex Machina',
        year: '2015',
        media_type: 'movie',
        poster_path: 'https://image.tmdb.org/t/p/w500/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg',
        vote_average: 7.6,
        matchPercentage: 94,
        resonance: 'Cold philosophical evolution, psychological chess & isolation',
        genres: ['Drama', 'Sci-Fi']
      },
      {
        id: 157336,
        title: 'Interstellar',
        year: '2014',
        media_type: 'movie',
        poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        vote_average: 8.7,
        matchPercentage: 97,
        resonance: 'Cosmic survival, gravitational singularities & Nolan grandeur',
        genres: ['Adventure', 'Sci-Fi']
      }
    ]
  },
  1396: { // Breaking Bad
    themeLabel: 'Moral Entropy & Antihero Dynasties',
    curatorNote: 'Masterworks tracing the devastating, irreversible decay of conscience and high-stakes underworld strategy.',
    items: [
      {
        id: 60059,
        title: 'Better Call Saul',
        year: '2015',
        media_type: 'tv',
        poster_path: 'https://image.tmdb.org/t/p/w500/zjg4jpK1Wp2kiRvtt5ND0kznako.jpg',
        vote_average: 8.7,
        matchPercentage: 99,
        resonance: 'Gilligan universe canon: tragic descent into legal corruption',
        genres: ['Crime', 'Drama']
      },
      {
        id: 60574,
        title: 'Peaky Blinders',
        year: '2013',
        media_type: 'tv',
        poster_path: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg',
        vote_average: 8.5,
        matchPercentage: 96,
        resonance: 'Relentless criminal mastermind ambition & post-war empire building',
        genres: ['Crime', 'Drama']
      },
      {
        id: 769,
        title: 'GoodFellas',
        year: '1990',
        media_type: 'movie',
        poster_path: 'https://image.tmdb.org/t/p/w500/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg',
        vote_average: 8.5,
        matchPercentage: 95,
        resonance: 'Classic mob underworld rise and chaotic, adrenaline-fueled collapse',
        genres: ['Drama', 'Crime']
      },
      {
        id: 550,
        title: 'Fight Club',
        year: '1999',
        media_type: 'movie',
        poster_path: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        vote_average: 8.4,
        matchPercentage: 93,
        resonance: 'Psychological alter-ego anarchy & complete societal subversion',
        genres: ['Drama']
      }
    ]
  },
  157336: { // Interstellar
    themeLabel: 'Relativistic Astrophysics & Subconscious Space',
    curatorNote: 'Odysseys that probe deep-space loneliness, time dilation mechanics, and human emotion across multidimensional space.',
    items: [
      {
        id: 27205,
        title: 'Inception',
        year: '2010',
        media_type: 'movie',
        poster_path: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
        vote_average: 8.4,
        matchPercentage: 98,
        resonance: 'Nolan architectural maze of dream time dilation and grief',
        genres: ['Action', 'Sci-Fi']
      },
      {
        id: 603,
        title: 'The Matrix',
        year: '1999',
        media_type: 'movie',
        poster_path: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        vote_average: 8.2,
        matchPercentage: 95,
        resonance: 'Questioning physical fabric of reality & transcending dimensions',
        genres: ['Action', 'Sci-Fi']
      },
      {
        id: 264660,
        title: 'Ex Machina',
        year: '2015',
        media_type: 'movie',
        poster_path: 'https://image.tmdb.org/t/p/w500/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg',
        vote_average: 7.6,
        matchPercentage: 94,
        resonance: 'Isolated high-tech facility testing the boundaries of synthetic soul',
        genres: ['Drama', 'Sci-Fi']
      },
      {
        id: 70523,
        title: 'Dark',
        year: '2017',
        media_type: 'tv',
        poster_path: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg',
        vote_average: 8.4,
        matchPercentage: 93,
        resonance: 'Relativistic paradoxes, knot of time & intergenerational destiny',
        genres: ['Sci-Fi', 'Mystery']
      }
    ]
  },
  60059: { // Better Call Saul
    themeLabel: 'Legal Subversion & Corporate Warfare',
    curatorNote: 'Scintillating character portraits dissecting systemic loopholes, moral compromise, and poignant brotherhood bonds.',
    items: [
      {
        id: 1396,
        title: 'Breaking Bad',
        year: '2008',
        media_type: 'tv',
        poster_path: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
        vote_average: 8.9,
        matchPercentage: 99,
        resonance: 'The companion titan and ultimate destiny of Jimmy McGill',
        genres: ['Crime', 'Thriller']
      },
      {
        id: 76331,
        title: 'Succession',
        year: '2018',
        media_type: 'tv',
        poster_path: 'https://image.tmdb.org/t/p/w500/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg',
        vote_average: 8.3,
        matchPercentage: 97,
        resonance: 'Corporate Machiavellian savagery and biting family dysfunction',
        genres: ['Drama']
      },
      {
        id: 60574,
        title: 'Peaky Blinders',
        year: '2013',
        media_type: 'tv',
        poster_path: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg',
        vote_average: 8.5,
        matchPercentage: 95,
        resonance: 'Calculating legal, political, and underworld leverage maneuvers',
        genres: ['Crime', 'Drama']
      },
      {
        id: 807,
        title: 'Se7en',
        year: '1995',
        media_type: 'movie',
        poster_path: 'https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg',
        vote_average: 8.4,
        matchPercentage: 93,
        resonance: 'Grim moral decay and psychological trap investigations',
        genres: ['Crime', 'Mystery']
      }
    ]
  },
  872585: { // Oppenheimer
    themeLabel: 'Atomic Dread & The Weight of Consequence',
    curatorNote: 'High-tension dramas confronting the harrowing psychological cost of genius and civilization-altering inventions.',
    items: [
      {
        id: 87108,
        title: 'Chernobyl',
        year: '2019',
        media_type: 'tv',
        poster_path: 'https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg',
        vote_average: 8.7,
        matchPercentage: 99,
        resonance: 'The catastrophic human cost of state denial and radiation fallout',
        genres: ['Drama', 'History']
      },
      {
        id: 1124,
        title: 'The Prestige',
        year: '2006',
        media_type: 'movie',
        poster_path: 'https://image.tmdb.org/t/p/w500/rOa94QOq3wbqKBHjSqL0WtPPJm1.jpg',
        vote_average: 8.2,
        matchPercentage: 96,
        resonance: 'Obsessive scientific rivalry, Tesla apparatus, and mutual destruction',
        genres: ['Drama', 'Mystery']
      },
      {
        id: 155,
        title: 'The Dark Knight',
        year: '2008',
        media_type: 'movie',
        poster_path: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        vote_average: 8.5,
        matchPercentage: 95,
        resonance: 'Nolan peak study on ideological terror and unyielding moral choices',
        genres: ['Action', 'Crime']
      },
      {
        id: 49026,
        title: 'The Dark Knight Rises',
        year: '2012',
        media_type: 'movie',
        poster_path: 'https://image.tmdb.org/t/p/w500/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg',
        vote_average: 7.8,
        matchPercentage: 92,
        resonance: 'Ticking-clock nuclear threat and city held under existential siege',
        genres: ['Action', 'Thriller']
      }
    ]
  },
  66732: { // Stranger Things
    themeLabel: 'Retro Analog Mystery & Shadow Realms',
    curatorNote: 'Atmospheric thriller narratives fusing 1980s synth suspense, clandestine government experiments, and occult portals.',
    items: [
      {
        id: 70523,
        title: 'Dark',
        year: '2017',
        media_type: 'tv',
        poster_path: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg',
        vote_average: 8.4,
        matchPercentage: 98,
        resonance: 'Missing boys, interconnected time caves, and multi-era dread',
        genres: ['Sci-Fi', 'Mystery']
      },
      {
        id: 115036,
        title: 'Severance',
        year: '2022',
        media_type: 'tv',
        poster_path: 'https://image.tmdb.org/t/p/w500/fAzHg1AB7ZleOnnxip85DNu165d.jpg',
        vote_average: 8.4,
        matchPercentage: 94,
        resonance: 'Sterile corporate secrecy, partitioned memory, and claustrophobia',
        genres: ['Sci-Fi', 'Thriller']
      },
      {
        id: 94605,
        title: 'Arcane',
        year: '2021',
        media_type: 'tv',
        poster_path: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
        vote_average: 8.7,
        matchPercentage: 95,
        resonance: 'Electrifying visual artistry, sister bonds, and hextech conflicts',
        genres: ['Animation', 'Sci-Fi']
      },
      {
        id: 76479,
        title: 'The Boys',
        year: '2019',
        media_type: 'tv',
        poster_path: 'https://image.tmdb.org/t/p/w500/in1R2dDc421JxsoRWaIIAqVI2KE.jpg',
        vote_average: 8.5,
        matchPercentage: 92,
        resonance: 'Raw anti-establishment grit and corporate superpower conspiracies',
        genres: ['Action', 'Sci-Fi']
      }
    ]
  }
};

// Foundational Curated Cinema Archive
const CURATED_ARCHIVE_ITEMS = [
  {
    id: 693134,
    title: 'Dune: Part Two',
    year: '2024',
    media_type: 'movie',
    poster_path: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    vote_average: 8.8,
    matchPercentage: 98,
    cognitive_tension: '92%',
    genres: ['Sci-Fi', 'Adventure'],
    genreCategory: 'sci-fi',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.'
  },
  {
    id: 1396,
    title: 'Breaking Bad',
    year: '2008',
    media_type: 'tv',
    poster_path: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    vote_average: 8.9,
    matchPercentage: 99,
    cognitive_tension: '95%',
    genres: ['Crime', 'Drama'],
    genreCategory: 'crime',
    synopsis: 'A chemistry teacher diagnosed with terminal lung cancer teams up with a former student to manufacture crystal meth.'
  },
  {
    id: 157336,
    title: 'Interstellar',
    year: '2014',
    media_type: 'movie',
    poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    vote_average: 8.7,
    matchPercentage: 97,
    cognitive_tension: '88%',
    genres: ['Sci-Fi', 'Drama'],
    genreCategory: 'sci-fi',
    synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.'
  },
  {
    id: 60059,
    title: 'Better Call Saul',
    year: '2015',
    media_type: 'tv',
    poster_path: 'https://image.tmdb.org/t/p/w500/zjg4jpK1Wp2kiRvtt5ND0kznako.jpg',
    vote_average: 8.7,
    matchPercentage: 96,
    cognitive_tension: '90%',
    genres: ['Crime', 'Drama'],
    genreCategory: 'crime',
    synopsis: 'The trials and tribulations of criminal lawyer Jimmy McGill before he established his strip-mall law office in Albuquerque.'
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    year: '2023',
    media_type: 'movie',
    poster_path: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    vote_average: 8.6,
    matchPercentage: 98,
    cognitive_tension: '94%',
    genres: ['Biography', 'Drama'],
    genreCategory: 'drama',
    synopsis: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II.'
  },
  {
    id: 66732,
    title: 'Stranger Things',
    year: '2016',
    media_type: 'tv',
    poster_path: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    vote_average: 8.6,
    matchPercentage: 95,
    cognitive_tension: '87%',
    genres: ['Sci-Fi', 'Mystery'],
    genreCategory: 'sci-fi',
    synopsis: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments and supernatural forces.'
  },
  {
    id: 603,
    title: 'The Matrix',
    year: '1999',
    media_type: 'movie',
    poster_path: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    vote_average: 8.2,
    matchPercentage: 97,
    cognitive_tension: '91%',
    genres: ['Action', 'Sci-Fi'],
    genreCategory: 'sci-fi',
    synopsis: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.'
  },
  {
    id: 27205,
    title: 'Inception',
    year: '2010',
    media_type: 'movie',
    poster_path: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
    vote_average: 8.4,
    matchPercentage: 98,
    cognitive_tension: '96%',
    genres: ['Sci-Fi', 'Action'],
    genreCategory: 'mind-bending',
    synopsis: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.'
  },
  {
    id: 155,
    title: 'The Dark Knight',
    year: '2008',
    media_type: 'movie',
    poster_path: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    vote_average: 8.5,
    matchPercentage: 96,
    cognitive_tension: '93%',
    genres: ['Action', 'Crime'],
    genreCategory: 'crime',
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest tests.'
  },
  {
    id: 87108,
    title: 'Chernobyl',
    year: '2019',
    media_type: 'tv',
    poster_path: 'https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg',
    vote_average: 8.9,
    matchPercentage: 99,
    cognitive_tension: '98%',
    genres: ['Drama', 'History'],
    genreCategory: 'drama',
    synopsis: 'A dramatization of the April 1986 Chernobyl nuclear disaster and the unprecedented cleanup efforts that followed.'
  },
  {
    id: 70523,
    title: 'Dark',
    year: '2017',
    media_type: 'tv',
    poster_path: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg',
    vote_average: 8.5,
    matchPercentage: 97,
    cognitive_tension: '97%',
    genres: ['Mystery', 'Sci-Fi'],
    genreCategory: 'mind-bending',
    synopsis: 'A family saga with a supernatural twist set in a German town where the disappearance of two young children exposes relationships.'
  },
  {
    id: 115036,
    title: 'Severance',
    year: '2022',
    media_type: 'tv',
    poster_path: 'https://image.tmdb.org/t/p/w500/fAzHg1AB7ZleOnnxip85DNu165d.jpg',
    vote_average: 8.4,
    matchPercentage: 94,
    cognitive_tension: '95%',
    genres: ['Sci-Fi', 'Thriller'],
    genreCategory: 'mind-bending',
    synopsis: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.'
  },
  {
    id: 60574,
    title: 'Peaky Blinders',
    year: '2013',
    media_type: 'tv',
    poster_path: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg',
    vote_average: 8.5,
    matchPercentage: 96,
    cognitive_tension: '90%',
    genres: ['Crime', 'Drama'],
    genreCategory: 'crime',
    synopsis: 'A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps.'
  },
  {
    id: 264660,
    title: 'Ex Machina',
    year: '2015',
    media_type: 'movie',
    poster_path: 'https://image.tmdb.org/t/p/w500/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg',
    vote_average: 7.6,
    matchPercentage: 94,
    cognitive_tension: '89%',
    genres: ['Sci-Fi', 'Drama'],
    genreCategory: 'sci-fi',
    synopsis: 'A programmer is invited by his CEO to administer the Turing test to an intelligent humanoid robot.'
  },
  {
    id: 94605,
    title: 'Arcane',
    year: '2021',
    media_type: 'tv',
    poster_path: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
    vote_average: 8.7,
    matchPercentage: 95,
    cognitive_tension: '91%',
    genres: ['Animation', 'Action'],
    genreCategory: 'sci-fi',
    synopsis: 'Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic champions.'
  },
  {
    id: 76331,
    title: 'Succession',
    year: '2018',
    media_type: 'tv',
    poster_path: 'https://image.tmdb.org/t/p/w500/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg',
    vote_average: 8.6,
    matchPercentage: 94,
    cognitive_tension: '92%',
    genres: ['Drama'],
    genreCategory: 'drama',
    synopsis: 'The Roy family is known for controlling the biggest media and entertainment company in the world.'
  }
];

function getGenreCategory(item) {
  if (item.genreCategory) return item.genreCategory;
  const genreIds = item.genre_ids || [];
  const genreNames = (item.genres || []).map(g => (typeof g === 'string' ? g : g.name || '').toLowerCase());
  
  if (genreIds.includes(878) || genreNames.some(n => n.includes('sci-fi') || n.includes('science fiction'))) {
    return 'sci-fi';
  }
  if (genreIds.includes(80) || genreNames.some(n => n.includes('crime') || n.includes('noir'))) {
    return 'crime';
  }
  if (genreIds.includes(18) || genreNames.some(n => n.includes('drama') || n.includes('biography') || n.includes('history'))) {
    return 'drama';
  }
  if (genreIds.includes(9648) || genreIds.includes(53) || genreNames.some(n => n.includes('mystery') || n.includes('thriller'))) {
    return 'mind-bending';
  }
  return 'drama';
}

export default function CinemaDiscovery({
  onSelectMovie,
  onPlayTrailer,
  movies = [],
  loading = false,
  onOpenSurprise,
}) {
  const { isMovieInWatchlist, toggleWatchlist } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [activeChapter, setActiveChapter] = useState(1);
  const [isLogged, setIsLogged] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Filter & discovery state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [sortBy, setSortBy] = useState('curated');

  const activeMovie = SHOWCASE_ITEMS[currentIndex];
  const inWatchlist = isMovieInWatchlist(activeMovie.id);

  // Blend API movies and foundational archive items without duplicates
  const combinedItems = useMemo(() => {
    const map = new Map();
    CURATED_ARCHIVE_ITEMS.forEach(item => map.set(item.id, item));
    if (Array.isArray(movies) && movies.length > 0) {
      movies.forEach(m => {
        if (!m || !m.id) return;
        if (!map.has(m.id)) {
          const poster = m.poster_path
            ? (m.poster_path.startsWith('http') ? m.poster_path : `https://image.tmdb.org/t/p/w500${m.poster_path}`)
            : null;
          map.set(m.id, {
            ...m,
            poster_path: poster,
            title: m.title || m.name || 'Untitled Specimen',
            media_type: m.media_type || (m.first_air_date ? 'tv' : 'movie'),
            year: (m.release_date || m.first_air_date || '').slice(0, 4) || '2024',
            genreCategory: getGenreCategory(m),
            matchPercentage: Math.min(99, Math.max(88, Math.round((m.vote_average || 7.5) * 10) + 4)),
            cognitive_tension: `${Math.floor(Math.random() * 15) + 84}%`,
            synopsis: m.overview || 'Archival synopsis classified under protocol guidelines.'
          });
        }
      });
    }
    return Array.from(map.values());
  }, [movies]);

  // Apply active category, format, and sorting filters
  const filteredItems = useMemo(() => {
    return combinedItems
      .filter(item => {
        if (selectedFormat !== 'all') {
          if (selectedFormat === 'movie' && item.media_type === 'tv') return false;
          if (selectedFormat === 'tv' && item.media_type !== 'tv') return false;
        }
        if (selectedCategory !== 'all') {
          const cat = item.genreCategory || getGenreCategory(item);
          if (cat !== selectedCategory) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.vote_average || 0) - (a.vote_average || 0);
        if (sortBy === 'year') return String(b.year || '').localeCompare(String(a.year || ''));
        return 0;
      });
  }, [combinedItems, selectedCategory, selectedFormat, sortBy]);

  const activeResonances = THEMATIC_RESONANCES[activeMovie.id] || THEMATIC_RESONANCES[693134];

  // Auto-advance slideshow timer: 12 seconds per slide (fulfilling 10 to 15s requirement)
  useEffect(() => {
    if (isPlayingTrailer) return;

    const timer = setInterval(() => {
      handleNext();
    }, 12000);

    return () => clearInterval(timer);
  }, [currentIndex, isPlayingTrailer]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
    setIsPlayingTrailer(false);
    setActiveChapter(1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length);
    setIsPlayingTrailer(false);
    setActiveChapter(1);
  };

  const handleSelectSlide = (idx) => {
    if (idx === currentIndex) return;
    setCurrentIndex(idx);
    setIsPlayingTrailer(false);
    setActiveChapter(1);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="w-full flex flex-col bg-background text-on-surface">
      {/* Cinematic Hero Stage (Slideshow Header) */}
      <section className="relative w-full overflow-hidden bg-primary text-on-primary border-b-2 border-outline min-h-[580px] lg:min-h-[640px] flex flex-col justify-end">
        {/* Backdrop Media with smooth crossfade and guaranteed fallback */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-primary">
          <img
            key={`hero_bg_${activeMovie.id}`}
            src={activeMovie.backdrop}
            alt={activeMovie.title}
            className="w-full h-full object-cover object-center opacity-45 scale-105 transition-all duration-700 animate-fade-in"
            loading="eager"
            onError={(e) => {
              e.target.src = 'https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>

          {/* Subtle Decorative Bauhaus Geometric Grid Overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="bauhaus-grid-hero" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M 64 0 L 0 0 0 64" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
                <circle cx="32" cy="32" r="1.5" fill="currentColor"></circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bauhaus-grid-hero)"></rect>
          </svg>
        </div>

        {/* Top Slide Navigation Bar */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 lg:px-12 pt-6 mb-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Slide Indicator & Title Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {SHOWCASE_ITEMS.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectSlide(idx)}
                  className={`relative px-3 py-1.5 font-label text-xs uppercase font-bold border transition-all flex items-center gap-2 whitespace-nowrap overflow-hidden ${
                    isActive
                      ? 'bg-primary-fixed text-on-primary-fixed border-outline shadow-[2px_2px_0px_#1a1a1a] scale-105'
                      : 'bg-primary/70 text-white/80 hover:text-white hover:bg-primary border-white/20'
                  }`}
                >
                  <span className={isActive ? 'text-on-primary-fixed' : 'text-secondary'}>
                    0{idx + 1}
                  </span>
                  <span>{item.title}</span>
                  {item.mediaType === 'tv' && (
                    <span className="text-[9px] px-1 bg-secondary text-white font-mono">SERIES</span>
                  )}
                  {/* 12s Visual Countdown Progress Bar on active chip */}
                  {isActive && !isPlayingTrailer && (
                    <span
                      key={`timer_bar_${currentIndex}`}
                      className="absolute bottom-0 left-0 h-[3px] bg-secondary animate-slide-progress"
                      style={{ animationDuration: '12s' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Slide Controls & Carousel Status */}
          <div className="flex items-center gap-3">
            <span className="font-label text-xs uppercase font-bold text-white/80 hidden md:inline-flex items-center gap-2">
              <span>{currentIndex + 1} of {SHOWCASE_ITEMS.length} Features</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] hover:bg-primary hover:text-white transition-all active:scale-90"
                title="Previous Featured Specimen"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] hover:bg-primary hover:text-white transition-all active:scale-90"
                title="Next Featured Specimen"
              >
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Content Body */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-20 lg:pb-28 flex flex-col justify-end w-full">
          {/* Breadcrumb Meta Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-5 font-label text-xs uppercase tracking-widest text-[#e2ddd4]">
            <span className="px-2.5 py-1 bg-primary-fixed text-on-primary-fixed font-bold border border-outline shadow-sm">
              {activeMovie.archiveNo}
            </span>
            <span className="text-secondary font-bold">•</span>
            <span className="font-semibold">{activeMovie.genre}</span>
            <span className="text-secondary font-bold">•</span>
            <span className="font-bold">{activeMovie.year}</span>
            <span className="text-secondary font-bold">•</span>
            <span>{activeMovie.runtime}</span>
            <span className="px-2 py-0.5 bg-surface-container-high text-on-surface font-bold text-[10px] border border-outline">
              {activeMovie.format}
            </span>
          </div>

          {/* Giant Geometric Title & Tagline */}
          <div className="flex flex-col mb-8" key={`title_${activeMovie.id}`}>
            <h1 className="font-headline font-black text-5xl sm:text-7xl lg:text-9xl uppercase tracking-tighter leading-none text-white select-none transition-all duration-300">
              {activeMovie.displayTitle}
            </h1>
            <p className="font-headline italic font-bold text-xl sm:text-2xl text-secondary mt-3 tracking-wide flex items-center gap-3">
              <span className="inline-block w-8 h-1 bg-secondary"></span>
              "{activeMovie.tagline}"
            </p>
          </div>

          {/* Rating & Metrics Ribbons */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {/* TMDB Score Card */}
            <div className="flex items-center gap-2.5 bg-surface-container-lowest text-on-surface px-4 py-2 border-2 border-outline shadow-[3px_3px_0px_#1a1a1a]">
              <span className="material-symbols-outlined text-primary-fixed fill-current text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-headline font-bold text-base tracking-tight text-on-surface">
                  {activeMovie.rating}<span className="text-xs font-normal text-on-surface-variant">/10</span>
                </span>
                <span className="font-label text-[9px] uppercase font-bold text-on-surface-variant tracking-wider">
                  TMDB Global
                </span>
              </div>
            </div>

            {/* Sensory Match Tag */}
            <div className="flex items-center gap-2.5 bg-tertiary text-white px-4 py-2 border-2 border-outline shadow-[3px_3px_0px_#1a1a1a]">
              <span className="material-symbols-outlined text-lg">neurology</span>
              <div className="flex flex-col leading-tight">
                <span className="font-headline font-bold text-base tracking-tight">{activeMovie.sensoryMatch}</span>
                <span className="font-label text-[9px] uppercase font-bold tracking-widest opacity-80">{activeMovie.sensoryLabel}</span>
              </div>
            </div>

            {/* Sound Certification */}
            <div className="hidden sm:flex items-center gap-2 bg-surface-container-high text-on-surface px-3.5 py-2 border-2 border-outline">
              <span className="material-symbols-outlined text-lg">graphic_eq</span>
              <span className="font-label text-xs font-bold tracking-wide uppercase">Dolby Atmos Spatial</span>
            </div>
          </div>

          {/* Action Buttons Matrix */}
          <div className="flex flex-wrap items-center gap-3.5">
            {/* Main Trailer Pill */}
            <button
              onClick={() => setIsPlayingTrailer(!isPlayingTrailer)}
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-tertiary text-white font-label font-bold text-sm tracking-wider uppercase border-2 border-outline shadow-[4px_4px_0px_#1a1a1a] hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPlayingTrailer ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPlayingTrailer ? 'Pause Trailer' : 'Play Official Trailer'}</span>
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            </button>

            {/* Add to Watchlist */}
            <button
              onClick={() => toggleWatchlist({
                id: activeMovie.id,
                movieId: activeMovie.id,
                title: activeMovie.title,
                poster_path: activeMovie.poster_path,
                backdrop_path: activeMovie.backdrop,
                vote_average: parseFloat(activeMovie.rating) || 8.8,
                year: activeMovie.year,
                genre: activeMovie.genre,
                genres: [activeMovie.genre],
                runtime: activeMovie.runtime,
                media_type: activeMovie.mediaType || 'movie'
              })}
              className={`flex items-center gap-2.5 px-6 py-4 rounded-full font-label font-bold text-xs uppercase tracking-wider border-2 border-outline shadow-[3px_3px_0px_#1a1a1a] active:scale-95 transition-all ${
                inWatchlist ? 'bg-secondary text-white' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {inWatchlist ? 'bookmark_added' : 'bookmark_add'}
              </span>
              <span>{inWatchlist ? 'In Vault' : 'Watchlist'}</span>
            </button>

            {/* Log / Watched Pill */}
            <button
              onClick={() => setIsLogged(!isLogged)}
              className={`flex items-center gap-2.5 px-6 py-4 rounded-full font-label font-bold text-xs uppercase tracking-wider border-2 border-outline shadow-[3px_3px_0px_#1a1a1a] active:scale-95 transition-all ${
                isLogged ? 'bg-emerald-400 text-on-primary-fixed' : 'bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isLogged ? 'task_alt' : 'visibility'}
              </span>
              <span>{isLogged ? 'Logged' : 'Mark Logged'}</span>
            </button>

            {/* Share Pill */}
            <button
              onClick={handleShare}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest active:scale-90 transition-all border-2 border-outline shadow-[3px_3px_0px_#1a1a1a]"
              title="Share movie profile"
            >
              <span className="material-symbols-outlined text-xl">
                {copySuccess ? 'check' : 'share'}
              </span>
            </button>

            {/* View Full Dossier */}
            <button
              onClick={() => onSelectMovie && onSelectMovie(activeMovie.id)}
              className="flex items-center gap-2 px-6 py-4 rounded-full bg-surface-container-lowest text-on-surface font-label font-bold text-xs uppercase tracking-wider border-2 border-outline shadow-[3px_3px_0px_#1a1a1a] hover:bg-primary hover:text-white transition-all ml-auto"
            >
              <span>Full Dossier</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Trailer Dock & Master Canvas (Synchronized with Active Slide) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 -mt-10 lg:-mt-14 relative z-20 w-full mb-16">
        <div className="bg-surface-container-lowest border-2 border-outline shadow-[6px_6px_0px_#1a1a1a] overflow-hidden">
          {/* Player Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-surface-container-high text-on-surface font-label text-xs uppercase tracking-widest font-bold border-b-2 border-outline">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-secondary inline-block border border-outline"></span>
              <span>Cinema Deck 4K HDR • {activeMovie.title} Chapter Stream</span>
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-secondary">wifi_tethering</span>
                LIVE BITRATE 38.4 Mbps
              </span>
              <span className="hidden md:inline-block">ASPECT: 1.43:1 EXPANDED</span>
            </div>
          </div>

          {/* Trailer Player / Video Canvas */}
          <div className="relative w-full aspect-video bg-primary overflow-hidden flex items-center justify-center group" id="video-canvas">
            {isPlayingTrailer ? (
              <iframe
                key={`${activeMovie.id}_${activeChapter}`}
                src={`https://www.youtube-nocookie.com/embed/${activeMovie.trailerKey}?autoplay=1&rel=0&modestbranding=1&start=${activeMovie.chapters[activeChapter - 1]?.startSec || 0}`}
                title={`${activeMovie.title} Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  key={`canvas_bg_${activeMovie.id}`}
                  src={activeMovie.backdrop}
                  alt={activeMovie.title}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 animate-fade-in"
                  loading="eager"
                  onError={(e) => {
                    e.target.src = 'https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/40"></div>

                {/* Big Center Pulsing Play Trigger */}
                <div
                  onClick={() => setIsPlayingTrailer(true)}
                  className="relative z-10 flex flex-col items-center gap-3 cursor-pointer transition-transform duration-300 group-hover:scale-110"
                >
                  <div className="w-20 h-20 rounded-full bg-tertiary text-white flex items-center justify-center border-2 border-outline shadow-[4px_4px_0px_#1a1a1a]">
                    <span className="material-symbols-outlined text-4xl ml-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                      play_arrow
                    </span>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-primary/90 text-white font-label text-xs tracking-wider uppercase font-bold border border-outline">
                    Watch {activeMovie.title} Trailer (Full 4K)
                  </span>
                </div>

                {/* On-Screen HUD Overlay Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2 z-10 bg-gradient-to-t from-primary to-transparent">
                  <div className="w-full bg-surface-container-high/60 h-2 overflow-hidden flex cursor-pointer border border-outline">
                    <div className="bg-secondary w-2/5 h-full transition-all"></div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-white font-label">
                    <div className="flex items-center gap-3">
                      <span className="font-bold">01:14</span>
                      <span className="text-[#a8a49c]">/</span>
                      <span className="text-[#a8a49c]">03:02</span>
                      <span className="bg-secondary px-2 py-0.5 text-[10px] font-bold text-white ml-2 border border-outline">
                        CH. 0{activeChapter} {activeMovie.chapters[activeChapter - 1]?.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-base cursor-pointer hover:text-primary-fixed">volume_up</span>
                      <span className="material-symbols-outlined text-base cursor-pointer hover:text-primary-fixed">closed_caption</span>
                      <span className="material-symbols-outlined text-base cursor-pointer hover:text-primary-fixed">fullscreen</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Synchronized Trailer Chapter Bookmarks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-surface-container-low font-label text-xs border-t-2 border-outline">
            {activeMovie.chapters.map((ch) => {
              const isActive = ch.id === activeChapter;
              return (
                <button
                  key={`${activeMovie.id}_ch_${ch.id}`}
                  onClick={() => {
                    setActiveChapter(ch.id);
                    setIsPlayingTrailer(true);
                  }}
                  className={`flex items-center gap-3 p-3 border-2 border-outline transition-all text-left ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-[2px_2px_0px_#1a1a1a]'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-bright shadow-sm'
                  }`}
                >
                  <span className={`font-headline font-black text-base ${isActive ? 'text-primary-fixed' : 'text-secondary'}`}>
                    {ch.number}
                  </span>
                  <div>
                    <div className="font-bold uppercase tracking-tight truncate">{ch.title}</div>
                    <div className={`text-[10px] ${isActive ? 'text-[#d6d1c9]' : 'text-on-surface-variant'}`}>
                      {ch.time}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 1. DYNAMIC THEMATIC RESONANCES // TIED TO ACTIVE HERO SLIDE */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-6">
        <div className="bg-surface-container-lowest border-2 border-outline shadow-[6px_6px_0px_#1a1a1a] p-6 lg:p-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b-2 border-outline">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-white font-label text-[11px] font-bold uppercase tracking-wider border border-outline shadow-sm mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DYNAMIC THEMATIC RESONANCES // SYNCHRONIZED ARCHIVE</span>
              </div>
              <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-on-surface">
                Resonating With <span className="text-secondary">{activeMovie.title}</span>
              </h2>
              <p className="text-xs sm:text-sm font-label text-on-surface-variant uppercase mt-1 tracking-wide">
                <span className="font-bold text-on-surface">THEMATIC VECTOR:</span> {activeResonances.themeLabel}
              </p>
            </div>

            <div className="max-w-md text-xs font-body text-on-surface-variant italic bg-surface-container-high/40 p-3 border-l-4 border-secondary">
              "{activeResonances.curatorNote}"
            </div>
          </div>

          {/* Resonance Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
            {activeResonances.items.map((resItem, idx) => {
              const inItemWatchlist = isMovieInWatchlist(resItem.id);
              return (
                <div
                  key={resItem.id}
                  className="group relative bg-surface-container-low border-2 border-outline shadow-[4px_4px_0px_#1a1a1a] hover:shadow-[6px_6px_0px_#1a1a1a] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col overflow-hidden text-on-surface"
                >
                  {/* Card Header Strip */}
                  <div className="flex items-center justify-between px-3 py-1.5 bg-surface-variant border-b-2 border-outline font-label text-[10px] uppercase font-bold">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-secondary border border-outline"></span>
                      <span>RES-0{idx + 1} // {resItem.media_type === 'tv' ? 'SERIES' : 'CINEMA'}</span>
                    </span>
                    <span className="text-secondary font-headline font-black">
                      {resItem.matchPercentage}% MATCH
                    </span>
                  </div>

                  {/* Poster Thumbnail */}
                  <div
                    className="relative aspect-[16/10] w-full overflow-hidden bg-primary cursor-pointer border-b-2 border-outline"
                    onClick={() => {
                      onSelectMovie && onSelectMovie(resItem.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <img
                      src={resItem.poster_path}
                      alt={resItem.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>

                    {/* Floating Rating */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-surface-container-lowest text-on-surface border border-outline font-headline font-bold text-xs shadow-[2px_2px_0px_#1a1a1a]">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{resItem.vote_average.toFixed(1)}</span>
                    </div>

                    {/* Watchlist Quick Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist({
                          id: resItem.id,
                          title: resItem.title,
                          poster_path: resItem.poster_path,
                          vote_average: resItem.vote_average,
                          media_type: resItem.media_type
                        });
                      }}
                      className={`absolute top-2 right-2 p-1.5 border border-outline shadow-[2px_2px_0px_#1a1a1a] transition-colors ${
                        inItemWatchlist
                          ? 'bg-secondary text-white'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-white'
                      }`}
                      title={inItemWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${inItemWatchlist ? 'fill-current' : ''}`} />
                    </button>

                    {/* Quick Trailer Play Overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayTrailer ? onPlayTrailer(resItem.id) : onSelectMovie(resItem.id);
                      }}
                      className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center border border-outline shadow-[2px_2px_0px_#1a1a1a] opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all"
                      title="Play Trailer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 flex flex-col justify-between flex-1 bg-surface-container-lowest">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          onClick={() => {
                            onSelectMovie && onSelectMovie(resItem.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="font-headline font-bold text-sm uppercase tracking-tight text-on-surface truncate cursor-pointer hover:text-secondary transition-colors"
                        >
                          {resItem.title}
                        </h4>
                        <span className="font-label text-[10px] text-on-surface-variant font-bold">
                          {resItem.year}
                        </span>
                      </div>

                      {/* Curator Rationale Quote */}
                      <p className="font-body text-[11px] text-on-surface-variant line-clamp-2 mt-2 leading-relaxed italic border-l-2 border-outline pl-2">
                        {resItem.resonance}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-3 pt-2.5 border-t border-outline/30 flex items-center justify-between gap-2 font-label">
                      <div className="flex gap-1">
                        {resItem.genres.slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="px-1.5 py-0.5 bg-surface-container text-on-surface-variant text-[9px] font-bold uppercase border border-outline/50"
                          >
                            {g}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          onSelectMovie && onSelectMovie(resItem.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-primary hover:text-secondary transition-colors font-headline"
                      >
                        <span>DOSSIER</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. CURATED CINEMA ARCHIVE // REAL-TIME TRANSMISSIONS GRID */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="flex flex-col gap-6">
          {/* Section Header with Bauhaus Geometry */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b-2 border-outline">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high text-on-surface text-xs font-label uppercase font-bold tracking-widest border border-outline">
                <Layers className="w-3.5 h-3.5 text-secondary" />
                <span>CURATION ARCHIVE // REAL-TIME DISCOVERY GRID</span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-on-surface leading-none">
                Curated Suggestions <span className="text-secondary">&</span> Transmissions
              </h2>
              <p className="text-xs sm:text-sm font-label text-on-surface-variant uppercase tracking-wide">
                Handpicked modern masterpieces, cult auteur visions, and sensory landmarks
              </p>
            </div>

            {/* Specimen Counter */}
            <div className="px-4 py-2 bg-surface-container-lowest border-2 border-outline shadow-[3px_3px_0px_#1a1a1a] flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-primary-fixed border border-outline"></span>
              <span className="font-headline font-bold text-xs uppercase tracking-tight">
                Showing <span className="text-secondary font-black">{filteredItems.length}</span> Specimens
              </span>
            </div>
          </div>

          {/* Interactive Filter Controls Bar */}
          <div className="bg-surface-container-low border-2 border-outline shadow-[4px_4px_0px_#1a1a1a] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {[
                { id: 'all', label: 'All Archive' },
                { id: 'sci-fi', label: 'Sci-Fi & Cosmic' },
                { id: 'crime', label: 'Crime & Noir' },
                { id: 'drama', label: 'Prestige Drama' },
                { id: 'mind-bending', label: 'Mind-Bending' },
              ].map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1.5 text-xs font-label font-bold uppercase tracking-wider border-2 border-outline transition-all ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-[2px_2px_0px_#1a1a1a] -translate-y-0.5'
                        : 'bg-surface-container-lowest text-on-surface hover:bg-surface-bright'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Format & Sort Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {/* Media Format Toggle */}
              <div className="inline-flex border-2 border-outline bg-surface-container-lowest shadow-[2px_2px_0px_#1a1a1a]">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'movie', label: 'Cinema' },
                  { id: 'tv', label: 'Series' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`px-2.5 py-1 text-[11px] font-label font-bold uppercase transition-colors ${
                      selectedFormat === fmt.id
                        ? 'bg-secondary text-white'
                        : 'text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>

              {/* Sort Order */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 text-xs font-label font-bold uppercase bg-surface-container-lowest border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] text-on-surface cursor-pointer focus:outline-none"
              >
                <option value="curated">Curated Order</option>
                <option value="rating">Top Rated</option>
                <option value="year">Release Year</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
              <RefreshCw className="w-8 h-8 text-secondary animate-spin" />
              <span className="font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                Synthesizing Cinema Database...
              </span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-surface-container-low border-2 border-outline shadow-[4px_4px_0px_#1a1a1a]">
              <Film className="w-10 h-10 text-on-surface-variant mx-auto mb-3" />
              <h3 className="font-headline text-lg font-bold uppercase">No Specimens In This Spectrum</h3>
              <p className="text-xs font-label text-on-surface-variant uppercase mt-1">
                Reset filters to view all cataloged cinema.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedFormat('all');
                }}
                className="mt-4 px-4 py-2 bg-primary text-white font-label text-xs uppercase font-bold border-2 border-outline shadow-[2px_2px_0px_#1a1a1a]"
              >
                Reset Spectrum Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredItems.map((item) => (
                <MovieCard
                  key={item.id}
                  movie={item}
                  onSelect={(id) => {
                    onSelectMovie && onSelectMovie(id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onPlayTrailer={onPlayTrailer}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. SERENDIPITY PROTOCOL CALLOUT BANNER */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 pb-16">
        <div className="relative bg-primary text-white p-8 lg:p-12 border-2 border-outline shadow-[6px_6px_0px_#1a1a1a] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Decorative Geometric Shapes */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-secondary/30 pointer-events-none blur-xl"></div>
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-primary-fixed/20 pointer-events-none rotate-45"></div>

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed text-on-primary-fixed font-label text-xs font-black uppercase tracking-wider border border-outline shadow-sm">
              <Compass className="w-3.5 h-3.5" />
              <span>THE SERENDIPITY PROTOCOL // 04-X</span>
            </div>
            <h3 className="font-headline text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              Break Your Algorithmic Echo Chamber
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#d6d1c9] leading-relaxed">
              Standard streaming feeds trap you in predictable preference loops. Our Serendipity Taste-Breaker engine computes provocative counter-vectors to shatter your bubble and uncover revelatory cinema.
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <button
              onClick={onOpenSurprise}
              className="px-6 py-4 bg-secondary text-white font-headline text-sm sm:text-base font-bold uppercase tracking-wider border-2 border-outline shadow-[4px_4px_0px_#ffffff] hover:shadow-[6px_6px_0px_#ffffff] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all flex items-center gap-3"
            >
              <span>Initialize Taste-Breaker</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
