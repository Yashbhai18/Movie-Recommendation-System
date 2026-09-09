import https from 'https';
import { db } from '../db.js';

// Default public TMDB v3 API Key for instant out-of-the-box live search
const DEFAULT_TMDB_KEY = '844dba0bfd8f3a4f3799f6130ef9e335';

export function getTmdbApiKey() {
  return process.env.TMDB_API_KEY || db.getConfig().tmdbApiKey || DEFAULT_TMDB_KEY;
}

/**
 * Robust TMDB API requester using IPv4-first socket resolution and auto-retries.
 * Prevents Windows ECONNRESET / IPv6 drops against TMDB / CloudFront.
 */
export function tmdbRequest(endpoint, params = {}, retries = 3) {
  const apiKey = getTmdbApiKey();
  const queryParams = new URLSearchParams({
    api_key: apiKey,
    ...params
  });

  const url = `https://api.themoviedb.org/3/${endpoint.replace(/^\//, '')}?${queryParams.toString()}`;

  return new Promise((resolve, reject) => {
    function attempt(n) {
      const req = https.get(url, {
        family: 4, // Enforce IPv4 to avoid Windows ISP/CloudFront IPv6 resets
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CinePulse/2.0',
          'Accept': 'application/json'
        }
      }, (res) => {
        let rawData = '';
        res.on('data', chunk => rawData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(rawData);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve({ ok: true, status: res.statusCode, data: parsed });
            } else {
              resolve({ ok: false, status: res.statusCode, data: parsed, error: parsed.status_message || 'TMDB error' });
            }
          } catch (e) {
            resolve({ ok: false, status: res.statusCode, data: null, error: 'JSON parse error' });
          }
        });
      });

      req.on('timeout', () => {
        req.destroy();
        if (n < retries) {
          setTimeout(() => attempt(n + 1), 200);
        } else {
          reject(new Error('TMDB request timed out'));
        }
      });

      req.on('error', (err) => {
        if (n < retries) {
          setTimeout(() => attempt(n + 1), 200);
        } else {
          reject(err);
        }
      });
    }

    attempt(0);
  });
}

/**
 * Searches TMDB for movies, TV shows, and unrolls known_for from person matches.
 */
