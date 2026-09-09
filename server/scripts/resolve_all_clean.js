import fs from 'fs';

async function fetchTmdbPoster(title) {
  try {
    const url = 'https://www.themoviedb.org/search/movie?query=' + encodeURIComponent(title);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const regex = /\/t\/p\/[a-zA-Z0-9_]+\/([a-zA-Z0-9_\-\.]+\.(?:jpg|png|webp))/i;
    const match = regex.exec(html);
    if (match) {
      const poster = `https://image.tmdb.org/t/p/w500/${match[1]}`;
      // Verify poster returns 200
      const test = await fetch(poster, { method: 'HEAD' });
      if (test.ok) return poster;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

const titles = [
  "24", "Game Over", "No Smoking", "Bhool Bhulaiyaa", "Ugly", "Talvar",
  "Vikram Vedha", "A Wednesday!", "Hera Pheri", "Chhichhore", "Dil Chahta Hai",
  "Jab We Met", "Barfi!", "Munna Bhai M.B.B.S.", "Kumbalangi Nights", "Stree",
  "Chak De! India", "Soorarai Pottru", "Sita Ramam", "Sholay",
  "Chandu Champion", "Amar Singh Chamkila", "Por Thozhil", "Iratta",
  "Merry Christmas", "Fighter", "Leo", "Jailer"
];

async function run() {
  const resolved = {};
  for (const t of titles) {
    const p = await fetchTmdbPoster(t);
    if (p) {
      resolved[t] = p;
      console.log(`"${t}": "${p}",`);
    } else {
      console.log(`[FAILED] ${t}`);
    }
    await new Promise(r => setTimeout(r, 400));
  }
  fs.writeFileSync('resolved_clean.json', JSON.stringify(resolved, null, 2));
}

run();
