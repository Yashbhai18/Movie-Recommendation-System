const BASE_URL = '/api';

export async function fetchApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`API error at ${endpoint}:`, err);
    throw err;
  }
}

// In-memory client caching for instant UI responses
const clientRecommendCache = new Map();
const clientDetailsCache = new Map();

// Movies
export const getTrendingMovies = () => fetchApi('/movies/trending');
export const getMarvelMovies = () => fetchApi('/movies/marvel');
export const searchMovies = (query, type = 'all') =>
  fetchApi(`/movies/search?q=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`);

export const getMovieDetails = async (id, type = null) => {
  const cacheKey = type ? `${type}_${id}` : String(id);
  if (clientDetailsCache.has(cacheKey)) {
    return clientDetailsCache.get(cacheKey);
  }
  const endpoint = `/movies/details/${id}${type ? `?type=${encodeURIComponent(type)}` : ''}`;
  const data = await fetchApi(endpoint);
  clientDetailsCache.set(cacheKey, data);
  return data;
};

export const getGenres = () => fetchApi('/movies/genres');

// Recommendations with instant client-side memoization
export const getMoodContextRecommendations = async (mood, context, limit = 40, mediaType = 'movie', genres = []) => {
  const normalizedType = (mediaType || 'movie').toLowerCase().startsWith('tv') ? 'tv' : 'movie';
  const genresStr = Array.isArray(genres) && genres.length > 0 ? [...genres].sort().join(',') : context.toLowerCase();
  const key = `${mood.toLowerCase()}__${genresStr}__${limit}__${normalizedType}`;
  if (clientRecommendCache.has(key)) {
    return clientRecommendCache.get(key);
  }
  const data = await fetchApi('/recommend/mood-context', {
    method: 'POST',
    body: JSON.stringify({ mood, context, limit, mediaType: normalizedType, genres })
  });
  // Client-side guard: enforce exact media_type matches
  if (data && Array.isArray(data.results)) {
    data.results = data.results.filter(m => {
      if (!m) return false;
      if (normalizedType === 'tv') return m.media_type === 'tv';
      return !m.media_type || m.media_type === 'movie';
    });
  }
  clientRecommendCache.set(key, data);
  return data;
};

export const getSurpriseRecommendation = (userId, excludeIds = [], options = {}) =>
  fetchApi('/recommend/surprise', {
    method: 'POST',
    body: JSON.stringify({ userId, excludeIds, ...options })
  });

// Auth & Profiles
export const getDemoProfiles = () => fetchApi('/auth/profiles');
export const loginUser = (username, password) =>
  fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
export const registerUser = (username, password, displayName) =>
  fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, displayName })
  });
export const getUser = (userId) => fetchApi(`/auth/user/${userId}`);
export const updateUserProfile = (userId, data) =>
  fetchApi(`/auth/user/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

// User lists
export const getWatchlist = (userId) => fetchApi(`/auth/user/${userId}/watchlist`);
export const addToWatchlist = (userId, movie) =>
  fetchApi(`/auth/user/${userId}/watchlist`, {
    method: 'POST',
    body: JSON.stringify({ movie })
  });
export const removeFromWatchlist = (userId, movieId) =>
  fetchApi(`/auth/user/${userId}/watchlist/${movieId}`, {
    method: 'DELETE'
  });

export const getFavorites = (userId) => fetchApi(`/auth/user/${userId}/favorites`);
export const toggleFavorite = (userId, movie) =>
  fetchApi(`/auth/user/${userId}/favorites`, {
    method: 'POST',
    body: JSON.stringify({ movie })
  });

export const getHistory = (userId) => fetchApi(`/auth/user/${userId}/history`);
export const recordWatched = (userId, movie, rating, reviewText = '', tags = []) =>
  fetchApi(`/auth/user/${userId}/history`, {
    method: 'POST',
    body: JSON.stringify({ movie, rating, reviewText, tags })
  });
export const deleteHistoryItem = (userId, historyId) =>
  fetchApi(`/auth/user/${userId}/history/${historyId}`, {
    method: 'DELETE'
  });

// TMDB Key Config
export const getTmdbConfig = () => fetchApi('/auth/config/tmdb');
export const setTmdbConfig = (apiKey) =>
  fetchApi('/auth/config/tmdb', {
    method: 'POST',
    body: JSON.stringify({ apiKey })
  });
