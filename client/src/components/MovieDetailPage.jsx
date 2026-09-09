import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { ArrowLeft, Star, Clock, Share2, Bookmark, Check, Play, Volume2, Maximize, Film, Loader2 } from 'lucide-react';

const CHAPTERS = [
  { id: 1, number: '01', title: 'Prophecy Awakens', time: '00:00 - 00:52', startSec: 0 },
  { id: 2, number: '02', title: 'Shai-Hulud Trial', time: '00:53 - 01:45', startSec: 53 },
  { id: 3, number: '03', title: 'Giedi Prime Arena', time: '01:46 - 02:24', startSec: 106 },
  { id: 4, number: '04', title: 'Holy War Reckoning', time: '02:25 - 03:02', startSec: 145 },
];

export default function MovieDetailPage({ movieId, mediaType = null, initialPlayTrailer = false, onBack }) {
  const { isMovieInWatchlist, toggleWatchlist, currentUser, markAsWatched } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(initialPlayTrailer);
  const [activeChapter, setActiveChapter] = useState(2);
  const [isLogged, setIsLogged] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [failedImages, setFailedImages] = useState(() => new Set());
  const [isCastGridExpanded, setIsCastGridExpanded] = useState(false);
  const castScrollRef = useRef(null);

  const scrollCast = (direction) => {
    if (castScrollRef.current) {
      const amount = direction === 'left' ? -380 : 380;
      castScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleImageError = (key) => {
    setFailedImages(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const getInitials = (name) => {
    if (!name) return 'CP';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getAvatarBg = (name) => {
    const bgs = [
      'bg-primary text-primary-fixed',
      'bg-[#0055ff] text-white',
      'bg-[#e63b2e] text-white',
      'bg-[#ffcc00] text-[#1a1a1a]',
      'bg-[#1a1a1a] text-white',
      'bg-secondary text-white'
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return bgs[Math.abs(hash) % bgs.length];
  };

  // User Review State
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState(['Visually Unmatched', 'Masterpiece']);
  const [customReviewText, setCustomReviewText] = useState('');
  const [publishedReviews, setPublishedReviews] = useState([
    {
      id: 1,
      name: 'Aronofsky K.',
      location: 'Watched in BFI IMAX London',
      avatar: 'AK',
      avatarBg: 'bg-primary',
      rating: 5,
      text: 'The sound design during the worm-riding sequence is not merely cinema; it is physical tectonic resonance. Austin Butler delivers one of the most chilling villain reveals in modern blockbuster memory.'
    },
    {
      id: 2,
      name: 'Maya Lin',
      location: 'Watched via 70mm Film Print',
      avatar: 'ML',
      avatarBg: 'bg-secondary',
      rating: 5,
      text: 'An unapologetic embrace of tragedy. Unlike standard hero arcs, you watch someone slowly descend into inevitable holy war with suffocating visual clarity.'
    }
  ]);
  const [reviewPublished, setReviewPublished] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [movieId]);

  useEffect(() => {
    if (!movieId) return;
    let active = true;
    setLoading(true);

    api.getMovieDetails(movieId, mediaType)
      .then((data) => {
        if (active) {
          setMovie(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching details:', err);
        if (active) {
          setMovie(null);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [movieId]);

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-12 text-on-surface">
        <Loader2 className="w-10 h-10 text-secondary animate-spin mb-4" />
        <p className="font-headline font-bold text-sm uppercase tracking-widest">
          Loading Cinematic Dossier & Sensory Matrix...
        </p>
      </div>
    );
  }

  // Fallback / default data if movie is missing details
  const title = movie?.title || movie?.name || 'Dune: Part Two';
  const isSeries = movie?.media_type === 'tv' || Boolean(movie?.number_of_seasons);
  const tagline = movie?.tagline || (isSeries ? 'A Masterwork Limited Series Event.' : (title.toLowerCase().includes('dune') ? 'Long live the fighters.' : ''));
  const year = movie?.year || (movie?.release_date ? movie.release_date.split('-')[0] : '2024');
  const runtime = movie?.number_of_seasons 
    ? `${movie.number_of_seasons} Season${movie.number_of_seasons > 1 ? 's' : ''}`
    : movie?.runtime 
      ? (typeof movie.runtime === 'number' ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : movie.runtime)
      : (isSeries ? 'Series' : '2h 46m');
  const genres = movie?.genres?.length ? movie.genres : ['Epic Sci-Fi Thriller', 'Adventure'];
  const rating = movie?.vote_average ? movie.vote_average.toFixed(1) : '8.8';
  const backdrop = movie?.backdrop_path || movie?.poster_path || 'https://image.tmdb.org/t/p/w1280/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg';
  const poster = movie?.poster_path || movie?.backdrop_path || 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg';
  const archiveNo = String(movie?.id || movieId || '0429').slice(-4).padStart(4, '0');
  const director = movie?.director || (isSeries ? 'Creator / Showrunner' : 'Denis Villeneuve');
  const directorPhoto = movie?.director_photo || (director === 'Denis Villeneuve' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Denis_Villeneuve_Cannes_2018.jpg/330px-Denis_Villeneuve_Cannes_2018.jpg' : null);
  const cast = movie?.cast?.length ? movie.cast : [
    { name: 'Timothée Chalamet', character: "Paul Atreides / Muad'Dib", profile_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Timoth%C3%A9e_Chalamet_2019_%28cropped%29.jpg/330px-Timoth%C3%A9e_Chalamet_2019_%28cropped%29.jpg' },
    { name: 'Zendaya', character: 'Chani', profile_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Zendaya_-_2019_by_Glenn_Francis.jpg/330px-Zendaya_-_2019_by_Glenn_Francis.jpg' },
    { name: 'Rebecca Ferguson', character: 'Lady Jessica', profile_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Rebecca_Ferguson_in_2019.jpg/330px-Rebecca_Ferguson_in_2019.jpg' },
    { name: 'Austin Butler', character: 'Feyd-Rautha Harkonnen', profile_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Austin_Butler_by_Gage_Skidmore.jpg/330px-Austin_Butler_by_Gage_Skidmore.jpg' }
  ];
  const trailerKey = movie?.trailer_key || 'Way9Dexny3w';
  const inWatchlist = movie ? isMovieInWatchlist(movie.id) : false;

  // Cinematic Chapters (Custom for Dune, dynamic for others)
  const chapters = (title.toLowerCase().includes('dune')) ? CHAPTERS : [
    { id: 1, number: '01', title: 'Overture & Origin', time: '00:00 - 00:48', startSec: 0 },
    { id: 2, number: '02', title: 'Inciting Sequence', time: '00:49 - 01:34', startSec: 49 },
    { id: 3, number: '03', title: 'Crescendo & Conflict', time: '01:35 - 02:18', startSec: 95 },
    { id: 4, number: '04', title: 'Climactic Reckoning', time: '02:19 - 03:00', startSec: 139 },
  ];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handlePublishReview = async (e) => {
    e.preventDefault();
    const reviewTextToSave = customReviewText.trim();
    const newEntry = {
      id: Date.now(),
      name: currentUser?.displayName || 'CinePulse Member',
      location: 'Verified Cinema Deck Screening',
      avatar: (currentUser?.displayName || 'CP').slice(0, 2).toUpperCase(),
      avatarBg: 'bg-primary-fixed text-on-primary-fixed',
      rating: userRating,
      text: reviewTextToSave || `Rated ${userRating}/5 stars. ${selectedTags.join(' • ')}. Outstanding audiovisual resonance.`
    };
    setPublishedReviews([newEntry, ...publishedReviews]);

    if (movie && markAsWatched) {
      await markAsWatched(
        movie,
        userRating * 2,
        reviewTextToSave,
        selectedTags
      );
    }

    setCustomReviewText('');
    setReviewPublished(true);
    setTimeout(() => setReviewPublished(false), 4000);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="w-full flex flex-col bg-background text-on-surface">
      
      {/* Back Navigation Bar */}
      <div className="w-full bg-surface-container-low border-b-2 border-outline px-6 lg:px-12 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-lowest text-on-surface font-label text-xs uppercase font-bold border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] hover:bg-primary hover:text-white transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Catalog</span>
        </button>

        <div className="hidden sm:flex items-center gap-4 text-[11px] font-label font-bold uppercase text-on-surface-variant">
          <span>SPECIMEN DOSSIER: #{movieId}</span>
          <span className="text-secondary">•</span>
          <span>FORMAT: 4K UHD MASTER</span>
        </div>
      </div>

      {/* Cinematic Hero Stage matching Stitch Movie Detail */}
      <section className="relative w-full overflow-hidden bg-primary text-on-primary border-b-2 border-outline">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000"
            style={{ backgroundImage: `url(${backdrop})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
          
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="bauhaus-grid-detail" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M 64 0 L 0 0 0 64" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
                <circle cx="32" cy="32" r="1.5" fill="currentColor"></circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bauhaus-grid-detail)"></rect>
          </svg>
        </div>

        {/* Hero Header Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-20 lg:pb-28 flex flex-col justify-end min-h-[560px]">
          
          {/* Breadcrumb Meta Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6 font-label text-xs uppercase tracking-widest text-[#e2ddd4]">
            <span className="px-2.5 py-1 bg-primary-fixed text-on-primary-fixed font-bold border border-outline shadow-sm">
              Archive No. {archiveNo}
            </span>
            <span className="text-secondary font-bold">•</span>
            <span className="font-semibold">{genres.join(' / ')}</span>
            <span className="text-secondary font-bold">•</span>
            <span className="font-bold">{year}</span>
            <span className="text-secondary font-bold">•</span>
            <span>{runtime}</span>
            <span className="px-2 py-0.5 bg-surface-container-high text-on-surface font-bold text-[10px] border border-outline">
              IMAX 70MM
            </span>
          </div>

          {/* Giant Geometric Title & Tagline */}
          <div className="flex flex-col mb-8">
            <h1 className="font-headline font-black text-5xl sm:text-7xl lg:text-9xl uppercase tracking-tighter leading-none text-white select-none">
              {title}
            </h1>
            {tagline && (
              <p className="font-headline italic font-bold text-xl sm:text-2xl text-secondary mt-3 tracking-wide flex items-center gap-3">
                <span className="inline-block w-8 h-1 bg-secondary"></span>
                "{tagline}"
              </p>
            )}
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
                  {rating}<span className="text-xs font-normal text-on-surface-variant">/10</span>
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
                <span className="font-headline font-bold text-base tracking-tight">98% Match</span>
                <span className="font-label text-[9px] uppercase font-bold tracking-widest opacity-80">
                  Mind-Bending Spectrum
                </span>
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
            {/* Play Official Trailer Pill */}
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

            {/* Watchlist Toggle */}
            <button
              onClick={() => toggleWatchlist(movie || { id: movieId, title })}
              className={`flex items-center gap-2.5 px-6 py-4 rounded-full font-label font-bold text-xs uppercase tracking-wider border-2 border-outline shadow-[3px_3px_0px_#1a1a1a] active:scale-95 transition-all ${
                inWatchlist ? 'bg-secondary text-white' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {inWatchlist ? 'bookmark_added' : 'bookmark_add'}
              </span>
              <span>{inWatchlist ? 'In Vault' : 'Watchlist'}</span>
            </button>

            {/* Mark Logged Pill */}
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

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest active:scale-90 transition-all border-2 border-outline shadow-[3px_3px_0px_#1a1a1a]"
              title="Share movie profile"
            >
              <span className="material-symbols-outlined text-xl">
                {copySuccess ? 'check' : 'share'}
              </span>
            </button>
          </div>

        </div>
      </section>

      {/* Interactive Trailer Dock & Master Canvas */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 -mt-10 lg:-mt-14 relative z-20 w-full mb-16">
        <div className="bg-surface-container-lowest border-2 border-outline shadow-[6px_6px_0px_#1a1a1a] overflow-hidden">
          
          {/* Player Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-surface-container-high text-on-surface font-label text-xs uppercase tracking-widest font-bold border-b-2 border-outline">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-secondary inline-block border border-outline"></span>
              <span>Cinema Deck 4K HDR • Chapter Stream</span>
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-secondary">wifi_tethering</span>
                LIVE BITRATE 38.4 Mbps
              </span>
              <span className="hidden md:inline-block">ASPECT: 1.43:1 EXPANDED</span>
            </div>
          </div>

          {/* Video Canvas */}
          <div className="relative w-full aspect-video bg-primary overflow-hidden flex items-center justify-center group" id="video-canvas">
            {isPlayingTrailer ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&start=${chapters[activeChapter - 1]?.startSec || 0}`}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${backdrop})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/40"></div>
                
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
                    Watch Trailer (Full 4K)
                  </span>
                </div>

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
                        CH. 02 THE RIDE
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

          {/* Trailer Chapter Bookmarks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-surface-container-low font-label text-xs border-t-2 border-outline">
            {chapters.map((ch) => {
              const isActive = ch.id === activeChapter;
              return (
                <button
                  key={ch.id}
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

      {/* Narrative Synopsis & Mood DNA Split Bento Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 7 Cols: The Narrative Codex */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-surface-container-lowest p-8 lg:p-10 border-2 border-outline shadow-[4px_4px_0px_#1a1a1a]">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2.5 h-6 bg-secondary border border-outline"></span>
                <h2 className="font-headline font-black text-2xl uppercase tracking-tight text-on-surface">
                  The Narrative Codex
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                {poster && (
                  <div className="shrink-0 flex flex-col items-center">
                    <img
                      src={poster}
                      alt={title}
                      className="w-32 sm:w-44 h-48 sm:h-64 object-cover border-2 border-outline shadow-[4px_4px_0px_#1a1a1a]"
                      onError={(e) => {
                        e.target.src = backdrop;
                      }}
                    />
                    <span className="block mt-1.5 text-[9px] font-label uppercase font-bold text-on-surface-variant tracking-wider text-center">
                      Official Theatrical Keyart
                    </span>
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <p className="font-body text-base lg:text-lg text-on-surface leading-relaxed mb-4">
                    {movie?.overview || 'Paul Atreides unites with Chani and the Fremen while seeking vengeance against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.'}
                  </p>
                  <p className="font-body text-sm lg:text-base text-on-surface-variant leading-relaxed">
                    Expanding deep into the thermodynamic brutality of sensory storytelling and high-cerebral structure, this work represents an unyielding triumph of cinematic scale, sound physics, and narrative depth.
                  </p>
                </div>
              </div>

              {/* Core Themes Badges */}
              <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-surface-variant">
                {(movie?.keywords?.length ? movie.keywords.slice(0, 5) : ['Religious Hegemony', 'Imperial Ecology', 'Fatalist Prophecy', 'Desert Survivalism']).map(theme => (
                  <span
                    key={theme}
                    className="px-3 py-1 bg-surface-container text-on-surface font-label text-xs font-semibold uppercase border border-outline"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Accolades Bento Tile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface-container p-5 border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] flex flex-col justify-between">
                <span className="font-label text-[11px] uppercase font-bold text-on-surface-variant">
                  Cinematography
                </span>
                <span className="font-headline font-bold text-lg text-on-surface mt-2">
                  Greig Fraser, ASC
                </span>
                <span className="text-xs text-secondary font-semibold mt-1">Arri Alexa LF 65</span>
              </div>
              <div className="bg-surface-container p-5 border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] flex flex-col justify-between">
                <span className="font-label text-[11px] uppercase font-bold text-on-surface-variant">
                  Original Score
                </span>
                <span className="font-headline font-bold text-lg text-on-surface mt-2">
                  Hans Zimmer
                </span>
                <span className="text-xs text-tertiary font-semibold mt-1">Custom Wind Synthesizers</span>
              </div>
              <div className="bg-surface-container p-5 border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] flex flex-col justify-between">
                <span className="font-label text-[11px] uppercase font-bold text-on-surface-variant">
                  Production Design
                </span>
                <span className="font-headline font-bold text-lg text-on-surface mt-2">
                  Patrice Vermette
                </span>
                <span className="text-xs text-primary-fixed-dim font-semibold mt-1">Location Sets</span>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Mood DNA Matrix Widget */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-primary text-on-primary p-8 border-2 border-outline shadow-[5px_5px_0px_#1a1a1a] flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-fixed">tune</span>
                  <h3 className="font-headline font-bold text-xl uppercase tracking-wider">Mood DNA Matrix</h3>
                </div>
                <span className="font-label text-xs uppercase px-2.5 py-0.5 bg-secondary text-white font-bold border border-outline">
                  Algorithmic
                </span>
              </div>
              
              <p className="font-body text-xs text-[#d6d1c9] leading-relaxed">
                Neural vector mapping derived from over 48,000 CinePulse member sensory logs and acoustic spectral measurements.
              </p>

              {/* Metric Sliders / Bars */}
              <div className="flex flex-col gap-4 pt-2">
                <div>
                  <div className="flex justify-between items-center mb-1.5 font-label text-xs">
                    <span className="uppercase tracking-wider font-bold text-white">Cerebral Depth</span>
                    <span className="font-mono font-bold text-primary-fixed">95%</span>
                  </div>
                  <div className="w-full bg-white/20 h-3 border border-outline overflow-hidden">
                    <div className="bg-primary-fixed h-full w-[95%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5 font-label text-xs">
                    <span className="uppercase tracking-wider font-bold text-white">Visually Astonishing</span>
                    <span className="font-mono font-bold text-tertiary">98%</span>
                  </div>
                  <div className="w-full bg-white/20 h-3 border border-outline overflow-hidden">
                    <div className="bg-tertiary h-full w-[98%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5 font-label text-xs">
                    <span className="uppercase tracking-wider font-bold text-white">Kinetic Tension</span>
                    <span className="font-mono font-bold text-secondary">85%</span>
                  </div>
                  <div className="w-full bg-white/20 h-3 border border-outline overflow-hidden">
                    <div className="bg-secondary h-full w-[85%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5 font-label text-xs">
                    <span className="uppercase tracking-wider font-bold text-white">Emotional Gravitas</span>
                    <span className="font-mono font-bold text-white">80%</span>
                  </div>
                  <div className="w-full bg-white/20 h-3 border border-outline overflow-hidden">
                    <div className="bg-white h-full w-[80%]"></div>
                  </div>
                </div>
              </div>

              {/* Mini Inline SVG Radar Diagram */}
              <div className="mt-2 p-4 bg-surface-container-high/20 border border-outline flex items-center justify-between gap-4">
                <svg className="w-16 h-16 text-primary-fixed shrink-0" viewBox="0 0 100 100">
                  <polygon fill="none" opacity="0.3" points="50,10 90,50 50,90 10,50" stroke="currentColor" strokeWidth="1.5"></polygon>
                  <polygon fill="none" opacity="0.3" points="50,25 75,50 50,75 25,50" stroke="currentColor" strokeWidth="1.5"></polygon>
                  <polygon fill="currentColor" fillOpacity="0.35" points="50,12 88,48 50,82 14,50" stroke="currentColor" strokeWidth="2"></polygon>
                  <circle cx="50" cy="12" fill="currentColor" r="3"></circle>
                  <circle cx="88" cy="48" fill="currentColor" r="3"></circle>
                  <circle cx="50" cy="82" fill="currentColor" r="3"></circle>
                  <circle cx="14" cy="50" fill="currentColor" r="3"></circle>
                </svg>
                <div className="text-xs font-label">
                  <span className="text-primary-fixed font-bold block uppercase tracking-wider mb-1">
                    Peak Archetype
                  </span>
                  <p className="text-[#d6d1c9] leading-tight text-[11px]">
                    Monumental Mythic Tragedy • High Frequency Sensory Cinema
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Key Ensemble & Director Spotlight */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b-2 border-outline">
          <div>
            <span className="font-label text-xs uppercase tracking-widest text-secondary font-bold block mb-1">
              Dramatis Personae
            </span>
            <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-on-surface">
              Key Ensemble & Director
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-surface-container-high text-on-surface font-label text-xs uppercase font-bold border border-outline">
              {cast.length + 1} Credits
            </span>

            {/* Grid vs Scroll Strip Toggle */}
            <button
              type="button"
              onClick={() => setIsCastGridExpanded(!isCastGridExpanded)}
              className="px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface font-label text-xs uppercase font-bold border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] hover:bg-primary hover:text-white transition-all active:scale-95"
            >
              {isCastGridExpanded ? 'Scroll Strip' : 'View Full Ensemble'}
            </button>

            {/* Scroll Arrow Buttons from Stitch Screen #3 */}
            {!isCastGridExpanded && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollCast('left')}
                  className="w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] hover:bg-primary hover:text-white transition-all active:scale-95"
                  title="Scroll Left"
                >
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollCast('right')}
                  className="w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] hover:bg-primary hover:text-white transition-all active:scale-95"
                  title="Scroll Right"
                >
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cast & Director Cards Container */}
        <div
          ref={castScrollRef}
          className={
            isCastGridExpanded
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-1'
              : 'flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth snap-x'
          }
          style={{ scrollbarWidth: 'thin' }}
        >
          {/* Director Card */}
          <div
            className={`bg-primary text-on-primary p-4 border-2 border-outline shadow-[3px_3px_0px_#1a1a1a] flex flex-col justify-between ${
              isCastGridExpanded ? 'w-full' : 'w-[200px] shrink-0 snap-start'
            }`}
          >
            <div className="relative w-full aspect-square overflow-hidden mb-3 bg-surface-variant border border-outline">
              {directorPhoto && !failedImages.has(`dir_${director}`) ? (
                <img
                  src={directorPhoto}
                  alt={director}
                  onError={() => handleImageError(`dir_${director}`)}
                  className="w-full h-full object-cover object-top grayscale contrast-125"
                />
              ) : (
                <div className="w-full h-full bg-[#1a1a1a] text-primary-fixed flex flex-col items-center justify-center p-3 relative overflow-hidden select-none">
                  <span className="font-headline font-black text-4xl tracking-tighter">
                    {getInitials(director)}
                  </span>
                  <span className="font-label text-[9px] uppercase font-bold tracking-widest mt-1 text-secondary">
                    Auteur
                  </span>
                  <span className="material-symbols-outlined absolute -bottom-1 -right-1 text-3xl opacity-20 pointer-events-none text-white">
                    videocam
                  </span>
                </div>
              )}
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-secondary text-white font-label text-[9px] uppercase font-bold border border-outline shadow-sm">
                Director
              </span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm uppercase tracking-tight text-white truncate" title={director}>
                {director}
              </h3>
              <p className="font-label text-[11px] text-primary-fixed mt-0.5 uppercase tracking-wide">
                Auteur Architect
              </p>
            </div>
          </div>

          {/* All Cast Cards */}
          {cast.map((actor, idx) => {
            const hasRealPhoto = actor.profile_path && !failedImages.has(`act_${actor.name}`);
            return (
              <div
                key={actor.name || idx}
                className={`bg-surface-container-lowest p-4 border-2 border-outline shadow-[3px_3px_0px_#1a1a1a] flex flex-col justify-between ${
                  isCastGridExpanded ? 'w-full' : 'w-[190px] shrink-0 snap-start'
                }`}
              >
                <div className="relative w-full aspect-square overflow-hidden mb-3 bg-surface-variant border border-outline">
                  {hasRealPhoto ? (
                    <img
                      src={actor.profile_path}
                      alt={actor.name}
                      onError={() => handleImageError(`act_${actor.name}`)}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className={`w-full h-full ${getAvatarBg(actor.name)} flex flex-col items-center justify-center p-3 relative overflow-hidden select-none`}>
                      <span className="font-headline font-black text-3xl tracking-tighter">
                        {getInitials(actor.name)}
                      </span>
                      <span className="font-label text-[9px] uppercase font-bold tracking-widest mt-1 opacity-80">
                        Ensemble
                      </span>
                      <span className="material-symbols-outlined absolute -bottom-1 -right-1 text-3xl opacity-15 pointer-events-none">
                        theater_comedy
                      </span>
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-surface-container-lowest/90 text-on-surface font-label text-[8px] uppercase font-bold border border-outline">
                    #{idx + 1}
                  </span>
                </div>

                <div>
                  <h3 className="font-headline font-bold text-sm uppercase tracking-tight text-on-surface truncate" title={actor.name}>
                    {actor.name}
                  </h3>
                  <p className="font-label text-[10px] text-on-surface-variant mt-0.5 uppercase tracking-wide truncate font-semibold" title={actor.character}>
                    {actor.character || 'Leading Role'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Where to Experience in India (Streaming Matrix) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-16">
        <div className="bg-surface-container p-8 border-2 border-outline shadow-[4px_4px_0px_#1a1a1a]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-surface-variant">
            <div>
              <span className="font-label text-xs uppercase tracking-widest text-primary font-bold block mb-1">
                Domestic Streaming Matrix
              </span>
              <h2 className="font-headline font-black text-2xl uppercase tracking-tight text-on-surface">
                Where to Experience in India
              </h2>
            </div>
            <div className="flex items-center gap-2 font-label text-xs uppercase font-bold text-on-surface bg-surface-container-lowest px-3 py-1.5 border-2 border-outline shadow-[2px_2px_0px_#1a1a1a]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-outline animate-pulse"></span>
              <span>🇮🇳 Region: India (OTT Signals Active)</span>
            </div>
          </div>

          {/* Dynamic Indian OTT Providers */}
          {(() => {
            const wpIndia = movie?.watch_providers_india;
            const streams = wpIndia?.stream || [];
            const rents = wpIndia?.rent || [];
            const buys = wpIndia?.buy || [];

            const hasAnyIndiaProvider = streams.length > 0 || rents.length > 0 || buys.length > 0;

            if (hasAnyIndiaProvider) {
              // Combine stream, rent, and buy providers
              const items = [
                ...streams.map(p => ({
                  ...p,
                  category: 'STREAM',
                  badge: 'STREAMING NOW',
                  badgeClass: 'bg-primary text-on-primary',
                  desc: 'Available with active subscription. Stream in 4K UHD with Hindi & Regional Indian audio/subtitles.',
                  specs: '4K UHD • DOLBY ATMOS',
                  btnLabel: `Watch on ${p.name}`
                })),
                ...rents.map(p => ({
                  ...p,
                  category: 'RENT',
                  badge: 'RENT IN ₹ (INDIA)',
                  badgeClass: 'bg-secondary text-on-secondary',
                  desc: 'High-bitrate VOD rental in India. 48-hour viewing window with Dolby Vision HDR.',
                  specs: 'DOLBY VISION • 5.1',
                  btnLabel: `Rent on ${p.name}`
                })),
                ...buys.map(p => ({
                  ...p,
                  category: 'BUY',
                  badge: 'BUY IN ₹ (INDIA)',
                  badgeClass: 'bg-tertiary text-white',
                  desc: 'Add permanent digital master in India to your digital library with bonus extras.',
                  specs: '4K DIGITAL MASTER',
                  btnLabel: `Buy on ${p.name}`
                }))
              ];

              // Deduplicate by provider name if exact same exists in multiple buckets
              const seen = new Set();
              const uniqueItems = items.filter(item => {
                const key = `${item.name}-${item.category}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
              });

              return (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uniqueItems.map((prov, idx) => (
                      <div 
                        key={idx} 
                        className="bg-surface-container-lowest p-6 border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] flex flex-col justify-between hover:-translate-y-0.5 transition-transform"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4 gap-2">
                            <div className="flex items-center gap-3">
                              {prov.logo_path ? (
                                <img 
                                  src={prov.logo_path} 
                                  alt={prov.name} 
                                  className="w-10 h-10 rounded-lg border border-outline object-cover shadow-sm"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline flex items-center justify-center font-bold text-xs text-on-surface">
                                  OTT
                                </div>
                              )}
                              <span className="font-headline font-black text-lg sm:text-xl text-on-surface tracking-tight uppercase">
                                {prov.name}
                              </span>
                            </div>
                            <span className={`px-2 py-0.5 font-label text-[10px] uppercase font-bold border border-outline shrink-0 ${prov.badgeClass}`}>
                              {prov.badge}
                            </span>
                          </div>
                          <p className="font-body text-xs text-on-surface-variant mb-6 leading-relaxed">
                            {prov.desc}
                          </p>
                        </div>
                        <div className="pt-4 border-t-2 border-surface-container-high flex items-center justify-between gap-2">
                          <span className="font-label text-[11px] font-bold uppercase text-on-surface truncate">
                            {prov.specs}
                          </span>
                          <a 
                            href={wpIndia?.link || 'https://www.justwatch.com/in'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label text-xs uppercase font-bold border border-outline hover:bg-tertiary transition-colors shrink-0 flex items-center gap-1.5"
                          >
                            <span>Open</span>
                            <span className="material-symbols-outlined text-xs">open_in_new</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {wpIndia?.link && (
                    <div className="mt-4 pt-3 border-t border-surface-variant flex items-center justify-between text-xs text-on-surface-variant font-label">
                      <span>Verified for streaming in India (IN)</span>
                      <a 
                        href={wpIndia.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline hover:text-primary font-semibold flex items-center gap-1"
                      >
                        <span>Check all Indian watch options on JustWatch / TMDB</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            }

            // India Fallback when TMDB has no explicit provider listing
            return (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* JioHotstar / JioCinema */}
                  <div className="bg-surface-container-lowest p-6 border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-headline font-black text-xl text-on-surface tracking-tight">JIOHOTSTAR</span>
                        <span className="px-2.5 py-1 bg-primary text-on-primary font-label text-[10px] uppercase font-bold border border-outline">
                          Streaming in India
                        </span>
                      </div>
                      <p className="font-body text-xs text-on-surface-variant mb-6">
                        Full 4K Ultra HD master with Dolby Atmos & Regional Indian dubs/subs.
                      </p>
                    </div>
                    <div className="pt-4 border-t-2 border-surface-container-high flex items-center justify-between">
                      <span className="font-label text-xs font-semibold uppercase text-on-surface">4K UHD • DOLBY ATMOS</span>
                      <a 
                        href="https://www.hotstar.com/in" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 rounded-full bg-primary text-on-primary font-label text-xs uppercase font-bold border border-outline hover:bg-tertiary transition-colors"
                      >
                        Launch
                      </a>
                    </div>
                  </div>

                  {/* Amazon Prime Video India */}
                  <div className="bg-surface-container-lowest p-6 border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-headline font-black text-xl text-on-surface tracking-tight">PRIME VIDEO IN</span>
                        <span className="px-2.5 py-1 bg-surface-container-high text-on-surface font-label text-[10px] uppercase font-bold border border-outline">
                          Rent from ₹69 / Buy ₹499
                        </span>
                      </div>
                      <p className="font-body text-xs text-on-surface-variant mb-6">
                        Available on Prime Video India store with 4K UHD and multi-language support.
                      </p>
                    </div>
                    <div className="pt-4 border-t-2 border-surface-container-high flex items-center justify-between">
                      <span className="font-label text-xs font-semibold uppercase text-on-surface">4K HDR • 5.1</span>
                      <a 
                        href="https://www.primevideo.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface font-label text-xs uppercase font-bold border border-outline hover:bg-surface-variant transition-colors"
                      >
                        Select
                      </a>
                    </div>
                  </div>

                  {/* Netflix India */}
                  <div className="bg-surface-container-lowest p-6 border-2 border-outline shadow-[2px_2px_0px_#1a1a1a] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-headline font-black text-xl text-on-surface tracking-tight">NETFLIX INDIA</span>
                        <span className="px-2.5 py-1 bg-tertiary text-white font-label text-[10px] uppercase font-bold border border-outline">
                          Subscription Plan
                        </span>
                      </div>
                      <p className="font-body text-xs text-on-surface-variant mb-6">
                        Ultra HD 4K playback with Dolby Vision and Spatial Audio stream on Netflix India.
                      </p>
                    </div>
                    <div className="pt-4 border-t-2 border-surface-container-high flex items-center justify-between">
                      <span className="font-label text-xs font-semibold uppercase text-on-surface">DOLBY VISION • ATMOS</span>
                      <a 
                        href="https://www.netflix.com/in/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface font-label text-xs uppercase font-bold border border-outline hover:bg-surface-variant transition-colors"
                      >
                        Stream
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Interactive User Review & Community Ratings Module */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Rating Widget (5 Cols) */}
          <div className="lg:col-span-5 bg-surface-container-lowest p-8 border-2 border-outline shadow-[4px_4px_0px_#1a1a1a]">
            <span className="font-label text-xs uppercase tracking-widest text-secondary font-bold block mb-1">
              Your Personal Log
            </span>
            <h2 className="font-headline font-black text-2xl uppercase tracking-tight text-on-surface mb-4">
              Rate {title}
            </h2>

            {/* Star Rating Array */}
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-4xl transition-colors focus:outline-none"
                >
                  <span className={`${
                    (hoverRating || userRating) >= star ? 'text-amber-400' : 'text-[#d0cbc3]'
                  }`}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            
            <p className="font-label text-xs uppercase font-bold text-secondary mb-6 tracking-wide">
              Scored: {userRating}.0 / 5.0 — Certified Bauhaus Selection
            </p>

            {/* Dynamic Impression Tags */}
            <div className="mb-6">
              <label className="block font-label text-xs uppercase font-bold text-on-surface mb-2">
                Tag Your Impressions
              </label>
              <div className="flex flex-wrap gap-2">
                {['Visually Unmatched', 'Deafening Bass', 'Masterpiece', 'Theological Dread', 'Slow Burn', 'High Entropy'].map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 font-label text-xs uppercase font-bold border border-outline transition-all ${
                        isSelected
                          ? 'bg-primary-fixed text-on-primary-fixed shadow-[1.5px_1.5px_0px_#1a1a1a]'
                          : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Written Impression Input */}
            <form onSubmit={handlePublishReview}>
              <div className="mb-4">
                <label className="block font-label text-xs uppercase font-bold text-on-surface mb-1.5">
                  Personal Critical Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={customReviewText}
                  onChange={(e) => setCustomReviewText(e.target.value)}
                  placeholder="Record your thoughts on pacing, cinematography, and acoustic texture..."
                  className="w-full p-3 bg-surface-container-low border-2 border-outline text-xs font-body text-on-surface focus:outline-none focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-primary text-on-primary font-label text-xs uppercase tracking-wider font-bold border-2 border-outline shadow-[3px_3px_0px_#1a1a1a] hover:bg-tertiary transition-all active:translate-x-0.5 active:translate-y-0.5"
              >
                Publish Entry To Sensory Log
              </button>
            </form>

            {reviewPublished && (
              <div className="mt-3 p-2 bg-emerald-100 border border-emerald-500 text-emerald-800 text-xs font-bold font-label uppercase text-center">
                ✓ Successfully published to community consensus
              </div>
            )}
          </div>

          {/* Community Consensus Reviews (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-6 bg-primary-fixed border border-outline"></span>
                <h3 className="font-headline font-bold text-xl uppercase tracking-tight text-on-surface">
                  Community Consensus ({publishedReviews.length + 4810} Reviews)
                </h3>
              </div>
              <span className="font-label text-xs uppercase font-bold text-secondary">
                Verified Screenings
              </span>
            </div>

            {/* Review Cards */}
            {publishedReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-surface-container-lowest p-6 border-2 border-outline shadow-[3px_3px_0px_#1a1a1a]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${rev.avatarBg} flex items-center justify-center font-headline font-bold text-xs border border-outline`}>
                      {rev.avatar}
                    </div>
                    <div>
                      <span className="font-headline font-bold text-sm text-on-surface uppercase">
                        {rev.name}
                      </span>
                      <span className="text-[10px] font-label text-on-surface-variant block">
                        {rev.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex text-amber-500 text-sm">
                    {'★'.repeat(rev.rating)}
                  </div>
                </div>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  "{rev.text}"
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