export async function searchTmdb(query, searchType = 'all') {
  let endpoint = 'search/multi';
  if (searchType === 'movie') endpoint = 'search/movie';
  if (searchType === 'tv') endpoint = 'search/tv';

  const res = await tmdbRequest(endpoint, {
    query,
    include_adult: 'false'
  });

  if (!res.ok || !res.data) {
    throw new Error(res.error || `TMDB returned status ${res.status}`);
  }

  const rawResults = res.data.results || [];
  const candidateItems = [];
  const seenIds = new Set();

  for (const item of rawResults) {
    if (!item) continue;

    // If item is a person (e.g., actor or athlete like "MS Dhoni")
    if (item.media_type === 'person') {
      if (Array.isArray(item.known_for)) {
        for (const k of item.known_for) {
          if (k && (k.media_type === 'movie' || k.media_type === 'tv')) {
            const key = `${k.media_type}_${k.id}`;
            if (!seenIds.has(key)) {
              seenIds.add(key);
              candidateItems.push(k);
            }
          }
        }
      }
      continue;
    }

    const mType = item.media_type || (searchType === 'tv' ? 'tv' : searchType === 'movie' ? 'movie' : (item.first_air_date ? 'tv' : 'movie'));
    if (searchType === 'movie' && mType !== 'movie') continue;
    if (searchType === 'tv' && mType !== 'tv') continue;

    const key = `${mType}_${item.id}`;
    if (!seenIds.has(key)) {
      seenIds.add(key);
      candidateItems.push({ ...item, media_type: mType });
    }
  }

  // Normalize into standard CinePulse card schema
  const normalized = candidateItems.map(m => {
    const mediaType = m.media_type || (m.first_air_date ? 'tv' : 'movie');
    const title = m.title || m.name || 'Untitled';
    const dateStr = m.release_date || m.first_air_date || null;
    const year = dateStr ? parseInt(dateStr.split('-')[0]) : null;

    return {
      id: m.id,
      title,
      media_type: mediaType,
      release_date: dateStr,
      year,
      vote_average: m.vote_average ? parseFloat(m.vote_average.toFixed(1)) : 0,
      vote_count: m.vote_count || 0,
      overview: m.overview || '',
      poster_path: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      backdrop_path: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : null,
      genre_ids: m.genre_ids || []
    };
  });

  // Relevance ranking: exact/starts-with title matches go first
  const cleanQ = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  normalized.sort((a, b) => {
    const cleanA = (a.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanB = (b.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    const exactA = cleanA === cleanQ ? 100 : cleanA.includes(cleanQ) ? 50 : 0;
    const exactB = cleanB === cleanQ ? 100 : cleanB.includes(cleanQ) ? 50 : 0;

    if (exactA !== exactB) return exactB - exactA;
    return (b.vote_average || 0) - (a.vote_average || 0);
  });

  return normalized;
}

/**
 * Fetches full details, credits, and video trailers for a movie or series.
 */
export async function getTmdbDetails(id, mediaType = 'movie') {
  const type = mediaType === 'tv' ? 'tv' : 'movie';

  // 1. Fetch main object
  const mainRes = await tmdbRequest(`${type}/${id}`);
  if (!mainRes.ok || !mainRes.data) {
    // If movie failed, try tv or vice-versa
    const altType = type === 'movie' ? 'tv' : 'movie';
    const altRes = await tmdbRequest(`${altType}/${id}`);
    if (!altRes.ok || !altRes.data) {
      throw new Error(`Failed to load details for ${id}`);
    }
    return buildDetailPayload(altRes.data, altType);
  }

  return buildDetailPayload(mainRes.data, type);
}

async function buildDetailPayload(data, type) {
  const id = data.id;

  // 2. Fetch credits, videos & India watch providers sequentially
  let creditsData = { cast: [], crew: [] };
  let videosData = { results: [] };
  let watchProvidersIndia = null;

  try {
    const cRes = await tmdbRequest(`${type}/${id}/credits`);
    if (cRes.ok && cRes.data) creditsData = cRes.data;
  } catch (e) {
    // ignore
  }

  try {
    const vRes = await tmdbRequest(`${type}/${id}/videos`);
    if (vRes.ok && vRes.data) videosData = vRes.data;
  } catch (e) {
    // ignore
  }

  try {
    const wpRes = await tmdbRequest(`${type}/${id}/watch/providers`);
    if (wpRes.ok && wpRes.data?.results?.IN) {
      const inData = wpRes.data.results.IN;
      watchProvidersIndia = {
        link: inData.link || `https://www.themoviedb.org/${type}/${id}/watch?locale=IN`,
        stream: (inData.flatrate || []).map(p => ({
          id: p.provider_id,
          name: p.provider_name,
          logo_path: p.logo_path ? `https://image.tmdb.org/t/p/original${p.logo_path}` : null,
          type: 'Subscription'
        })),
        rent: (inData.rent || []).map(p => ({
          id: p.provider_id,
          name: p.provider_name,
          logo_path: p.logo_path ? `https://image.tmdb.org/t/p/original${p.logo_path}` : null,
          type: 'Rent (₹)'
        })),
        buy: (inData.buy || []).map(p => ({
          id: p.provider_id,
          name: p.provider_name,
          logo_path: p.logo_path ? `https://image.tmdb.org/t/p/original${p.logo_path}` : null,
          type: 'Buy (₹)'
        }))
      };
    }
  } catch (e) {
    // ignore
  }

  // Find trailer YouTube key
  let trailerKey = null;
  if (videosData.results?.length) {
    const trailer = videosData.results.find(v => v.site === 'YouTube' && v.type === 'Trailer') ||
                    videosData.results.find(v => v.site === 'YouTube' && v.type === 'Teaser') ||
                    videosData.results.find(v => v.site === 'YouTube');
    if (trailer) trailerKey = trailer.key;
  }

  // Director / Creator
  let director = null;
  if (type === 'tv') {
    if (data.created_by?.length) {
      director = data.created_by.map(c => c.name).join(', ');
    }
  }
  if (!director && creditsData.crew?.length) {
    const dir = creditsData.crew.find(c => c.job === 'Director');
    if (dir) director = dir.name;
  }

  // Cast
  const cast = (creditsData.cast || []).slice(0, 16).map(c => ({
    name: c.name,
    character: c.character || 'Cast',
    profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w300${c.profile_path}` : null
  }));

  const genres = (data.genres || []).map(g => g.name);
  const releaseDate = data.release_date || data.first_air_date || null;
  const year = releaseDate ? parseInt(releaseDate.split('-')[0]) : null;

  return {
    id: data.id,
    title: data.title || data.name || 'Untitled',
    tagline: data.tagline || '',
    overview: data.overview || '',
    media_type: type,
    release_date: releaseDate,
    year,
    runtime: data.runtime || (data.episode_run_time?.[0]) || null,
    number_of_seasons: data.number_of_seasons || null,
    number_of_episodes: data.number_of_episodes || null,
    vote_average: data.vote_average ? parseFloat(data.vote_average.toFixed(1)) : 0,
    vote_count: data.vote_count || 0,
    genres,
    genre_ids: data.genres?.map(g => g.id) || [],
    director,
    cast,
    trailer_key: trailerKey,
    poster_path: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
    backdrop_path: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null,
    status: data.status,
    origin_country: data.origin_country || (data.production_countries?.map(c => c.name)) || [],
    watch_providers_india: watchProvidersIndia
  };
}
