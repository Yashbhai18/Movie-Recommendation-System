async function searchTmdb(title, query) {
  try {
    const url = 'https://www.themoviedb.org/search/movie?query=' + encodeURIComponent(query || title);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const regex = /\/t\/p\/w\d+_and_h\d+_face\/([a-zA-Z0-9_\-\.]+\.(?:jpg|png|webp))/gi;
    const match = regex.exec(html);
    if (match) {
      const poster = `https://image.tmdb.org/t/p/w500/${match[1]}`;
      console.log(`"${title}": "${poster}",`);
      return poster;
    }
  } catch (e) {
    //
  }
  return null;
}

async function run() {
  const items = [
    { title: "Talaash: The Answer Lies Within", query: "Talaash" },
    { title: "13B: Fear Has a New Address", query: "13B" },
    { title: "24", query: "24 Suriya 2016" },
    { title: "Badla", query: "Badla 2019" },
    { title: "Game Over", query: "Game Over 2019 Taapsee" },
    { title: "No Smoking", query: "No Smoking 2007 Anurag" },
    { title: "Bhool Bhulaiyaa", query: "Bhool Bhulaiyaa 2007" },
    { title: "Ugly", query: "Ugly Anurag Kashyap 2013" },
    { title: "Talvar", query: "Talvar 2015 Irrfan" },
    { title: "Vikram", query: "Vikram 2022 Kamal Haasan" },
    { title: "Kaithi", query: "Kaithi Karthi 2019" },
    { title: "Vikram Vedha", query: "Vikram Vedha 2017 Madhavan" },
    { title: "A Wednesday!", query: "A Wednesday 2008" },
    { title: "Hera Pheri", query: "Hera Pheri 2000" },
    { title: "Chhichhore", query: "Chhichhore 2019" },
    { title: "Dil Chahta Hai", query: "Dil Chahta Hai" },
    { title: "Jab We Met", query: "Jab We Met" },
    { title: "Barfi!", query: "Barfi 2012 Ranbir" },
    { title: "Munna Bhai M.B.B.S.", query: "Munna Bhai MBBS 2003" },
    { title: "Kumbalangi Nights", query: "Kumbalangi Nights" },
    { title: "Chak De! India", query: "Chak De India 2007" },
    { title: "Soorarai Pottru", query: "Soorarai Pottru 2020" },
    { title: "Sita Ramam", query: "Sita Ramam Dulquer" },
    { title: "Masaan", query: "Masaan Vicky Kaushal" },
    { title: "Sholay", query: "Sholay 1975" },
    { title: "K.G.F: Chapter 1", query: "KGF Chapter 1 2018" },
    { title: "Lucia", query: "Lucia 2013 Kannada" }
  ];

  for (const item of items) {
    await searchTmdb(item.title, item.query);
    await new Promise(r => setTimeout(r, 250));
  }
}

run();
