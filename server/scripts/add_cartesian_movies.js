import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const curatedPath = path.join(__dirname, '../data/curatedMovies.json');
const knownCharsPath = path.join(__dirname, '../data/knownCharacters.json');

const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'));
const knownChars = JSON.parse(fs.readFileSync(knownCharsPath, 'utf8'));

const newMovies = [
  {
    id: 335984,
    title: 'Blade Runner 2049',
    release_date: '2017-10-04',
    year: 2017,
    vote_average: 8.0,
    runtime: 164,
    overview: "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos. K's discovery leads him on a quest to find Rick Deckard, a former LAPD blade runner who has been missing for 30 years.",
    poster_path: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    genres: ['Science Fiction', 'Mystery', 'Drama'],
    genre_ids: [878, 9648, 18],
    director: 'Denis Villeneuve',
    cast: [
      'Ryan Gosling',
      'Harrison Ford',
      'Ana de Armas',
      'Sylvia Hoeks',
      'Robin Wright',
      'Mackenzie Davis',
      'Dave Bautista',
      'Jared Leto'
    ],
    country: 'United States',
    original_language: 'en',
    keywords: ['artificial intelligence', 'dystopia', 'replicant', 'cyberpunk', 'neo-noir', 'future', 'identity'],
    trailer_key: 'gCcx85zbxz4',
    media_type: 'movie'
  },
  {
    id: 593,
    title: 'Solaris',
    release_date: '1972-03-20',
    year: 1972,
    vote_average: 7.9,
    runtime: 167,
    overview: 'A psychologist is sent to a space station orbiting a mysterious ocean world to discover what has driven the cosmonaut crew into madness, confronting physical manifestations of his grief and deepest subconscious memories.',
    poster_path: 'https://image.tmdb.org/t/p/w500/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg',
    genres: ['Science Fiction', 'Drama', 'Mystery'],
    genre_ids: [878, 18, 9648],
    director: 'Andrei Tarkovsky',
    cast: [
      'Donatas Banionis',
      'Natalya Bondarchuk',
      'Jüri Järvet',
      'Vladislav Dvorzhetsky',
      'Nikolai Grinko',
      'Anatoly Solonitsyn'
    ],
    country: 'Soviet Union',
    original_language: 'ru',
    keywords: ['space station', 'philosophical', 'ocean planet', 'memory', 'psychological', 'hallucination', 'meditative'],
    trailer_key: 'tFMo3UJ4B4g',
    media_type: 'movie'
  },
  {
    id: 329865,
    title: 'Arrival',
    release_date: '2016-11-10',
    year: 2016,
    vote_average: 7.9,
    runtime: 116,
    overview: "Taking place after alien crafts land around the world, an expert linguist is recruited by the military to determine whether they come in peace or are a threat. As humanity teeters on the verge of global war, Banks and the team race against time for answers.",
    poster_path: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    genres: ['Science Fiction', 'Mystery', 'Drama'],
    genre_ids: [878, 9648, 18],
    director: 'Denis Villeneuve',
    cast: [
      'Amy Adams',
      'Jeremy Renner',
      'Forest Whitaker',
      'Michael Stuhlbarg',
      "Mark O'Brien",
      'Tzi Ma'
    ],
    country: 'United States',
    original_language: 'en',
    keywords: ['first contact', 'linguistics', 'time perception', 'alien', 'sapir-whorf', 'spacecraft', 'emotional'],
    trailer_key: 'tFMo3UJ4B4g',
    media_type: 'movie'
  },
  {
    id: 1398,
    title: 'Stalker',
    release_date: '1979-05-25',
    year: 1979,
    vote_average: 8.2,
    runtime: 162,
    overview: "Near a nameless gray city stands the Zone, a desolate wasteland where natural laws do not apply. A Stalker guides two intellectuals toward a legendary room said to grant one's deepest desires, navigating metaphysical traps and spiritual reckoning.",
    poster_path: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    genres: ['Science Fiction', 'Drama'],
    genre_ids: [878, 18],
    director: 'Andrei Tarkovsky',
    cast: [
      'Aleksandr Kaidanovsky',
      'Alisa Freindlikh',
      'Anatoly Solonitsyn',
      'Nikolai Grinko',
      'Natasha Abramova'
    ],
    country: 'Soviet Union',
    original_language: 'ru',
    keywords: ['the zone', 'wish granting room', 'philosophical', 'slow cinema', 'post-apocalyptic', 'faith', 'poetic realism'],
    trailer_key: 'Q3hBLv-HCE8',
    media_type: 'movie'
  },
  {
    id: 62,
    title: '2001: A Space Odyssey',
    release_date: '1968-04-02',
    year: 1968,
    vote_average: 8.1,
    runtime: 149,
    overview: 'Humanity finds a mysterious black monolith buried beneath the lunar surface and sets off to Jupiter to find its origins with the help of HAL 9000, the world\'s most advanced artificial intelligence. An imposing quest spanning human evolution, artificial consciousness, and cosmic rebirth.',
    poster_path: 'https://image.tmdb.org/t/p/w500/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/ve72VxNqjGM69Uky4WTo2bK6rfq.jpg',
    genres: ['Science Fiction', 'Mystery', 'Adventure'],
    genre_ids: [878, 9648, 12],
    director: 'Stanley Kubrick',
    cast: [
      'Keir Dullea',
      'Gary Lockwood',
      'William Sylvester',
      'Daniel Richter',
      'Leonard Rossiter',
      'Margaret Tyzack'
    ],
    country: 'United Kingdom',
    original_language: 'en',
    keywords: ['monolith', 'artificial intelligence', 'hal 9000', 'jupiter mission', 'space exploration', 'evolution', 'masterpiece'],
    trailer_key: 'oR_e9y-OJek',
    media_type: 'movie'
  },
  {
    id: 545611,
    title: 'Everything Everywhere All At Once',
    release_date: '2022-03-24',
    year: 2022,
    vote_average: 8.0,
    runtime: 139,
    overview: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led across parallel universes, confronting absurd realities and cosmic nihilism.",
    poster_path: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
    genres: ['Action', 'Adventure', 'Science Fiction', 'Comedy'],
    genre_ids: [28, 12, 878, 35],
    director: 'Daniel Kwan, Daniel Scheinert',
    cast: [
      'Michelle Yeoh',
      'Ke Huy Quan',
      'Stephanie Hsu',
      'Jamie Lee Curtis',
      'James Hong',
      'Tallie Medel'
    ],
    country: 'United States',
    original_language: 'en',
    keywords: ['multiverse', 'absurdism', 'existential dread', 'parallel universe', 'mother daughter', 'kung fu', 'nihilism'],
    trailer_key: 'wxN1T1uxQ2g',
    media_type: 'movie'
  },
  {
    id: 46648,
    title: 'True Detective',
    release_date: '2014-01-12',
    year: 2014,
    vote_average: 8.3,
    runtime: 60,
    number_of_seasons: 4,
    overview: 'An American anthology police procedural drama television series in which police investigations unearth the personal and professional secrets of those involved, both within and outside the law. Season 1 follows Louisiana State Police detectives Rust Cohle and Martin Hart across a 17-year hunt for a ritualistic serial killer.',
    poster_path: 'https://image.tmdb.org/t/p/w500/in1R2dDc421JxsoRWaIIAqVI2KE.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/in1R2dDc421JxsoRWaIIAqVI2KE.jpg',
    genres: ['Crime', 'Drama', 'Mystery'],
    genre_ids: [80, 18, 9648],
    director: 'Cary Joji Fukunaga, Nic Pizzolatto',
    cast: [
      'Matthew McConaughey',
      'Woody Harrelson',
      'Michelle Monaghan',
      'Michael Potts',
      'Tory Kittles'
    ],
    country: 'United States',
    original_language: 'en',
    keywords: ['nihilism', 'serial killer', 'neo-noir', 'southern gothic', 'occult', 'philosophy', 'detective'],
    trailer_key: 'fVQUcaO4AvE',
    media_type: 'tv'
  }
];

