async function getById(title, id) {
  try {
    const url = 'https://www.themoviedb.org/movie/' + id;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const html = await res.text();
    const regex = /\/t\/p\/w\d+_and_h\d+_face\/([a-zA-Z0-9_\-\.]+\.(?:jpg|png|webp))/gi;
    const match = regex.exec(html);
    if (match) {
      console.log(title, '=> https://image.tmdb.org/t/p/w500/' + match[1]);
      return 'https://image.tmdb.org/t/p/w500/' + match[1];
    }
    const regex2 = /\/t\/p\/w\d+\/([a-zA-Z0-9_\-\.]+\.(?:jpg|png|webp))/gi;
    const match2 = regex2.exec(html);
    if (match2) {
      console.log(title, '=> https://image.tmdb.org/t/p/w500/' + match2[1]);
      return 'https://image.tmdb.org/t/p/w500/' + match2[1];
    }
    console.log(title, 'not found');
  } catch (e) {
    console.error(title, e.message);
  }
}

async function run() {
  await getById('Maharaja', '1118224');
  await getById('Stree 2', '1112426');
  await getById('Deadpool & Wolverine', '533535');
  await getById('Inside Out 2', '1022789');
  await getById('Dune Part Two', '693134');
  await getById('Oppenheimer', '872585');
  await getById('Salaar Ceasefire', '848326');
  await getById('Laapataa Ladies', '1168007');
  await getById('Article 370', '1241982');
  await getById('Chandu Champion', '1148011');
}
run();
