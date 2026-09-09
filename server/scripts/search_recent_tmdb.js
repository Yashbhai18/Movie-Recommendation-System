async function findTmdbId(title, year) {
  try {
    const q = `${title} ${year || ''} movie themoviedb`;
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const match = html.match(/themoviedb\.org\/movie\/(\d+)/);
    if (match) {
      const id = match[1];
      const pageRes = await fetch(`https://www.themoviedb.org/movie/${id}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      if (pageRes.ok) {
        const pageHtml = await pageRes.text();
        const imgMatch = pageHtml.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
        if (imgMatch && imgMatch[1]) {
          let poster = imgMatch[1].replace('media.themoviedb.org', 'image.tmdb.org').replace(/\/t\/p\/w\d+\//, '/t/p/w500/');
          return { id, poster };
        }
      }
    }
  } catch (e) {
    console.error(title, e.message);
  }
  return null;
}

async function run() {
  const titles = [
    { title: '12th Fail', year: '2023' },
    { title: 'Jai Bhim', year: '2021' },
    { title: 'Stree 2', year: '2024' },
    { title: 'Jawan', year: '2023' },
    { title: 'Animal', year: '2023' },
    { title: 'Maharaja', year: '2024' },
    { title: 'Manjummel Boys', year: '2024' },
    { title: 'Aavesham', year: '2024' },
    { title: 'Bramayugam', year: '2024' },
    { title: 'Kill', year: '2024' },
    { title: 'Chandu Champion', year: '2024' },
    { title: 'Salaar Part 1 Ceasefire', year: '2023' },
    { title: 'Deadpool & Wolverine', year: '2024' },
    { title: 'Inside Out 2', year: '2024' },
    { title: 'Dune Part Two', year: '2024' },
    { title: 'Oppenheimer', year: '2023' }
  ];

  for (const item of titles) {
    const res = await findTmdbId(item.title, item.year);
    console.log(`"${item.title}": ${JSON.stringify(res)},`);
  }
}

run();
