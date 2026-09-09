import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, '../data/curatedMovies.json');
const csvPath = path.join(__dirname, '../../movies.csv');

let catalog = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
const existingTitles = new Set(catalog.map(m => (m.title || '').toLowerCase().trim()));

// Helper to verify URL returns 200 OK
async function verifyPoster(url) {
  if (!url) return null;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (res.ok) return url;
  } catch (e) {
    // ignore
  }
  return null;
}

// Fallback search TMDB web for poster if needed
async function fetchTmdbPoster(query, isTv = true) {
  try {
    const type = isTv ? 'tv' : 'movie';
    const url = `https://www.themoviedb.org/search/${type}?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    if (res.ok) {
      const html = await res.text();
      const match = html.match(/\/t\/p\/[a-zA-Z0-9_]+\/([a-zA-Z0-9_\-\.]+\.(?:jpg|png|webp))/i);
      if (match) {
        const poster = `https://image.tmdb.org/t/p/w500/${match[1]}`;
        const valid = await verifyPoster(poster);
        if (valid) return poster;
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

const tvShows = [
  // 1. Tense / Thrilling / Dark
  {
    id: 1396,
    title: "Breaking Bad",
    tagline: "Remember my name.",
    year: 2008,
    release_date: "2008-01-20",
    vote_average: 8.9,
    vote_count: 14200,
    runtime: 47,
    genres: ["Drama", "Crime", "Thriller"],
    genre_ids: [18, 80, 53],
    director: "Vince Gilligan",
    cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn", "Dean Norris", "Giancarlo Esposito"],
    overview: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's financial future.",
    poster_path: "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    trailer_key: "HhesaQXLuRY",
    country: "United States",
    original_language: "en",
    media_type: "tv",
    keywords: ["drugs", "meth", "walter white", "chemistry", "heisenberg", "cartel", "dark", "tense", "crime", "masterpiece"]
  },
  {
    id: 60059,
    title: "Better Call Saul",
    tagline: "It's all good, man.",
    year: 2015,
    release_date: "2015-02-08",
    vote_average: 8.7,
    vote_count: 5100,
    runtime: 50,
    genres: ["Crime", "Drama"],
    genre_ids: [80, 18],
    director: "Vince Gilligan, Peter Gould",
    cast: ["Bob Odenkirk", "Rhea Seehorn", "Jonathan Banks", "Michael McKean", "Patrick Fabian"],
    overview: "Six years before he begins representing Walter White, small-time attorney Jimmy McGill transforms into the morally conflicted, criminal defense lawyer known as Saul Goodman.",
    poster_path: "https://image.tmdb.org/t/p/w500/fC2HDm5t0kHap79T1mWvys422Zs.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/hPea3Qy5Gd6Og40RixRhQwEvneL.jpg",
    trailer_key: "HN4oydykJFc",
    country: "United States",
    original_language: "en",
    media_type: "tv",
    keywords: ["lawyer", "saul goodman", "jimmy mcgill", "cartel", "legal drama", "dark", "crime", "masterpiece"]
  },
  {
    id: 1399,
    title: "Game of Thrones",
    tagline: "Winter is coming.",
    year: 2011,
    release_date: "2011-04-17",
    vote_average: 8.4,
    vote_count: 23500,
    runtime: 60,
    genres: ["Sci-Fi & Fantasy", "Drama", "Action & Adventure"],
    genre_ids: [10765, 18, 10759],
    director: "David Benioff, D.B. Weiss",
    cast: ["Emilia Clarke", "Kit Harington", "Peter Dinklage", "Lena Headey", "Nikolaj Coster-Waldau"],
    overview: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war, while a very ancient evil awakens in the farthest north.",
    poster_path: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/suopoADq0k8YZr4dQXcU6p09YqE.jpg",
    trailer_key: "KPLWWIOCOOQ",
    country: "United States",
    original_language: "en",
    media_type: "tv",
    keywords: ["dragons", "westeros", "throne", "medieval", "betrayal", "epic", "dark", "tense-thrilling", "fantasy"]
  },
  {
    id: 66732,
    title: "Stranger Things",
    tagline: "Every ending has a beginning.",
    year: 2016,
    release_date: "2016-07-15",
    vote_average: 8.6,
    vote_count: 17200,
    runtime: 55,
    genres: ["Sci-Fi & Fantasy", "Drama", "Mystery"],
    genre_ids: [10765, 18, 9648],
    director: "The Duffer Brothers",
    cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder", "David Harbour", "Gaten Matarazzo"],
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    poster_path: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    trailer_key: "b9EkMc79ZSU",
    country: "United States",
    original_language: "en",
    media_type: "tv",
    keywords: ["1980s", "nostalgic", "retro", "telepathic", "upside down", "demogorgon", "friendship", "mind-bending"]
  },
  {
    id: 87108,
    title: "Chernobyl",
    tagline: "What is the cost of lies?",
    year: 2019,
    release_date: "2019-05-06",
    vote_average: 8.7,
    vote_count: 6200,
    runtime: 60,
    genres: ["Drama", "History"],
    genre_ids: [18, 36],
    director: "Johan Renck, Craig Mazin",
    cast: ["Jared Harris", "Stellan Skarsgård", "Emily Watson", "Paul Ritter", "Jessie Buckley"],
    overview: "The true story of one of the worst man-made catastrophes in history: the catastrophic nuclear accident at Chernobyl in 1986 and the brave men and women who sacrificed everything to save Europe from disaster.",
    poster_path: "https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/uL6Ad12W08L14DbtO2b7T0N69vQ.jpg",
    trailer_key: "s9APLXM9Ei8",
    country: "United States",
    original_language: "en",
    media_type: "tv",
    keywords: ["nuclear disaster", "historical", "soviet union", "radiation", "sacrifice", "heartbreaking", "tense-thrilling", "masterpiece"]
  },
  {
    id: 100088,
    title: "The Last of Us",
    tagline: "When you're lost in the darkness, look for the light.",
    year: 2023,
    release_date: "2023-01-15",
    vote_average: 8.6,
    vote_count: 5100,
    runtime: 58,
    genres: ["Drama", "Sci-Fi & Fantasy", "Action & Adventure"],
    genre_ids: [18, 10765, 10759],
    director: "Craig Mazin, Neil Druckmann",
    cast: ["Pedro Pascal", "Bella Ramsey", "Gabriel Luna", "Anna Torv", "Nick Offerman"],
    overview: "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone across a ravaged America.",
    poster_path: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2V7JMrRI.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/9JvJbspTdQ51gqW8w6qf2nJp0qP.jpg",
    trailer_key: "uLtkt8BonwM",
    country: "United States",
    original_language: "en",
    media_type: "tv",
    keywords: ["post-apocalyptic", "fungus", "survival", "father daughter bond", "heartbreaking", "tense-thrilling", "action"]
  },
  {
    id: 76479,
    title: "The Boys",
    tagline: "Never meet your heroes.",
    year: 2019,
    release_date: "2019-07-26",
    vote_average: 8.5,
    vote_count: 10100,
    runtime: 60,
    genres: ["Sci-Fi & Fantasy", "Action & Adventure", "Comedy"],
    genre_ids: [10765, 10759, 35],
    director: "Eric Kripke",
    cast: ["Karl Urban", "Jack Quaid", "Antony Starr", "Erin Moriarty", "Dominique McElligott"],
    overview: "A fun and irreverent take on what happens when superheroes—who are as popular as celebrities, as influential as politicians, and as revered as gods—abuse their superpowers rather than use them for good.",
    poster_path: "https://image.tmdb.org/t/p/w500/7Ns6tO3aYjppFyNJPy2Fd5JwUpC.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/mGVrXeIehIgAvFI7OcmGhFsEGee.jpg",
    trailer_key: "06rueu_fh30",
    country: "United States",
    original_language: "en",
    media_type: "tv",
    keywords: ["homelander", "butcher", "superhero satire", "gory", "dark comedy", "action", "dark", "tense-thrilling"]
  },

  // 2. Feel-Good / Funny Comedy
  {
    id: 97546,
    title: "Ted Lasso",
    tagline: "Kindness makes a comeback.",
    year: 2020,
    release_date: "2020-08-14",
    vote_average: 8.5,
    vote_count: 1600,
    runtime: 35,
    genres: ["Comedy", "Drama"],
    genre_ids: [35, 18],
    director: "Bill Lawrence, Jason Sudeikis",
    cast: ["Jason Sudeikis", "Hannah Waddingham", "Brett Goldstein", "Juno Temple", "Brendan Hunt"],
    overview: "An American college football coach is hired to manage a British soccer team—what he lacks in soccer knowledge, he makes up for with optimism, biscuits, and resolute determination.",
    poster_path: "https://image.tmdb.org/t/p/w500/5fhZdwPmsUmHgQaGXmsNE57l8HG.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/wNk5wU9b4s8qUoXQzV5G8QWpG8m.jpg",
    trailer_key: "3u7EIxAz4ZA",
    country: "United States",
    original_language: "en",
    media_type: "tv",
    keywords: ["wholesome", "optimism", "football", "soccer", "friendship", "feel-good", "inspiring", "funny"]
  },
  {
    id: 2316,
    title: "The Office",
    tagline: "A comedy for anyone whose boss is an idiot.",
    year: 2005,
    release_date: "2005-03-24",
    vote_average: 8.6,
    vote_count: 4200,
    runtime: 22,
    genres: ["Comedy"],
    genre_ids: [35],
    director: "Greg Daniels",
    cast: ["Steve Carell", "Rainn Wilson", "John Krasinski", "Jenna Fischer", "B.J. Novak"],
    overview: "The everyday work lives of office employees in the Scranton, Pennsylvania branch of the fictional Dunder Mifflin Paper Company, led by deluded regional manager Michael Scott.",
    poster_path: "https://image.tmdb.org/t/p/w500/7DJKHzAi83BmQrWLrYY5qwbYp5v.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/vN0a5W4v8Y1uLzL2gR1l7h8b1vF.jpg",
    trailer_key: "2iKzmTVX54U",
    country: "United States",
    original_language: "en",
    media_type: "tv",
    keywords: ["mockumentary", "office", "michael scott", "dwight schrute", "jim and pam", "funny", "feel-good", "nostalgic", "laugh-out-loud"]
  },
  {
    id: 1668,
    title: "Friends",
    tagline: "I'll be there for you.",
    year: 1994,
    release_date: "1994-09-22",
    vote_average: 8.4,
    vote_count: 8100,
    runtime: 22,
    genres: ["Comedy", "Drama"],
    genre_ids: [35, 18],
    director: "David Crane, Marta Kauffman",
    cast: ["Jennifer Aniston", "Courteney Cox", "Lisa Kudrow", "Matt LeBlanc", "Matthew Perry", "David Schwimmer"],
    overview: "The misadventures of six 20-something friends as they navigate the pitfalls of work, life, and romance in 1990s Manhattan.",
    poster_path: "https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPghVJQiigNKU.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/l0qVZIp0n5b8BA0P9wGghq8L9gW.jpg",
    trailer_key: "IEEbUzffzrk",
    country: "United States",
    original_language: "en",
    media_type: "tv",
    keywords: ["sitcom", "1990s", "new york", "friendship", "romance", "funny", "feel-good", "nostalgic", "comfort"]
  },
  {
    id: 48891,
    title: "Brooklyn Nine-Nine",
    tagline: "Noice. Smort.",
    year: 2013,
    release_date: "2013-09-17",
    vote_average: 8.2,
    vote_count: 3600,
    runtime: 22,
    genres: ["Comedy", "Crime"],
    genre_ids: [35, 80],
    director: "Dan Goor, Michael Schur",
    cast: ["Andy Samberg", "Andre Braugher", "Stephanie Beatriz", "Terry Crews", "Melissa Fumero"],
    overview: "A comedic look at the eccentric detectives of Brooklyn's 99th precinct as immature detective Jake Peralta butts heads with his stern new commanding officer, Captain Raymond Holt.",
    poster_path: "https://image.tmdb.org/t/p/w500/hgRMSOt7a1b8qyQR68vUixJPang.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/7k2a2B3Yw9G8uV3kL4l8v9B9p8v.jpg",
    trailer_key: "sEOuJ4z5aTc",
    country: "United States",
    original_language: "en",
    media_type: "tv",
    keywords: ["cop comedy", "jake peralta", "captain holt", "funny", "feel-good", "friendship", "wit"]
  },
  {
    id: 67070,
    title: "Fleabag",
    tagline: "A beautifully crafted disaster.",
    year: 2016,
    release_date: "2016-07-21",
    vote_average: 8.3,
    vote_count: 1400,
    runtime: 27,
    genres: ["Comedy", "Drama"],
    genre_ids: [35, 18],
    director: "Phoebe Waller-Bridge",
    cast: ["Phoebe Waller-Bridge", "Sian Clifford", "Andrew Scott", "Olivia Colman", "Bill Paterson"],
    overview: "A dry-witted woman, known only as Fleabag, has no filter as she navigates life and love in London while trying to cope with tragedy, breaking the fourth wall directly to the viewer.",
    poster_path: "https://image.tmdb.org/t/p/w500/186jhP4bM8hR5n3b817n79tC1f8.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/9i3xPzW4V8YwV3kL4l8v9B9p8v7.jpg",
    trailer_key: "aX2ViKQFL_k",
    country: "United Kingdom",
    original_language: "en",
    media_type: "tv",
    keywords: ["fourth wall", "dry wit", "grief", "hot priest", "heartbreaking", "funny", "masterpiece"]
  },

  // 3. Mind-Bending Sci-Fi & Psychological
  {
    id: 115036,
    title: "Severance",
    tagline: "Please do not attempt to remember your life.",
    year: 2022,
    release_date: "2022-02-18",
    vote_average: 8.4,
    vote_count: 1800,
    runtime: 50,
    genres: ["Sci-Fi & Fantasy", "Drama", "Mystery"],
    genre_ids: [10765, 18, 9648],
    director: "Ben Stiller, Aoife McArdle",
    cast: ["Adam Scott", "Zach Cherry", "Britt Lower", "Patricia Arquette", "John Turturro", "Christopher Walken"],
    overview: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.",
    poster_path: "https://image.tmdb.org/t/p/w500/pPHpeIql5LDeXG6Ibm6U6o4C2u.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/d0tH8w4r6g3nF6p9p8v7Y3kL4l8.jpg",
    trailer_key: "xEQP4VVuyrY",
    country: "United States",
    original_language: "en",
    media_type: "tv",
    keywords: ["lumon", "severance", "memory split", "dystopian", "mind-bending", "tense-thrilling", "mystery", "masterpiece"]
  },
  {
    id: 70523,
    title: "Dark",
    tagline: "The question isn't where, but when.",
    year: 2017,
    release_date: "2017-12-01",
    vote_average: 8.4,
    vote_count: 7300,
    runtime: 60,
    genres: ["Sci-Fi & Fantasy", "Drama", "Mystery"],
    genre_ids: [10765, 18, 9648],
    director: "Baran bo Odar",
    cast: ["Louis Hofmann", "Oliver Masucci", "Jördis Triebel", "Maja Schöne", "Karoline Eichhorn"],
    overview: "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations and a time travel loop connecting 33-year cycles in the small German town of Winden.",
    poster_path: "https://image.tmdb.org/t/p/w500/apbrWgAQTxq9m938P65vNu0Trv6.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/3lBDg3i6nn5R2NKICJ792RiQ0qJ.jpg",
    trailer_key: "rrwycJ08PSA",
    country: "Germany",
    original_language: "de",
    media_type: "tv",
    keywords: ["time travel", "paradox", "german", "loop", "winden", "mind-bending", "dark", "mystery", "masterpiece"]
  },
  {
    id: 42009,
    title: "Black Mirror",
    tagline: "The future is bright.",
    year: 2011,
    release_date: "2011-12-04",
    vote_average: 8.3,
    vote_count: 5300,
    runtime: 60,
    genres: ["Sci-Fi & Fantasy", "Drama", "Mystery"],
    genre_ids: [10765, 18, 9648],
    director: "Charlie Brooker",
    cast: ["Bryce Dallas Howard", "Daniel Kaluuya", "Jon Hamm", "Hayley Atwell", "Alex Lawther"],
    overview: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
    poster_path: "https://image.tmdb.org/t/p/w500/7RumFHk29w3GgXp3T0sM6Jp37sP.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/suopoADq0k8YZr4dQXcU6p09YqE.jpg",
    trailer_key: "V0UzkT_C5O4",
    country: "United Kingdom",
    original_language: "en",
    media_type: "tv",
    keywords: ["anthology", "dystopian", "technology", "simulation", "mind-bending", "dark", "dilemma"]
  },

  // 4. Dark / Crime / Masterpiece
  {
    id: 76331,
    title: "Succession",
    tagline: "Make your move.",
    year: 2018,
    release_date: "2018-06-03",
    vote_average: 8.3,
    vote_count: 1700,
    runtime: 60,
    genres: ["Drama"],
    genre_ids: [18],
    director: "Jesse Armstrong",
    cast: ["Brian Cox", "Jeremy Strong", "Sarah Snook", "Kieran Culkin", "Matthew Macfadyen"],
    overview: "The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their aging father steps down from the company.",
    poster_path: "https://image.tmdb.org/t/p/w500/77zxGqvA597i2LM56r4d1b82jV9.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/nTvM4mhqZlKuZvAzb8A8n4G8t2v.jpg",
    trailer_key: "OzY2r83ynpI",
    country: "United States",
    original_language: "en",
    media_type: "tv",
    keywords: ["logan roy", "kendall roy", "corporate warfare", "billionaires", "media empire", "dark", "satire", "masterpiece"]
  },
  {
    id: 60574,
    title: "Peaky Blinders",
    tagline: "By order of the Peaky Blinders.",
    year: 2013,
    release_date: "2013-09-12",
    vote_average: 8.5,
    vote_count: 10400,
    runtime: 60,
    genres: ["Drama", "Crime"],
    genre_ids: [18, 80],
    director: "Steven Knight",
    cast: ["Cillian Murphy", "Paul Anderson", "Helen McCrory", "Sophie Rundle", "Tom Hardy"],
    overview: "A gangster family epic set in 1919 Birmingham, England and centered on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.",
    poster_path: "https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/wiE9doxSlCL4DTBS2Mw8DC7VAnF.jpg",
    trailer_key: "oVzVdvGIC7U",
    country: "United Kingdom",
    original_language: "en",
    media_type: "tv",
    keywords: ["tommy shelby", "gangster", "1920s", "birmingham", "dark", "tense-thrilling", "crime", "masterpiece"]
  },

  // 5. Inspiring / Drama
  {
    id: 87739,
    title: "The Queen's Gambit",
    tagline: "Grace under pressure.",
    year: 2020,
    release_date: "2020-10-23",
    vote_average: 8.5,
    vote_count: 4800,
    runtime: 60,
    genres: ["Drama"],
    genre_ids: [18],
    director: "Scott Frank",
    cast: ["Anya Taylor-Joy", "Bill Camp", "Marielle Heller", "Thomas Brodie-Sangster", "Harry Melling"],
    overview: "In a 1950s orphanage, a young girl discovers an astonishing talent for chess and begins an unlikely journey to stardom while grappling with addiction.",
    poster_path: "https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9lf6v4BiP.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg",
    trailer_key: "oZn3qSgmLqI",
    country: "United States",
    original_language: "en",
    media_type: "tv",
    keywords: ["chess", "prodigy", "1960s", "grandmaster", "inspiring", "drama", "masterpiece"]
  },
  {
    id: 94605,
    title: "Arcane",
    tagline: "Every legend has a beginning.",
    year: 2021,
    release_date: "2021-11-06",
    vote_average: 8.7,
    vote_count: 5300,
    runtime: 40,
    genres: ["Animation", "Sci-Fi & Fantasy", "Action & Adventure"],
    genre_ids: [16, 10765, 10759],
    director: "Christian Linke, Alex Yee",
    cast: ["Hailee Steinfeld", "Ella Purnell", "Kevin Alejandro", "Katie Leung", "Jason Spisak"],
    overview: "Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions-and the power that will tear them apart.",
    poster_path: "https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
    trailer_key: "fXmAurh012s",
    country: "United States",
    original_language: "en",
    media_type: "tv",
    keywords: ["jinx", "vi", "steampunk", "animation", "sisters", "action", "visually stunning", "masterpiece"]
  },
  {
    id: 19885,
    title: "Sherlock",
    tagline: "The game is on.",
    year: 2010,
    release_date: "2010-07-25",
    vote_average: 8.5,
    vote_count: 5100,
    runtime: 90,
    genres: ["Crime", "Drama", "Mystery"],
    genre_ids: [80, 18, 9648],
    director: "Mark Gatiss, Steven Moffat",
    cast: ["Benedict Cumberbatch", "Martin Freeman", "Una Stubbs", "Rupert Graves", "Andrew Scott"],
    overview: "A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London with cutting-edge observation and deduction.",
    poster_path: "https://image.tmdb.org/t/p/w500/7WTsnHsqAwhAgpr92mst979OI1S.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/4yvM02o00Q9u3w4vV9uV8r6g3nF.jpg",
    trailer_key: "xK7S9mrFWL4",
    country: "United Kingdom",
    original_language: "en",
    media_type: "tv",
    keywords: ["sherlock holmes", "john watson", "moriarty", "deduction", "mind-bending", "tense-thrilling", "mystery", "masterpiece"]
  },

  // 6. Indian Masterpiece TV Shows (Massively acclaimed)
  {
    id: 101740,
    title: "Panchayat",
    tagline: "Welcome to Phulera.",
    year: 2020,
    release_date: "2020-04-03",
    vote_average: 8.8,
    vote_count: 950,
    runtime: 35,
    genres: ["Comedy", "Drama"],
    genre_ids: [35, 18],
    director: "Deepak Kumar Mishra",
    cast: ["Jitendra Kumar", "Raghubir Yadav", "Neena Gupta", "Chandan Roy", "Faisal Malik"],
    overview: "An engineering graduate who takes up a job as a secretary of a Panchayat office in a remote village of Uttar Pradesh due to lack of better job options, discovering heartwarming rural bonds.",
    poster_path: "https://image.tmdb.org/t/p/w500/2LgHhPsljY2C0qU1Q1n0b31e9vJ.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/n2gHhPsljY2C0qU1Q1n0b31e9vJ.jpg",
    trailer_key: "mojZJ59E45g",
    country: "India",
    original_language: "hi",
    media_type: "tv",
    keywords: ["rural india", "village", "phulera", "wholesome", "feel-good", "funny", "inspiring", "indian"]
  },
  {
    id: 110492,
    title: "Scam 1992: The Harshad Mehta Story",
    tagline: "Risk hai toh ishq hai.",
    year: 2020,
    release_date: "2020-10-09",
    vote_average: 8.9,
    vote_count: 890,
    runtime: 50,
    genres: ["Drama", "Crime"],
    genre_ids: [18, 80],
    director: "Hansal Mehta",
    cast: ["Pratik Gandhi", "Shreya Dhanwanthary", "Hemant Kher", "Nikhil Dwivedi", "Anjali Barot"],
    overview: "Set in 1980s and 90s Bombay, the story tracks the life of Harshad Mehta, a stockbroker who took the stock market to dizzying heights and his catastrophic downfall.",
    poster_path: "https://image.tmdb.org/t/p/w500/5v65S1b35t2e6K06Qe5b6T0s1kP.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/9JvJbspTdQ51gqW8w6qf2nJp0qP.jpg",
    trailer_key: "ISORfez27og",
    country: "India",
    original_language: "hi",
    media_type: "tv",
    keywords: ["bombay stock exchange", "harshad mehta", "financial thriller", "inspiring", "tense-thrilling", "indian", "masterpiece"]
  },
  {
    id: 84088,
    title: "Mirzapur",
    tagline: "Bhaukaal machayege.",
    year: 2018,
    release_date: "2018-11-16",
    vote_average: 8.4,
    vote_count: 1200,
    runtime: 55,
    genres: ["Crime", "Action & Adventure", "Drama"],
    genre_ids: [80, 10759, 18],
    director: "Karan Anshuman, Gurmmeet Singh",
    cast: ["Pankaj Tripathi", "Ali Fazal", "Divyenndu", "Shweta Tripathi", "Rasika Dugal"],
    overview: "The iron-fisted Akhandanand Tripathi is a millionaire carpet exporter and the mafia don of Mirzapur. His son Munna, an unworthy heir, will stop at nothing to claim his father's empire.",
    poster_path: "https://image.tmdb.org/t/p/w500/kox38aC68nQc6uR4uNnE599818p.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
    trailer_key: "ZNeGF-PvVHY",
    country: "India",
    original_language: "hi",
    media_type: "tv",
    keywords: ["kaleen bhaiya", "guddu pandit", "mafia", "gangster", "purvanchal", "dark", "tense-thrilling", "indian"]
  },
  {
    id: 79240,
    title: "Sacred Games",
    tagline: "Do you believe in God?",
    year: 2018,
    release_date: "2018-07-06",
    vote_average: 8.3,
    vote_count: 1100,
    runtime: 50,
    genres: ["Crime", "Drama", "Mystery"],
    genre_ids: [80, 18, 9648],
    director: "Anurag Kashyap, Vikramaditya Motwane",
    cast: ["Saif Ali Khan", "Nawazuddin Siddiqui", "Radhika Apte", "Pankaj Tripathi", "Kalki Koechlin"],
    overview: "A link in their pasts leads an honest Mumbai cop to a fugitive gang boss whose cryptic warning spurs a quest to save Mumbai from cataclysm.",
    poster_path: "https://image.tmdb.org/t/p/w500/3Z31s1P9V3e27Y1Vp9b8L9k21nJ.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/3Z31s1P9V3e27Y1Vp9b8L9k21nJ.jpg",
    trailer_key: "28j8h0RRnq4",
    country: "India",
    original_language: "hi",
    media_type: "tv",
    keywords: ["gaitonde", "sartaj", "mumbai underworld", "thriller", "dark", "mind-bending", "indian"]
  },
  {
    id: 92749,
    title: "The Family Man",
    tagline: "A middle-class guy with a world-class secret.",
    year: 2019,
    release_date: "2019-09-20",
    vote_average: 8.6,
    vote_count: 980,
    runtime: 45,
    genres: ["Action & Adventure", "Comedy", "Drama"],
    genre_ids: [10759, 35, 18],
    director: "Raj & DK",
    cast: ["Manoj Bajpayee", "Priyamani", "Sharib Hashmi", "Samantha Ruth Prabhu", "Sharad Kelkar"],
    overview: "Srikant Tiwari is a middle-class man who also serves as a world-class spy for the National Investigation Agency, juggling family crises while defending the nation from terrorist threats.",
    poster_path: "https://image.tmdb.org/t/p/w500/gQv7B2l1Y55ZtG0T3e31k6V9P3h.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/4yvM02o00Q9u3w4vV9uV8r6g3nF.jpg",
    trailer_key: "NGf_B81HD2Q",
    country: "India",
    original_language: "hi",
    media_type: "tv",
    keywords: ["spy", "intelligence officer", "srikant tiwari", "family balance", "tense-thrilling", "funny", "action", "indian"]
  },
  {
    id: 93405,
    title: "Squid Game",
    tagline: "45.6 Billion Won is Child's Play.",
    year: 2021,
    release_date: "2021-09-17",
    vote_average: 8.2,
    vote_count: 14500,
    runtime: 55,
    genres: ["Action & Adventure", "Mystery", "Drama"],
    genre_ids: [10759, 9648, 18],
    director: "Hwang Dong-hyuk",
    cast: ["Lee Jung-jae", "Park Hae-soo", "Wi Ha-jun", "Jung Ho-yeon", "O Yeong-su"],
    overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
    poster_path: "https://image.tmdb.org/t/p/w500/dDlGgwg0yKzC04o29V61kM2f4Q.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/oaGvjB0DvdurWhfPtF7Au5g22uo.jpg",
    trailer_key: "oqxAJKy0ii4",
    country: "South Korea",
    original_language: "ko",
    media_type: "tv",
    keywords: ["survival game", "death game", "korean", "money", "dystopia", "tense-thrilling", "dark", "phenomenon"]
  },
  {
    id: 71446,
    title: "Money Heist",
    tagline: "The resistance has begun.",
    year: 2017,
    release_date: "2017-05-02",
    vote_average: 8.2,
    vote_count: 18400,
    runtime: 50,
    genres: ["Crime", "Drama"],
    genre_ids: [80, 18],
    director: "Álex Pina",
    cast: ["Álvaro Morte", "Úrsula Corberó", "Pedro Alonso", "Itziar Ituño", "Alba Flores"],
    overview: "To carry out the biggest heist in history, a mysterious man called The Professor recruits a band of eight robbers who have a single characteristic: none of them has anything to lose.",
    poster_path: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbk5rStFbmBY5f3Z.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/gFZriCkpJYsApPZEAVcqguhx9Kk.jpg",
    trailer_key: "_InqQJRqGW4",
    country: "Spain",
    original_language: "es",
    media_type: "tv",
    keywords: ["heist", "the professor", "royal mint of spain", "dali mask", "tense-thrilling", "action", "masterpiece"]
  }
];

async function run() {
  console.log('Starting TV shows curation...');
  let addedCount = 0;

  // 1. Tag existing movies explicitly
  catalog = catalog.map(m => {
    if (!m.media_type) {
      return { ...m, media_type: 'movie' };
    }
    return m;
  });

  // 2. Verify and add TV shows
  for (const show of tvShows) {
    const key = show.title.toLowerCase().trim();
    if (existingTitles.has(key)) {
      // update media_type if it already exists
      const idx = catalog.findIndex(m => (m.title || '').toLowerCase().trim() === key);
      if (idx !== -1) {
        catalog[idx].media_type = 'tv';
      }
      continue;
    }

    // Verify poster
    let validPoster = await verifyPoster(show.poster_path);
    if (!validPoster) {
      console.log(`Poster missing for ${show.title}, searching TMDB...`);
      validPoster = await fetchTmdbPoster(show.title, true);
    }

    if (validPoster) {
      show.poster_path = validPoster;
    }

    catalog.push(show);
    existingTitles.add(key);
    addedCount++;
    console.log(`+ Added TV Show: ${show.title} (${show.year})`);
  }

  // Save updated catalog
  fs.writeFileSync(jsonPath, JSON.stringify(catalog, null, 2), 'utf-8');
  console.log(`\nSuccessfully updated curatedMovies.json! Total items: ${catalog.length} (New TV shows added: ${addedCount})`);
}

run().catch(console.error);
