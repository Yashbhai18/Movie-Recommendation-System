import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, '../data/curatedMovies.json');

const indianCandidates = [
  {
    id: 20453,
    title: "3 Idiots",
    release_date: "2009-12-25",
    year: 2009,
    vote_average: 8.0,
    runtime: 170,
    overview: "Two friends search for their long-lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them 'idiots'.",
    genres: ["Comedy", "Drama"],
    genre_ids: [35, 18],
    director: "Rajkumar Hirani",
    cast: ["Aamir Khan", "R. Madhavan", "Sharman Joshi", "Kareena Kapoor Khan", "Boman Irani"],
    country: "India",
    original_language: "hi",
    keywords: ["friendship", "college", "engineering", "inspirational", "chasing dreams", "feel-good"],
    trailer_key: "K0eDlFX9GMc"
  },
  {
    id: 579974,
    title: "RRR",
    release_date: "2022-03-24",
    year: 2022,
    vote_average: 7.8,
    runtime: 182,
    overview: "A fictional history of two legendary revolutionaries' journey away from home before they began fighting for their country in the 1920s.",
    genres: ["Action", "Adventure", "Drama"],
    genre_ids: [28, 12, 18],
    director: "S.S. Rajamouli",
    cast: ["N.T. Rama Rao Jr.", "Ram Charan", "Alia Bhatt", "Ajay Devgn", "Olivia Morris"],
    country: "India",
    original_language: "te",
    keywords: ["brotherhood", "revolution", "colonial india", "epic action", "rebellion", "spectacle"],
    trailer_key: "NgBoMJy386M"
  },
  {
    id: 360814,
    title: "Dangal",
    release_date: "2016-12-21",
    year: 2016,
    vote_average: 8.0,
    runtime: 161,
    overview: "Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.",
    genres: ["Drama", "Action", "Family"],
    genre_ids: [18, 28, 10751],
    director: "Nitesh Tiwari",
    cast: ["Aamir Khan", "Fatima Sana Shaikh", "Sanya Malhotra", "Sakshi Tanwar"],
    country: "India",
    original_language: "hi",
    keywords: ["wrestling", "father daughter", "inspirational", "sports", "empowerment", "family triumph"],
    trailer_key: "x_7YlGv9u1g"
  },
  {
    id: 7508,
    title: "Taare Zameen Par",
    release_date: "2007-12-21",
    year: 2007,
    vote_average: 8.0,
    runtime: 165,
    overview: "An eight-year-old boy is thought to be a lazy trouble-maker, until the new art teacher has the patience and compassion to discover the real problem behind his struggles in school.",
    genres: ["Drama", "Family"],
    genre_ids: [18, 10751],
    director: "Aamir Khan",
    cast: ["Darsheel Safary", "Aamir Khan", "Tisca Chopra", "Vipin Sharma"],
    country: "India",
    original_language: "hi",
    keywords: ["dyslexia", "childhood", "art teacher", "empathy", "heartbreaking", "inspiring"],
    trailer_key: "tn_2Ie_jtNY"
  },
  {
    id: 534780,
    title: "Andhadhun",
    release_date: "2018-10-05",
    year: 2018,
    vote_average: 7.7,
    runtime: 139,
    overview: "A series of mysterious events changes the life of a blind pianist who now must report a crime that was committed right in front of him.",
    genres: ["Thriller", "Mystery", "Comedy"],
    genre_ids: [53, 9648, 35],
    director: "Sriram Raghavan",
    cast: ["Ayushmann Khurrana", "Tabu", "Radhika Apte", "Anil Dhawan"],
    country: "India",
    original_language: "hi",
    keywords: ["blind pianist", "murder mystery", "mind-bending", "black comedy", "twists", "crime"],
    trailer_key: "2iVYI99VGaw"
  },
  {
    id: 538858,
    title: "Tumbbad",
    release_date: "2018-10-12",
    year: 2018,
    vote_average: 7.6,
    runtime: 104,
    overview: "A mythological story about a goddess who created the entire universe. The plot revolves around the consequences when humans build a temple for her first-born monster, Hastar.",
    genres: ["Fantasy", "Horror", "Drama"],
    genre_ids: [14, 27, 18],
    director: "Rahi Anil Barve",
    cast: ["Sohum Shah", "Jyoti Malshe", "Anita Date-Kelkar", "Ronjini Chakraborty"],
    country: "India",
    original_language: "hi",
    keywords: ["greed", "ancient curse", "mythology", "dark", "atmospheric", "gold"],
    trailer_key: "sN75MPxgvX8"
  },
  {
    id: 62835,
    title: "Zindagi Na Milegi Dobara",
    release_date: "2011-07-15",
    year: 2011,
    vote_average: 7.8,
    runtime: 155,
    overview: "Three childhood friends embark on a bachelor trip to Spain, where each must choose an ultimate bucket-list adventure to overcome their deepest fears.",
    genres: ["Drama", "Comedy", "Adventure"],
    genre_ids: [18, 35, 12],
    director: "Zoya Akhtar",
    cast: ["Hrithik Roshan", "Farhan Akhtar", "Abhay Deol", "Katrina Kaif", "Kalki Koechlin"],
    country: "India",
    original_language: "hi",
    keywords: ["road trip", "spain", "friendship", "overcoming fear", "feel-good", "scuba diving"],
    trailer_key: "FJrtc2zHNnQ"
  },
  {
    id: 104742,
    title: "Gangs of Wasseypur",
    release_date: "2012-06-22",
    year: 2012,
    vote_average: 7.9,
    runtime: 321,
    overview: "A clash between Sultan and Shahid Khan leads to the expulsion of Khan from Wasseypur, igniting a deadly multi-generational feud over coal mines and power.",
    genres: ["Crime", "Drama", "Action"],
    genre_ids: [80, 18, 28],
    director: "Anurag Kashyap",
    cast: ["Manoj Bajpayee", "Nawazuddin Siddiqui", "Richa Chadha", "Pankaj Tripathi", "Huma Qureshi"],
    country: "India",
    original_language: "hi",
    keywords: ["revenge", "coal mafia", "feud", "dark", "gritty", "gangster epic"],
    trailer_key: "j-5_2b1ZzG0"
  },
  {
    id: 193756,
    title: "The Lunchbox",
    release_date: "2013-09-20",
    year: 2013,
    vote_average: 7.4,
    runtime: 104,
    overview: "A mistaken delivery in Mumbai's famously efficient lunchbox delivery system connects a neglected housewife to an elderly widower about to retire.",
    genres: ["Drama", "Romance"],
    genre_ids: [18, 10749],
    director: "Ritesh Batra",
    cast: ["Irrfan Khan", "Nimrat Kaur", "Nawazuddin Siddiqui", "Lillete Dubey"],
    country: "India",
    original_language: "hi",
    keywords: ["mumbai dabbawala", "letters", "loneliness", "heartbreaking", "poetic", "quiet romance"],
    trailer_key: "IJ_2Q7m1nQc"
  },
  {
    id: 351286,
    title: "Drishyam",
    release_date: "2015-07-31",
    year: 2015,
    vote_average: 7.7,
    runtime: 163,
    overview: "Desperate measures are taken by a man who tries to save his family from the dark side of the law after they commit an unexpected crime.",
    genres: ["Crime", "Drama", "Thriller"],
    genre_ids: [80, 18, 53],
    director: "Nishikant Kamat",
    cast: ["Ajay Devgn", "Tabu", "Shriya Saran", "Rajat Kapoor", "Ishita Dutta"],
    country: "India",
    original_language: "hi",
    keywords: ["alibi", "cinema buff", "police investigation", "tense-thrilling", "family protection"],
    trailer_key: "AuuX2j14NBg"
  },
  {
    id: 1966,
    title: "Lagaan: Once Upon a Time in India",
    release_date: "2001-06-15",
    year: 2001,
    vote_average: 7.8,
    runtime: 224,
    overview: "In 1893 India, a small drought-ridden village takes on the British Empire in a high-stakes cricket match to avoid paying tyrannical taxes.",
    genres: ["Adventure", "Drama", "History"],
    genre_ids: [12, 18, 36],
    director: "Ashutosh Gowariker",
    cast: ["Aamir Khan", "Gracy Singh", "Rachel Shelley", "Paul Blackthorne"],
    country: "India",
    original_language: "hi",
    keywords: ["cricket", "colonial india", "underdog", "inspiring", "epic", "unity"],
    trailer_key: "oSIGQ0YkFxs"
  },
  {
    id: 20770,
    title: "Swades",
    release_date: "2004-12-17",
    year: 2004,
    vote_average: 7.8,
    runtime: 210,
    overview: "A successful Indian scientist working at NASA returns to his native village to take his childhood nanny with him, and finds himself confronting grass-roots realities.",
    genres: ["Drama"],
    genre_ids: [18],
    director: "Ashutosh Gowariker",
    cast: ["Shah Rukh Khan", "Gayatri Joshi", "Kishori Ballal", "Rajesh Vivek"],
    country: "India",
    original_language: "hi",
    keywords: ["nasa", "rural development", "patriotism", "inspiring", "social reform", "heartfelt"],
    trailer_key: "bFhP3c_08yY"
  },
  {
    id: 256040,
    title: "Baahubali: The Beginning",
    release_date: "2015-07-10",
    year: 2015,
    vote_average: 7.6,
    runtime: 159,
    overview: "A child from the Mahishmati kingdom is saved from death and raised by tribal villagers. As an adult, he is drawn into an epic clash of kingdoms and destinies.",
    genres: ["Action", "Adventure", "Fantasy"],
    genre_ids: [28, 12, 14],
    director: "S.S. Rajamouli",
    cast: ["Prabhas", "Rana Daggubati", "Anushka Shetty", "Tamannaah Bhatia", "Ramya Krishnan"],
    country: "India",
    original_language: "te",
    keywords: ["kingdom", "waterfall", "warrior", "epic", "mythological fantasy", "spectacle"],
    trailer_key: "sOEg_YNzG3w"
  },
  {
    id: 247067,
    title: "Queen",
    release_date: "2014-03-07",
    year: 2014,
    vote_average: 7.5,
    runtime: 146,
    overview: "A Delhi girl from a traditional family sets out on a solo honeymoon to Paris and Amsterdam after her fiancé calls off the wedding at the eleventh hour.",
    genres: ["Comedy", "Drama"],
    genre_ids: [35, 18],
    director: "Vikas Bahl",
    cast: ["Kangana Ranaut", "Rajkummar Rao", "Lisa Haydon", "Mish Boyko"],
    country: "India",
    original_language: "hi",
    keywords: ["solo travel", "independence", "paris", "feel-good", "empowerment", "friendship"],
    trailer_key: "KGC6vl3Arf0"
  },
  {
    id: 1024535,
    title: "Kantara",
    release_date: "2022-09-30",
    year: 2022,
    vote_average: 7.7,
    runtime: 148,
    overview: "When greed paves the way for betrayal, scheming and murder, a young tribal champion finds himself inheriting ancestral spirits to protect his sacred forest.",
    genres: ["Action", "Adventure", "Drama", "Thriller"],
    genre_ids: [28, 12, 18, 53],
    director: "Rishab Shetty",
    cast: ["Rishab Shetty", "Sapthami Gowda", "Kishore", "Achyuth Kumar"],
    country: "India",
    original_language: "kn",
    keywords: ["folklore", "divine spirit", "forest rights", "kambala", "tense-thrilling", "ritual"],
    trailer_key: "8mrVmf239GU"
  }
];

