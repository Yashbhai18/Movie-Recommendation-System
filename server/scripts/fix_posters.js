import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../data/curatedMovies.json');
const movies = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

async function checkUrl(url) {
  if (!url) return false;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

async function fetchTmdbPoster(movieId) {
  try {
    const url = `https://www.themoviedb.org/movie/${movieId}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (match && match[1]) {
      let poster = match[1];
      poster = poster.replace('media.themoviedb.org', 'image.tmdb.org');
      // Ensure w500 size
      poster = poster.replace(/\/t\/p\/w\d+\//, '/t/p/w500/');
      const isValid = await checkUrl(poster);
      if (isValid) return poster;
    }
  } catch (err) {
    console.error(`Error fetching TMDB for ${movieId}:`, err.message);
  }
  return null;
}

// Fallback search via Wikipedia summary API
async function fetchWikiPoster(title, year) {
  try {
    const searchTerms = [
      `${title}_(film)`,
      `${title}_(${year}_film)`,
      title.replace(/\s+/g, '_')
    ];
    for (const term of searchTerms) {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'CinePulseApp/1.0 (movie@pulse.org)' }
      });
      if (res.ok) {
        const data = await res.json();
        const img = data.originalimage?.source || data.thumbnail?.source;
        if (img) {
          const cleanImg = img.split('?')[0];
          const isValid = await checkUrl(cleanImg);
          if (isValid) return cleanImg;
        }
      }
    }
  } catch (err) {
    console.error(`Error fetching Wiki for ${title}:`, err.message);
  }
  return null;
}

async function fixAll() {
  console.log(`Checking ${movies.length} movies...`);
  let fixedCount = 0;

  for (let i = 0; i < movies.length; i++) {
    const m = movies[i];
    const isWorking = await checkUrl(m.poster_path);
    if (isWorking) {
      console.log(`[OK] ${m.title}`);
      continue;
    }

    console.log(`[BROKEN] ${m.title} (${m.id}) -> Fetching replacement...`);
    let newPoster = await fetchTmdbPoster(m.id);
    if (!newPoster) {
      console.log(`  Trying Wikipedia for ${m.title}...`);
      newPoster = await fetchWikiPoster(m.title, m.year);
    }

    if (newPoster) {
      console.log(`  -> FIXED ${m.title}: ${newPoster}`);
      m.poster_path = newPoster;
      fixedCount++;
    } else {
      console.warn(`  -> FAILED to find poster for ${m.title}`);
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(movies, null, 2), 'utf-8');
  console.log(`\nCOMPLETED: Fixed ${fixedCount} movie posters. Saved to curatedMovies.json.`);
}

fixAll();
