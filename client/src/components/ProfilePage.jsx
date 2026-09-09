import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { X, Check, Camera, Star, Trash2, Plus, Film, Edit3, Share2, Sparkles, User, ArrowRight } from 'lucide-react';

export default function ProfilePage({ onSelectMovie }) {
  const {
    currentUser,
    updateProfile,
    history,
    watchlist,
    favorites,
    markAsWatched,
    deleteReview,
    showToast
  } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    displayName: '',
    email: '',
    tagline: '',
    bio: '',
    avatar: ''
  });

  // Sync edit form with currentUser
  useEffect(() => {
    if (currentUser) {
      setEditForm({
        displayName: currentUser.displayName || '',
        email: currentUser.email || (currentUser.username ? `${currentUser.username}@cinepulse.ai` : ''),
        tagline: currentUser.tagline || 'Lead Cinematographer & Sensory Vector Scout',
        bio: currentUser.bio || '',
        avatar: currentUser.avatar || ''
      });
    }
  }, [currentUser, isEditModalOpen]);

  // Prevent background scrolling while modal is active
  useEffect(() => {
    if (isEditModalOpen || isReviewModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isEditModalOpen, isReviewModalOpen]);

  // New review form state
  const [newReview, setNewReview] = useState({
    title: '',
    year: '2024',
    rating: 10,
    reviewText: '',
    tags: ['Acoustic Immersion', 'Criterion Master']
  });

  // Show ONLY actual reviews written by the user
  const displayReviews = (history || [])
    .filter(h => h && typeof h.reviewText === 'string' && h.reviewText.trim().length > 0)
    .map(h => ({
      id: h.id,
      title: h.title,
      year: h.year || '2024',
      poster_path: h.poster_path,
      userRating: h.userRating || 10,
      watchedAt: h.watchedAt,
      reviewText: h.reviewText.trim(),
      tags: (h.tags && h.tags.length > 0) ? h.tags : (h.genres || []),
      movieId: h.movieId
    }));

  return (
    <div className="flex flex-col w-full animate-fade-in pb-12">
      {/* Status Telemetry Bar */}
      <div className="w-full bg-surface-container-high border-b-2 border-outline px-4 lg:px-12 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-label">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-widest text-on-surface">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              SYS_ID // TASTE_SPECIMEN #0491
            </span>
            <span className="text-outline-variant font-black">|</span>
            <span className="font-mono text-on-surface-variant font-bold">RESONANCE: 99.4%</span>
            <span className="hidden sm:inline text-outline-variant font-black">|</span>
            <span className="hidden sm:inline text-on-surface-variant font-semibold">MEMBER: OCT 2022</span>
            <span className="hidden md:inline text-outline-variant font-black">|</span>
            <span className="hidden md:inline text-on-surface-variant font-semibold">NODE: BAUHAUS V4.9</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Primary Channels:</span>
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 bg-secondary border border-outline shadow-[1px_1px_0px_#1a1a1a]" title="RGB_RED"></div>
              <div className="w-3.5 h-3.5 bg-primary-fixed border border-outline shadow-[1px_1px_0px_#1a1a1a]" title="RGB_YELLOW"></div>
              <div className="w-3.5 h-3.5 bg-tertiary border border-outline shadow-[1px_1px_0px_#1a1a1a]" title="RGB_BLUE"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Identity Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
        <div className="border-2 border-outline bg-surface-container-lowest p-6 sm:p-8 lg:p-10 shadow-[6px_6px_0px_0px_#1a1a1a] relative overflow-hidden">
          {/* Bauhaus Decorative Corner Stencil */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-fixed border-2 border-outline rotate-12 -z-0 opacity-40 pointer-events-none"></div>
          <div className="absolute -right-2 top-24 w-12 h-12 bg-secondary border-2 border-outline -z-0 opacity-30 pointer-events-none rounded-full"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            
            {/* Avatar Block with Edit Trigger */}
            <div className="flex flex-col items-center sm:items-start shrink-0">
              <div 
                onClick={() => setIsEditModalOpen(true)}
                className="relative w-36 h-36 sm:w-44 sm:h-44 border-2 border-outline bg-surface p-2 shadow-[4px_4px_0px_0px_#1a1a1a] cursor-pointer group"
                title="Click to Change Photo / Edit Profile"
              >
                <img 
                  className="w-full h-full object-cover grayscale contrast-125 border border-outline group-hover:scale-105 transition-transform" 
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                  alt={currentUser?.displayName || 'User Profile'}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white font-label text-xs uppercase font-bold gap-1 m-2 border border-outline">
                  <Camera className="w-6 h-6 text-primary-fixed" />
                  <span>Change Photo</span>
                </div>
                <div className="absolute -top-2 -right-2 bg-secondary text-on-primary font-label text-[10px] font-black uppercase px-2 py-0.5 border-2 border-outline shadow-[2px_2px_0px_0px_#1a1a1a] tracking-wider">
                  CURATOR LVL. 8
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-3 py-0.5 border border-outline font-label text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#ffcc00] whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> ACTIVE NODE
                </div>
              </div>
              <div className="mt-5 w-full flex items-center justify-between text-[11px] font-mono border-t-2 border-outline pt-2 text-on-surface-variant font-bold">
                <span>INDEX: ARCH-04</span>
                <span className="text-tertiary">LVL-ALPHA</span>
              </div>
            </div>

            {/* Name, Bio, Email & Quick Controls */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-2.5 py-0.5 bg-primary text-on-primary border border-outline text-[11px] font-label font-bold uppercase tracking-wider">
                    Celluloid Architecture
                  </span>
                  <span className="px-2.5 py-0.5 bg-tertiary text-on-tertiary border border-outline text-[11px] font-label font-bold uppercase tracking-wider">
                    Noir Specialist
                  </span>
                  <span className="font-mono text-xs font-bold text-on-surface-variant">@{currentUser?.username || 'alex_scifi'}</span>
                  <span className="font-mono text-[11px] bg-surface-container-high px-2 py-0.5 border border-outline text-on-surface-variant font-semibold">
                    ✉ {currentUser?.email || (currentUser?.username ? `${currentUser.username}@cinepulse.ai` : 'alex.chen@cinepulse.ai')}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black uppercase tracking-tight text-on-surface leading-none mb-2">
                  {currentUser?.displayName || 'Alex Chen'}
                </h1>
                
                <p className="font-label text-sm sm:text-base font-bold text-secondary uppercase tracking-widest mb-3">
                  {currentUser?.tagline || 'Lead Cinematographer & Sensory Vector Scout'}
                </p>

                <p className="font-body text-sm sm:text-base text-on-surface max-w-3xl leading-relaxed border-l-4 border-primary pl-4 py-1.5 bg-surface-container-low/60">
                  {currentUser?.bio || 'Deconstructing narrative entropy through high-contrast celluloid, brutalist acoustic scapes, and existential sci-fi noir. Viewing cinema as architectural spatial philosophy and structural resonance.'}
                </p>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                <div className="border-2 border-outline bg-surface-bright p-3 shadow-[3px_3px_0px_0px_#1a1a1a]">
                  <div className="text-[10px] font-label uppercase font-bold text-on-surface-variant tracking-wider">Cataloged</div>
                  <div className="text-3xl font-headline font-black text-on-surface leading-tight mt-1">
                    {Math.max(3, history?.length || 0)}
                  </div>
                  <div className="text-[10px] font-mono text-tertiary font-bold">FILMS LOGGED</div>
                </div>
                <div className="border-2 border-outline bg-surface-bright p-3 shadow-[3px_3px_0px_0px_#1a1a1a]">
                  <div className="text-[10px] font-label uppercase font-bold text-on-surface-variant tracking-wider">Cumulative</div>
                  <div className="text-3xl font-headline font-black text-on-surface leading-tight mt-1">
                    {Math.max(18, Math.round((history?.length || 0) * 2.2))}
                  </div>
                  <div className="text-[10px] font-mono text-on-surface-variant font-bold">SCREEN HOURS</div>
                </div>
                <div className="border-2 border-outline bg-primary-fixed p-3 shadow-[3px_3px_0px_0px_#1a1a1a]">
                  <div className="text-[10px] font-label uppercase font-bold text-on-primary-fixed tracking-wider">Coherence</div>
                  <div className="text-3xl font-headline font-black text-on-primary-fixed leading-tight mt-1">98.4%</div>
                  <div className="text-[10px] font-mono text-on-primary-fixed font-bold">HIGH SYNC</div>
                </div>
                <div className="border-2 border-outline bg-surface-bright p-3 shadow-[3px_3px_0px_0px_#1a1a1a]">
                  <div className="text-[10px] font-label uppercase font-bold text-on-surface-variant tracking-wider">Vault Picks</div>
                  <div className="text-3xl font-headline font-black text-secondary leading-tight mt-1">
                    {(watchlist?.length || 0) + (favorites?.length || 0)}
                  </div>
                  <div className="text-[10px] font-mono text-secondary font-bold">TIER S PICKS</div>
                </div>
              </div>              
              
              {/* Animated Pill Controls */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-5 py-2.5 bg-primary text-on-primary border-2 border-outline font-label text-xs uppercase font-bold tracking-wider rounded-full shadow-[3px_3px_0px_0px_#ffcc00] hover:bg-primary-fixed hover:text-on-primary-fixed hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer" 
                  id="btn-edit"
                >
                  <span className="material-symbols-outlined text-base">edit_note</span>
                  Edit Profile
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    setShareSuccess(true);
                    setTimeout(() => setShareSuccess(false), 2000);
                  }}
                  className="px-5 py-2.5 bg-surface-container-lowest text-on-surface border-2 border-outline font-label text-xs uppercase font-bold tracking-wider rounded-full shadow-[3px_3px_0px_0px_#1a1a1a] hover:bg-secondary hover:text-on-primary hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer" 
                  id="btn-share"
                >
                  <span className="material-symbols-outlined text-base">{shareSuccess ? 'check' : 'share'}</span>
                  {shareSuccess ? 'LINK COPIED!' : 'Share Profile'}
                </button>
                <button 
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-5 py-2.5 bg-primary-fixed text-on-primary-fixed border-2 border-outline font-label text-xs uppercase font-bold tracking-wider rounded-full shadow-[2px_2px_0px_0px_#1a1a1a] hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Write Review</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* All My Screening Reviews & Field Notes */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 mb-8">
        <div className="border-2 border-outline bg-surface-container-lowest p-6 sm:p-8 shadow-[6px_6px_0px_0px_#1a1a1a]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-outline pb-4 mb-6 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-secondary text-on-primary flex items-center justify-center font-bold text-sm border-2 border-outline shadow-[2px_2px_0px_#1a1a1a]">
                <span className="material-symbols-outlined text-lg">rate_review</span>
              </div>
              <div>
                <h3 className="font-headline font-black text-xl uppercase tracking-tight text-on-surface">
                  All My Reviews &amp; Screening Notes
                </h3>
                <p className="font-label text-xs uppercase font-bold text-on-surface-variant tracking-wider">
                  Personal Film Dossier
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-on-surface-variant bg-surface-container px-3 py-1.5 border-2 border-outline">
                {displayReviews.length} LOGGED REVIEWS
              </span>
              <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="px-4 py-2 bg-primary text-on-primary border-2 border-outline font-label text-xs uppercase font-bold tracking-wider hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_#ffcc00] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Write Review</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {displayReviews.length === 0 ? (
              <div className="border-2 border-dashed border-outline bg-surface p-8 sm:p-14 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-surface-container-high border-2 border-outline flex items-center justify-center mb-4 shadow-[3px_3px_0px_#1a1a1a]">
                  <span className="material-symbols-outlined text-secondary text-3xl">rate_review</span>
                </div>
                <h4 className="font-headline font-black text-lg uppercase tracking-tight text-on-surface mb-1">
                  No Reviews Written Yet
                </h4>
                <p className="font-body text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto mb-5 leading-relaxed">
                  You haven't published any screening reviews yet. Click below to write a review or rate films from their detail pages.
                </p>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-6 py-2.5 bg-primary text-on-primary border-2 border-outline font-label text-xs uppercase font-bold tracking-wider shadow-[3px_3px_0px_#ffcc00] hover:bg-primary-fixed hover:text-on-primary-fixed hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write Your First Review</span>
                </button>
              </div>
            ) : (
              displayReviews.map((entry) => (
                <div key={entry.id} className="p-5 border-2 border-outline bg-surface hover:bg-surface-bright transition-colors group relative shadow-[3px_3px_0px_0px_#1a1a1a]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      {entry.poster_path && (
                        <img 
                          src={entry.poster_path} 
                          alt="" 
                          className="w-10 h-14 object-cover border-2 border-outline shrink-0 shadow-[1px_1px_0px_#1a1a1a]" 
                        />
                      )}
                      <div>
                        <span 
                          onClick={() => entry.movieId && onSelectMovie && onSelectMovie(entry.movieId)}
                          className={`font-headline font-black text-base sm:text-lg text-on-surface ${entry.movieId ? 'cursor-pointer hover:text-secondary transition-colors underline decoration-outline decoration-2' : ''}`}
                        >
                          {entry.title?.toUpperCase()}
                        </span>
                        <span className="font-mono text-xs bg-primary text-on-primary px-2 py-0.5 ml-2 font-bold border border-outline">
                          {entry.year || '2024'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs text-secondary font-black bg-surface-container-high px-2 py-1 border border-outline">
                        {'★'.repeat(Math.min(5, Math.max(1, Math.round((entry.userRating || 10) / 2))))} ({entry.userRating || 10}/10)
                      </span>
                      <span className="text-outline-variant font-black">|</span>
                      <span className="font-mono text-[11px] text-on-surface-variant font-bold uppercase">
                        {entry.watchedAt ? new Date(entry.watchedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'RECENT LOG'}
                      </span>
                      {entry.id && (
                        <button 
                          onClick={() => deleteReview && deleteReview(entry.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-on-surface-variant hover:text-white hover:bg-secondary border border-transparent hover:border-outline ml-1 cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="font-body text-xs sm:text-sm text-on-surface leading-relaxed mb-4 pl-3 border-l-2 border-primary-fixed">
                    "{entry.reviewText}"
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-outline-variant">
                    <div className="flex flex-wrap gap-2 text-[10px] font-label font-bold">
                      {(entry.tags && entry.tags.length > 0 ? entry.tags : ['Curator Note']).map((tag, idx) => (
                        <span key={idx} className="bg-surface-container-high px-2 py-0.5 border border-outline uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {entry.movieId && onSelectMovie && (
                      <button
                        onClick={() => onSelectMovie(entry.movieId)}
                        className="text-xs font-label font-bold uppercase tracking-wider text-secondary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Film Deck</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setIsEditModalOpen(false)}
          className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-surface-container-lowest border-4 border-outline shadow-bauhaus-lg p-6 sm:p-8 font-body my-auto"
          >
            <div className="flex items-center justify-between border-b-2 border-outline pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-on-primary flex items-center justify-center font-bold text-sm border border-outline">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-headline font-black text-xl uppercase tracking-tight text-on-surface">
                    Edit Sensory Profile
                  </h2>
                  <p className="font-label text-xs uppercase font-bold text-secondary tracking-widest">
                    Curator Identity &amp; Aesthetic Vectors
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center border-2 border-outline bg-surface-container-low hover:bg-secondary hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                await updateProfile(editForm);
                setIsEditModalOpen(false);
              }}
              className="space-y-5"
            >
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label uppercase font-bold text-on-surface mb-1">
                    Curator Display Name
                  </label>
                  <input 
                    type="text" 
                    value={editForm.displayName} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                    required
                    className="w-full p-2.5 bg-surface border-2 border-outline text-sm font-headline font-bold focus:outline-none focus:border-primary"
                    placeholder="e.g. Alex Chen"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label uppercase font-bold text-on-surface mb-1">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    value={editForm.email} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2.5 bg-surface border-2 border-outline text-sm font-mono focus:outline-none focus:border-primary"
                    placeholder="e.g. alex.chen@cinepulse.ai"
                  />
                </div>
              </div>

              {/* Tagline / Role */}
              <div>
                <label className="block text-xs font-label uppercase font-bold text-on-surface mb-1">
                  Curator Title &amp; Vector Role
                </label>
                <input 
                  type="text" 
                  value={editForm.tagline} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, tagline: e.target.value }))}
                  className="w-full p-2.5 bg-surface border-2 border-outline text-sm font-label uppercase font-bold text-secondary focus:outline-none focus:border-primary"
                  placeholder="e.g. Lead Cinematographer & Sensory Vector Scout"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-label uppercase font-bold text-on-surface mb-1">
                  Bio &amp; Cinematic Philosophy
                </label>
                <textarea 
                  rows="3" 
                  value={editForm.bio} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full p-2.5 bg-surface border-2 border-outline text-xs sm:text-sm font-body focus:outline-none focus:border-primary leading-relaxed"
                  placeholder="Deconstructing narrative entropy through high-contrast celluloid..."
                />
              </div>

              {/* Profile Picture Upload from PC */}
              <div className="border-t-2 border-outline pt-4">
                <label className="block text-xs font-label uppercase font-bold text-on-surface mb-2">
                  Profile Picture
                </label>
                <div className="p-4 bg-surface border-2 border-outline flex flex-col sm:flex-row items-center gap-5 shadow-[2px_2px_0px_#1a1a1a]">
                  <div className="relative w-20 h-20 border-2 border-outline bg-surface-container shrink-0 shadow-[2px_2px_0px_#1a1a1a] overflow-hidden">
                    <img 
                      src={editForm.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover grayscale contrast-125" 
                    />
                  </div>
                  <div className="flex-1 w-full flex flex-col gap-2.5">
                    <div>
                      <p className="text-xs font-headline font-bold uppercase text-on-surface">
                        Upload Photo From Computer
                      </p>
                      <p className="text-[11px] font-body text-on-surface-variant mt-0.5">
                        Choose any image file from your PC (JPG, PNG, WEBP).
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-4 py-2 bg-primary text-on-primary border-2 border-outline font-label text-xs uppercase font-bold tracking-wider hover:bg-primary-fixed hover:text-on-primary-fixed shadow-[2px_2px_0px_#ffcc00] cursor-pointer inline-flex items-center gap-2 transition-all active:translate-x-0.5 active:translate-y-0.5">
                        <Camera className="w-4 h-4" />
                        <span>Choose Photo From PC</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (uploadEvent) => {
                                if (uploadEvent.target?.result) {
                                  setEditForm(prev => ({ ...prev, avatar: uploadEvent.target.result }));
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {editForm.avatar && (
                        <button
                          type="button"
                          onClick={() => setEditForm(prev => ({ ...prev, avatar: '' }))}
                          className="px-3 py-2 bg-surface-container-low border border-outline text-xs font-label uppercase font-bold text-on-surface hover:text-secondary transition-colors cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-outline">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 bg-surface-container-low border-2 border-outline font-label text-xs uppercase font-bold hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-on-primary border-2 border-outline font-label text-xs uppercase font-bold tracking-wider shadow-[3px_3px_0px_#ffcc00] hover:bg-primary-fixed hover:text-on-primary-fixed hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Sensory Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* WRITE REVIEW / FIELD NOTE MODAL */}
      {isReviewModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setIsReviewModalOpen(false)}
          className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-surface-container-lowest border-4 border-outline shadow-bauhaus-lg p-6 sm:p-8 font-body my-auto"
          >
            <div className="flex items-center justify-between border-b-2 border-outline pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary text-on-primary flex items-center justify-center font-bold text-sm border border-outline">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-headline font-black text-xl uppercase tracking-tight text-on-surface">
                    Log Screening Field Note
                  </h2>
                  <p className="font-label text-xs uppercase font-bold text-secondary tracking-widest">
                    Add to Cinema Deck Journal
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center border-2 border-outline bg-surface-container-low hover:bg-secondary hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newReview.title.trim()) return;
                await markAsWatched(
                  { id: 'film-' + Date.now(), title: newReview.title.trim(), year: newReview.year },
                  Number(newReview.rating),
                  newReview.reviewText.trim(),
                  newReview.tags
                );
                setNewReview({ title: '', year: '2024', rating: 10, reviewText: '', tags: ['Acoustic Immersion', 'Criterion Master'] });
                setIsReviewModalOpen(false);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-label uppercase font-bold text-on-surface mb-1">
                    Film Title
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newReview.title} 
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. OPPENHEIMER" 
                    className="w-full p-2.5 bg-surface border-2 border-outline text-sm font-headline font-black uppercase focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label uppercase font-bold text-on-surface mb-1">
                    Release Year
                  </label>
                  <input 
                    type="text" 
                    value={newReview.year} 
                    onChange={(e) => setNewReview(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2024" 
                    className="w-full p-2.5 bg-surface border-2 border-outline text-sm font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label uppercase font-bold text-on-surface mb-1">
                  Curator Rating ({newReview.rating}/10)
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={newReview.rating} 
                    onChange={(e) => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <span className="font-mono font-black text-sm text-secondary bg-surface-container px-2 py-1 border border-outline">
                    {newReview.rating}/10
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-label uppercase font-bold text-on-surface mb-1">
                  Field Notes / Critical Review
                </label>
                <textarea 
                  rows="3" 
                  required
                  value={newReview.reviewText} 
                  onChange={(e) => setNewReview(prev => ({ ...prev, reviewText: e.target.value }))}
                  placeholder="Deconstructing the temporal rhythm and spatial resonance..." 
                  className="w-full p-2.5 bg-surface border-2 border-outline text-xs sm:text-sm font-body focus:outline-none focus:border-primary leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-label uppercase font-bold text-on-surface mb-1">
                  Aesthetic Tags (comma separated)
                </label>
                <input 
                  type="text" 
                  value={newReview.tags.join(', ')} 
                  onChange={(e) => setNewReview(prev => ({ ...prev, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                  placeholder="Acoustic Horror, Framing Rigor, Criterion Master" 
                  className="w-full p-2.5 bg-surface border-2 border-outline text-xs font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-outline">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 bg-surface-container-low border-2 border-outline font-label text-xs uppercase font-bold hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary border-2 border-outline font-label text-xs uppercase font-bold tracking-wider shadow-[3px_3px_0px_#ffcc00] hover:bg-primary-fixed hover:text-on-primary-fixed hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Field Note</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
