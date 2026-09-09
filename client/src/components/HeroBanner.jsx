import React, { useState, useEffect, useRef } from 'react';
import { Play, Info, Plus, Check, Sparkles, SlidersHorizontal, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// 6 Top-tier Spotlight Movies with verified 1080p TMDB Backdrops & YouTube trailers
const SPOTLIGHT_MOVIES = [
  {
    id: 693134,
    title: 'Dune: Part Two',
    year: 2024,
    rating: 8.8,
    runtime: '2h 46m',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    tagline: 'Long live the fighters.',
    overview: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the universe.',
    backdrop: 'https://image.tmdb.org/t/p/w1280/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    poster: 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
    trailerKey: 'Way9Dexny3w',
    badge: 'Trending Worldwide',
    accentColor: 'from-amber-500/20 to-orange-500/5'
  },
  {
    id: 157336,
    title: 'Interstellar',
    year: 2014,
    rating: 8.4,
    runtime: '2h 49m',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    overview: 'When Earth becomes uninhabitable, a team of ex-NASA pilots journeys through a newly discovered wormhole in space to secure humanity’s survival beyond the stars.',
    backdrop: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    trailerKey: 'zSWdZVtXT7E',
    badge: 'Sci-Fi Masterpiece',
    accentColor: 'from-cyan-500/20 to-blue-500/5'
  },
  {
    id: 858485,
    title: 'Kantara',
    year: 2022,
    rating: 7.7,
    runtime: '2h 28m',
    genres: ['Action', 'Adventure', 'Drama'],
    tagline: 'When greed awakens, ancestral spirits deliver vengeance.',
    overview: 'In a remote Karnataka hamlet, an untamable tribal rebel champions his forest community against feudal exploitation while inheriting his clan’s sacred ancestral spirit in an explosive climax.',
    backdrop: 'https://image.tmdb.org/t/p/w1280/kXElm7wt2kAXEVwJqW4cFhP43nW.jpg',
    poster: 'https://image.tmdb.org/t/p/w500/jIsKmkxMzdCZ0Ux1GVSnu8m6Na6.jpg',
    trailerKey: '8mrVmf239GU',
    badge: 'Indian Cinema Phenom',
    accentColor: 'from-rose-500/20 to-amber-500/5'
  },
  {
    id: 155,
    title: 'The Dark Knight',
    year: 2008,
    rating: 8.5,
    runtime: '2h 32m',
    genres: ['Action', 'Crime', 'Drama'],
    tagline: 'Why so serious?',
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    backdrop: 'https://image.tmdb.org/t/p/w1280/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    trailerKey: 'EXeTwQWrcwY',
    badge: 'Highest Rated Thriller',
    accentColor: 'from-blue-500/20 to-violet-500/5'
  },
  {
    id: 27205,
    title: 'Inception',
    year: 2010,
    rating: 8.4,
    runtime: '2h 28m',
    genres: ['Action', 'Sci-Fi', 'Mystery'],
    tagline: 'Your mind is the scene of the crime.',
    overview: 'A skilled thief who steals corporate secrets through dream-sharing technology is offered a chance to have his criminal history erased as payment for the impossible task of planting an idea.',
    backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    poster: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
    trailerKey: 'YoHD9XEInc0',
    badge: 'Mind-Bending Classic',
    accentColor: 'from-teal-500/20 to-cyan-500/5'
  },
  {
    id: 129,
    title: 'Spirited Away',
    year: 2001,
    rating: 8.5,
    runtime: '2h 05m',
    genres: ['Animation', 'Family', 'Fantasy'],
    tagline: 'Tunnel into an unforgettable world of wonder.',
    overview: 'A stubborn 10-year-old girl wanders into a magical spirit bathhouse ruled by the sorceress Yubaba, embarking on an emotional journey to save her parents from a mysterious curse.',
    backdrop: 'https://image.tmdb.org/t/p/original/mSDsSDwaP3E7dEfUPWy4J0djt4O.jpg',
    poster: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    trailerKey: 'ByXuk9QqQkk',
    badge: 'Studio Ghibli Legend',
    accentColor: 'from-violet-500/20 to-fuchsia-500/5'
  }
];

export default function HeroBanner({ onScrollToPicker, onOpenSurprise, onSelectMovie, onPlayTrailer }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { isMovieInWatchlist, toggleWatchlist } = useAuth();
  const timerRef = useRef(null);

  // Auto-advance spotlight every 6.5s unless hovered
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SPOTLIGHT_MOVIES.length);
    }, 6500);

    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  const currentMovie = SPOTLIGHT_MOVIES[currentIndex];
  const inWatchlist = isMovieInWatchlist(currentMovie.id);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? SPOTLIGHT_MOVIES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SPOTLIGHT_MOVIES.length);
  };

  return (
    <div 
      className="relative w-full overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Backdrop Container with Smooth Cross-Fade */}
      <div className="relative h-[480px] sm:h-[540px] md:h-[600px] w-full bg-[#07090E]">
        {SPOTLIGHT_MOVIES.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={movie.backdrop}
              alt={movie.title}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
            />
            
            {/* Multi-layered cinematic gradient masks */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#07090E] via-[#07090E]/80 to-transparent w-full md:w-3/4 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/50 to-transparent z-10" />
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#07090E]/90 to-transparent z-10" />
          </div>
        ))}

        {/* Foreground Content Container */}
        <div className="relative z-20 h-full w-full px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col justify-end pb-12 sm:pb-16 max-w-7xl">
          
          {/* Badge & Rating Row */}
          <div className="flex items-center flex-wrap gap-2.5 mb-3.5 animate-fade-in">
            <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/35 text-cyan-300 text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
              {currentMovie.badge}
            </span>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-xl border border-white/15 text-xs font-black text-amber-300 shadow-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
              <span>{currentMovie.rating}</span>
            </div>

            <span className="text-xs font-bold text-slate-300 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.08]">
              {currentMovie.year}
            </span>

            <span className="text-slate-600 hidden sm:inline">•</span>

            <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {currentMovie.runtime}
            </span>

            <span className="text-slate-600 hidden md:inline">•</span>

            <span className="hidden md:inline-block text-xs font-medium text-slate-300/80">
              {currentMovie.genres.join(' • ')}
            </span>
          </div>

          {/* Film Title with IMAX scale presence */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-2.5 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] leading-[1.08]">
            {currentMovie.title}
          </h1>

          {/* Tagline */}
          <p className="text-sm sm:text-base font-semibold text-cyan-300/90 italic mb-3.5 drop-shadow-md">
            "{currentMovie.tagline}"
          </p>

          {/* Overview */}
          <p className="text-xs sm:text-sm text-slate-200/90 line-clamp-2 md:line-clamp-3 max-w-2xl font-normal leading-relaxed mb-7 drop-shadow-sm">
            {currentMovie.overview}
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3.5">
            {/* Play Trailer */}
            <button
              onClick={() => onPlayTrailer ? onPlayTrailer(currentMovie.id) : onSelectMovie(currentMovie.id)}
              className="flex items-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-teal-200 text-slate-950 font-black text-sm shadow-[0_8px_30px_rgba(6,182,212,0.4)] hover:shadow-[0_8px_40px_rgba(6,182,212,0.65)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
            >
              <Play className="w-4 h-4 fill-slate-950 translate-x-0.5" />
              <span>Watch Trailer</span>
            </button>

            {/* View Details */}
            <button
              onClick={() => onSelectMovie(currentMovie.id)}
              className="flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-xl border border-white/20 hover:border-white/40 text-white font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Details & Cast</span>
            </button>

            {/* Watchlist Toggle */}
            <button
              onClick={() => toggleWatchlist(currentMovie)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-3.5 rounded-xl backdrop-blur-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 border ${
                inWatchlist
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_8px_25px_rgba(16,185,129,0.35)]'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/15 text-slate-200 hover:text-white'
              }`}
            >
              {inWatchlist ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Saved in Watchlist</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-slate-300" />
                  <span className="hidden sm:inline">Watchlist</span>
                </>
              )}
            </button>

            {/* Surprise Me Quick Launch */}
            <button
              onClick={onOpenSurprise}
              className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-violet-600/25 hover:bg-violet-600/40 border border-violet-500/40 text-violet-200 hover:text-white font-bold text-sm shadow-[0_4px_20px_rgba(139,92,246,0.2)] hover:-translate-y-0.5 transition-all duration-300"
              title="Out-of-the-box holographic surprise recommendation"
            >
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
              <span className="hidden sm:inline">Surprise Me</span>
            </button>

            {/* Jump To Mood Matrix */}
            <button
              onClick={onScrollToPicker}
              className="hidden lg:flex items-center gap-2 ml-auto px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/30 text-xs font-bold text-slate-300 hover:text-cyan-300 transition-all hover:-translate-y-0.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Explore Mood Matrix ↓</span>
            </button>
          </div>

        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-950/70 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-teal-400 hover:text-slate-950 text-white backdrop-blur-xl border border-white/15 flex items-center justify-center transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 shadow-xl"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-950/70 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-teal-400 hover:text-slate-950 text-white backdrop-blur-xl border border-white/15 flex items-center justify-center transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 shadow-xl"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators with active gradient pills */}
        <div className="absolute bottom-5 right-4 sm:right-12 z-30 flex items-center gap-2 bg-slate-950/70 backdrop-blur-xl px-3.5 py-2 rounded-full border border-white/15 shadow-xl">
          {SPOTLIGHT_MOVIES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === currentIndex ? 'w-8 bg-gradient-to-r from-cyan-400 to-teal-300 shadow-[0_0_10px_#22d3ee]' : 'w-2 bg-white/25 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