newMovies.forEach(m => {
  const idx = curated.findIndex(c => c.id === m.id);
  if (idx >= 0) {
    curated[idx] = m;
  } else {
    curated.push(m);
  }
});

fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2), 'utf8');
console.log('Successfully updated curatedMovies.json! Total movies now:', curated.length);

// Add known characters
const newChars = {
  '335984': {
    'Ryan Gosling': 'Officer K / Joe',
    'Harrison Ford': 'Rick Deckard',
    'Ana de Armas': 'Joi',
    'Sylvia Hoeks': 'Luv',
    'Robin Wright': 'Lt. Joshi',
    'Mackenzie Davis': 'Mariette',
    'Dave Bautista': 'Sapper Morton',
    'Jared Leto': 'Niander Wallace'
  },
  '593': {
    'Donatas Banionis': 'Kris Kelvin',
    'Natalya Bondarchuk': 'Hari',
    'Jüri Järvet': 'Dr. Snaut',
    'Vladislav Dvorzhetsky': 'Henri Burton',
    'Nikolai Grinko': "Kelvin's Father",
    'Anatoly Solonitsyn': 'Dr. Sartorius'
  },
  '329865': {
    'Amy Adams': 'Louise Banks',
    'Jeremy Renner': 'Ian Donnelly',
    'Forest Whitaker': 'Colonel Weber',
    'Michael Stuhlbarg': 'Agent Halpern',
    "Mark O'Brien": 'Captain Marks',
    'Tzi Ma': 'General Shang'
  },
  '1398': {
    'Aleksandr Kaidanovsky': 'The Stalker',
    'Alisa Freindlikh': "The Stalker's Wife",
    'Anatoly Solonitsyn': 'The Writer',
    'Nikolai Grinko': 'The Professor',
    'Natasha Abramova': 'Monkey (Martyshka)'
  },
  '62': {
    'Keir Dullea': 'Dr. David Bowman',
    'Gary Lockwood': 'Dr. Frank Poole',
    'William Sylvester': 'Dr. Heywood Floyd',
    'Daniel Richter': 'Moonwatcher',
    'Leonard Rossiter': 'Dr. Andrei Smyslov',
    'Douglas Rain': 'HAL 9000 (voice)'
  },
  '545611': {
    'Michelle Yeoh': 'Evelyn Wang',
    'Ke Huy Quan': 'Waymond Wang',
    'Stephanie Hsu': 'Joy Wang / Jobu Tupaki',
    'Jamie Lee Curtis': 'Deirdre Beaubeirdre',
    'James Hong': 'Gong Gong',
    'Tallie Medel': 'Becky Sregor'
  },
  '46648': {
    'Matthew McConaughey': "Rustin 'Rust' Cohle",
    'Woody Harrelson': "Martin 'Marty' Hart",
    'Michelle Monaghan': 'Maggie Hart',
    'Michael Potts': 'Detective Maynard Gilbough',
    'Tory Kittles': 'Detective Thomas Papania'
  }
};

Object.assign(knownChars, newChars);
fs.writeFileSync(knownCharsPath, JSON.stringify(knownChars, null, 2), 'utf8');
console.log('Successfully updated knownCharacters.json!');
