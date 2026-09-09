async function test(q) {
  const url = 'https://www.themoviedb.org/search/movie?query=' + encodeURIComponent(q);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  const m = html.match(/\/t\/p\/[a-zA-Z0-9_]+\/([a-zA-Z0-9_\-\.]+\.(?:jpg|png|webp))/i);
  console.log(q, 'Match:', m ? m[1] : 'NONE');
}

async function run() {
  await test('Sholay');
  await test('Bhool Bhulaiyaa');
  await test('Vikram 2022');
  await test('Hera Pheri');
  await test('Chhichhore');
}
run();