async function checkUrl(url) {
  if (!url) return false;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

async function fetchTmdbPoster(movieId) {
  try {
    const url = `https://www.themoviedb.org/movie/${movieId}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (match && match[1]) {
      let poster = match[1];
      poster = poster.replace('media.themoviedb.org', 'image.tmdb.org');
      poster = poster.replace(/\/t\/p\/w\d+\//, '/t/p/w500/');
      const isValid = await checkUrl(poster);
      if (isValid) return poster;
    }
  } catch (err) {
    console.error(`Error fetching TMDB for ${movieId}:`, err.message);
  }
  return null;
}

async function run() {
  console.log('Fetching verified posters for Indian movies...');
  const currentMovies = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const currentIds = new Set(currentMovies.map(m => m.id));

  for (const movie of indianCandidates) {
    console.log(`Processing ${movie.title} (${movie.id})...`);
    let poster = await fetchTmdbPoster(movie.id);
    if (!poster) {
      // Fallback search via Wikipedia summary API
      try {
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(movie.title + '_(film)')}`;
        const res = await fetch(wikiUrl, { headers: { 'User-Agent': 'CinePulseApp/1.0' } });
        if (res.ok) {
          const data = await res.json();
          const img = data.originalimage?.source || data.thumbnail?.source;
          if (img) poster = img.split('?')[0];
        }
      } catch (e) {
        console.warn('Wiki error:', e.message);
      }
    }

    movie.poster_path = poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';
    movie.backdrop_path = poster;

    if (!currentIds.has(movie.id)) {
      currentMovies.push(movie);
      console.log(`  -> Added ${movie.title} with poster: ${movie.poster_path}`);
    } else {
      console.log(`  -> Already in catalog: ${movie.title}`);
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(currentMovies, null, 2), 'utf-8');
  console.log(`\nSuccessfully updated curatedMovies.json! Total movies now: ${currentMovies.length}`);
}

run();
