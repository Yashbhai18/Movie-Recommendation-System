import fs from 'fs';

const titlesToSearch = [
  { key: "Lucia", q: "Lucia 2013" },
  { key: "24", q: "24 Suriya 2016" },
  { key: "Game Over", q: "Game Over 2019 Taapsee" },
  { key: "No Smoking", q: "No Smoking 2007" },
  { key: "Bhool Bhulaiyaa", q: "Bhool Bhulaiyaa 2007" },
  { key: "Kalki 2898 AD", q: "Kalki 2898 AD" },
  { key: "Ugly", q: "Ugly 2013 Anurag" },
  { key: "Talvar", q: "Talvar 2015" },
  { key: "Vikram", q: "Vikram 2022" },
  { key: "Kaithi", q: "Kaithi 2019" },
  { key: "Vikram Vedha", q: "Vikram Vedha 2017" },
  { key: "A Wednesday!", q: "A Wednesday 2008" },
  { key: "Hera Pheri", q: "Hera Pheri 2000" },
  { key: "Chhichhore", q: "Chhichhore 2019" },
  { key: "Dil Chahta Hai", q: "Dil Chahta Hai 2001" },
  { key: "Jab We Met", q: "Jab We Met 2007" },
  { key: "Barfi!", q: "Barfi 2012" },
  { key: "Munna Bhai M.B.B.S.", q: "Munna Bhai MBBS 2003" },
  { key: "Kumbalangi Nights", q: "Kumbalangi Nights 2019" },
  { key: "Stree", q: "Stree 2018" },
  { key: "Chak De! India", q: "Chak De India 2007" },
  { key: "Soorarai Pottru", q: "Soorarai Pottru 2020" },
  { key: "Sita Ramam", q: "Sita Ramam 2022" },
  { key: "Masaan", q: "Masaan 2015" },
  { key: "Sholay", q: "Sholay 1975" },
  { key: "Pather Panchali", q: "Pather Panchali 1955" },
  { key: "K.G.F: Chapter 1", q: "KGF Chapter 1" },
  { key: "Chandu Champion", q: "Chandu Champion 2024" },
  { key: "Amar Singh Chamkila", q: "Amar Singh Chamkila 2024" },
  { key: "Por Thozhil", q: "Por Thozhil 2023" },
  { key: "Iratta", q: "Iratta 2023" },
  { key: "Merry Christmas", q: "Merry Christmas 2024" },
  { key: "Fighter", q: "Fighter 2024 Hrithik" },
  { key: "Leo", q: "Leo 2023 Vijay" },
  { key: "Jailer", q: "Jailer 2023 Rajinikanth" }
];

async function fetchPoster(q) {
  try {
    const url = 'https://www.themoviedb.org/search/movie?query=' + encodeURIComponent(q);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const regex = /\/t\/p\/[a-zA-Z0-9_]+\/([a-zA-Z0-9_\-\.]+\.(?:jpg|png|webp))/i;
    const match = regex.exec(html);
    if (match) {
      return `https://image.tmdb.org/t/p/w500/${match[1]}`;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

async function run() {
  const result = {};
  for (const item of titlesToSearch) {
    const p = await fetchPoster(item.q);
    if (p) {
      result[item.key] = p;
      console.log(`"${item.key}": "${p}",`);
    } else {
      console.log(`[FAILED] ${item.key}`);
    }
    await new Promise(res => setTimeout(res, 350));
  }
  fs.writeFileSync('resolved_tmdb.json', JSON.stringify(result, null, 2));
  console.log('Saved resolved_tmdb.json successfully!');
}

run();
