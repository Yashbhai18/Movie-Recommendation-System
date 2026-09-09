import fs from 'fs';

const targetTitles = [
  { title: "Stree 2", year: 2024, query: "stree 2 2024 tmdb" },
  { title: "Jawan", year: 2023, query: "jawan 2023 tmdb" },
  { title: "Animal", year: 2023, query: "animal 2023 ranbir kapoor tmdb" },
  { title: "Maharaja", year: 2024, query: "maharaja 2024 vijay sethupathi tmdb" },
  { title: "Manjummel Boys", year: 2024, query: "manjummel boys 2024 tmdb" },
  { title: "Aavesham", year: 2024, query: "aavesham 2024 fahadh faasil tmdb" },
  { title: "Bramayugam", year: 2024, query: "bramayugam 2024 mammootty tmdb" },
  { title: "Kill", year: 2024, query: "kill 2024 lakshya tmdb" },
  { title: "Chandu Champion", year: 2024, query: "chandu champion 2024 karthik aaryan tmdb" },
  { title: "Salaar: Part 1 - Ceasefire", year: 2023, query: "salaar ceasefire 2023 tmdb" },
  { title: "Deadpool & Wolverine", year: 2024, query: "deadpool wolverine 2024 tmdb" },
  { title: "Inside Out 2", year: 2024, query: "inside out 2 2024 tmdb" },
  { title: "Dune: Part Two", year: 2024, query: "dune part two 2024 tmdb" },
  { title: "Oppenheimer", year: 2023, query: "oppenheimer 2023 tmdb" },
  { title: "Laapataa Ladies", year: 2024, query: "laapataa ladies 2024 tmdb" },
  { title: "Amar Singh Chamkila", year: 2024, query: "amar singh chamkila 2024 tmdb" },
  { title: "Article 370", year: 2024, query: "article 370 2024 tmdb" },
  { title: "Por Thozhil", year: 2023, query: "por thozhil 2023 tmdb" },
  { title: "Iratta", year: 2023, query: "iratta 2023 tmdb" },
  { title: "Merry Christmas", year: 2024, query: "merry christmas 2024 sriram raghavan tmdb" }
];

async function getPoster(item) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(item.query)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    const m = html.match(/themoviedb\.org\/movie\/(\d+)/);
    if (m) {
      const id = m[1];
      const pageRes = await fetch(`https://www.themoviedb.org/movie/${id}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      const pageHtml = await pageRes.text();
      const imgMatch = pageHtml.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
      if (imgMatch && imgMatch[1]) {
        const poster = imgMatch[1].replace('media.themoviedb.org', 'image.tmdb.org').replace(/\/t\/p\/w\d+\//, '/t/p/w500/');
        return { id, poster };
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

async function run() {
  const results = {};
  for (const item of targetTitles) {
    const r = await getPoster(item);
    results[item.title] = r;
    console.log(`${item.title}:`, r ? r.poster : 'FAILED');
    // small sleep
    await new Promise(res => setTimeout(res, 300));
  }
  fs.writeFileSync('recent_posters.json', JSON.stringify(results, null, 2));
}

run();
