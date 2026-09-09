import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const curatedPath = path.join(__dirname, '../data/curatedMovies.json');
const cachePath = path.join(__dirname, '../data/peopleCache.json');

const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'));

// Load existing cache if any
let peopleCache = {};
if (fs.existsSync(cachePath)) {
  try {
    peopleCache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  } catch (e) {
    peopleCache = {};
  }
}

// Extract all unique people
const peopleSet = new Set();
curated.forEach(m => {
  if (m.director && typeof m.director === 'string') peopleSet.add(m.director.trim());
  if (Array.isArray(m.cast)) {
    m.cast.forEach(c => {
      const name = typeof c === 'string' ? c : c?.name;
      if (name) peopleSet.add(name.trim());
    });
  }
});

const peopleList = Array.from(peopleSet).filter(Boolean);
console.log(`Found ${peopleList.length} unique people. Existing cached: ${Object.keys(peopleCache).length}`);

// Batch fetch Wikipedia photos
async function fetchWikipediaPhoto(name) {
  if (peopleCache[name] && peopleCache[name].photo) {
    return peopleCache[name];
  }

  // Variations to try
  const queries = [
    name.replace(/ /g, '_'),
    `${name.replace(/ /g, '_')}_(actor)`,
    `${name.replace(/ /g, '_')}_(director)`,
    `${name.replace(/ /g, '_')}_(filmmaker)`
  ];

  for (const q of queries) {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'CinePulse/1.0 (contact@cinepulse.app)' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.thumbnail && data.thumbnail.source) {
          const entry = {
            name,
            photo: data.thumbnail.source,
            description: data.description || ''
          };
          peopleCache[name] = entry;
          return entry;
        }
      }
    } catch (err) {
      // Continue to next query variation
    }
  }

  peopleCache[name] = { name, photo: null, description: '' };
  return peopleCache[name];
}

async function run() {
  const batchSize = 15;
  let processed = 0;
  let success = 0;

  for (let i = 0; i < peopleList.length; i += batchSize) {
    const chunk = peopleList.slice(i, i + batchSize);
    await Promise.all(chunk.map(async (name) => {
      const res = await fetchWikipediaPhoto(name);
      if (res.photo) success++;
    }));
    processed += chunk.length;
    if (processed % 60 === 0 || processed === peopleList.length) {
      console.log(`Progress: ${processed}/${peopleList.length} processed (${success} photos found)`);
      fs.writeFileSync(cachePath, JSON.stringify(peopleCache, null, 2), 'utf8');
    }
    await new Promise(r => setTimeout(r, 60));
  }

  fs.writeFileSync(cachePath, JSON.stringify(peopleCache, null, 2), 'utf8');
  console.log(`Complete! Total cached with photos: ${Object.values(peopleCache).filter(p => p.photo).length} of ${peopleList.length}`);
}

run();
