import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, '../data/curatedMovies.json');
const movies = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Authentic verified Indian poster mappings
const verifiedPosters = {
  // Mind-bending / Thrillers
  "Ratsasan": "https://upload.wikimedia.org/wikipedia/en/7/77/Ratsasan_poster.jpg",
  "Kahaani": "https://upload.wikimedia.org/wikipedia/en/f/f2/Kahaani_poster.jpg",
  "Talaash: The Answer Lies Within": "https://upload.wikimedia.org/wikipedia/en/f/f3/Talaash_poster.jpg",
  "13B: Fear Has a New Address": "https://upload.wikimedia.org/wikipedia/en/c/cf/13B%2C_Fear_Has_a_New_Address.jpeg",
  "Lucia": "https://upload.wikimedia.org/wikipedia/en/e/ef/Lucia_kannada_film_poster1.jpg",
  "24": "https://upload.wikimedia.org/wikipedia/en/7/79/24_%282016_film%29_poster.jpg",
  "Badla": "https://upload.wikimedia.org/wikipedia/en/0/0c/Badla_poster.jpg",
  "Game Over": "https://upload.wikimedia.org/wikipedia/en/8/84/Game_Over_2019_poster.jpg",
  "No Smoking": "https://upload.wikimedia.org/wikipedia/en/d/d4/No_Smoking_%28Poster%29.jpg",
  "Bhool Bhulaiyaa": "https://upload.wikimedia.org/wikipedia/en/6/6f/Bhool_bhulaiyaa.jpg",
  "Kalki 2898 AD": "https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg",
  "Ugly": "https://upload.wikimedia.org/wikipedia/en/6/61/Movie_Poster_Ugly.jpg",
  "Talvar": "https://upload.wikimedia.org/wikipedia/en/9/91/TalvarFilmPoster.jpg",
  "Andhadhun": "https://image.tmdb.org/t/p/w500/dy3K6hNvwE05siGgiLJcEiwgpdO.jpg",
  "Tumbbad": "https://image.tmdb.org/t/p/w500/z1xOCxw780WFJC5uCTMfCkQ4Agi.jpg",
  "Drishyam": "https://image.tmdb.org/t/p/w500/gIClWRv5OSe8rl5Koi0AeUcCZ9Z.jpg",

  // Action / Crime / Adventure
  "Vikram": "https://upload.wikimedia.org/wikipedia/en/9/93/Vikram_2022_poster.jpg",
  "Kaithi": "https://upload.wikimedia.org/wikipedia/en/2/23/Kaithi_poster.jpg",
  "Vikram Vedha": "https://upload.wikimedia.org/wikipedia/en/9/91/Vikram_Vedha_poster.jpg",
  "Manjummel Boys": "https://upload.wikimedia.org/wikipedia/en/d/dc/Manjummel_Boys_poster.jpg",
  "A Wednesday!": "https://upload.wikimedia.org/wikipedia/en/5/52/A_Wednesday.jpg",
  "Gangs of Wasseypur": "https://upload.wikimedia.org/wikipedia/en/6/6a/Gangs_of_Wasseypur_poster.jpg",
  "RRR": "https://image.tmdb.org/t/p/w500/tjpiEnZBUAA8pdNPRKa5vP2Zpqw.jpg",
  "Baahubali: The Beginning": "https://image.tmdb.org/t/p/w500/9BAjt8nSSms62uOVYn1t3C3dVto.jpg",
  "Baahubali 2: The Conclusion": "https://image.tmdb.org/t/p/w500/9BAjt8nSSms62uOVYn1t3C3dVto.jpg",
  "K.G.F: Chapter 1": "https://upload.wikimedia.org/wikipedia/en/c/cc/K.G.F_Chapter_1_poster.jpg",
  "Kantara": "https://image.tmdb.org/t/p/w500/jIsKmkxMzdCZ0Ux1GVSnu8m6Na6.jpg",
  "Sholay": "https://upload.wikimedia.org/wikipedia/en/5/52/Sholay-poster.jpg",

  // Feel-Good / Comedy / Romance
  "3 Idiots": "https://image.tmdb.org/t/p/w500/gmSRHU1Wtiatj8KoyVt8rT9ockx.jpg",
  "Hera Pheri": "https://upload.wikimedia.org/wikipedia/en/4/41/Hera_Pheri_2000_poster.jpg",
  "Chhichhore": "https://upload.wikimedia.org/wikipedia/en/3/3d/Chhichhore_Poster.jpg",
  "Dil Chahta Hai": "https://upload.wikimedia.org/wikipedia/en/d/db/Dil_Chahta_Hai.jpg",
  "Jab We Met": "https://upload.wikimedia.org/wikipedia/en/9/9f/Jab_We_Met_Poster.jpg",
  "Barfi!": "https://upload.wikimedia.org/wikipedia/en/2/2e/Barfi%21_poster.jpg",
  "Munna Bhai M.B.B.S.": "https://upload.wikimedia.org/wikipedia/en/a/a2/Munna_Bhai_M.B.B.S._poster.jpg",
  "Kumbalangi Nights": "https://upload.wikimedia.org/wikipedia/en/5/53/Kumbalangi_Nights_poster.jpg",
  "Stree": "https://upload.wikimedia.org/wikipedia/en/4/4f/Stree_-_2018_Movie_Poster.jpg",
  "Queen": "https://upload.wikimedia.org/wikipedia/en/4/45/QueenMoviePoster7thMarch.jpg",
  "Zindagi Na Milegi Dobara": "https://image.tmdb.org/t/p/w500/rEdGDgRB3gducezNSIyx2lbKQy4.jpg",
  "Dilwale Dulhania Le Jayenge": "https://image.tmdb.org/t/p/w500/lfRkUr7DYdHldAqi3PwdQGBRBPM.jpg",

  // Drama / Inspiring / Emotional
  "12th Fail": "https://upload.wikimedia.org/wikipedia/en/f/f2/12th_Fail_poster.jpg",
  "Chak De! India": "https://upload.wikimedia.org/wikipedia/en/0/0c/Chak_De%21_India.jpg",
  "Taare Zameen Par": "https://image.tmdb.org/t/p/w500/lmz3fQV9wrrYiTU1gCdjhAc8pZ6.jpg",
  "Dangal": "https://image.tmdb.org/t/p/w500/cJRPOLEexI7qp2DKtFfCh7YaaUG.jpg",
  "Swades": "https://image.tmdb.org/t/p/w500/8huDg3Q0EmcWuN9HgYsO8ylAp9f.jpg",
  "Lagaan: Once Upon a Time in India": "https://image.tmdb.org/t/p/w500/jrwQu72sGwGqwE8Ijne89PSIvhp.jpg",
  "The Lunchbox": "https://image.tmdb.org/t/p/w500/zaBIrloyhGK7iNTZMb3f9SARsl8.jpg",
  "Soorarai Pottru": "https://upload.wikimedia.org/wikipedia/en/b/b3/Soorarai_Pottru_poster.jpg",
  "Jai Bhim": "https://upload.wikimedia.org/wikipedia/en/5/54/Jai_Bhim_poster.jpg",
  "Sita Ramam": "https://upload.wikimedia.org/wikipedia/en/e/e4/Sita_Ramam.jpg",
  "Masaan": "https://upload.wikimedia.org/wikipedia/en/d/dc/Masaan_Poster.jpg",
  "Pather Panchali": "https://upload.wikimedia.org/wikipedia/en/9/91/Pather_Panchali_poster.jpg"
};

async function testUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function fix() {
  console.log('Verifying all authentic Indian posters...');
  let fixed = 0;

  for (const movie of movies) {
    if (movie.country === 'India' && verifiedPosters[movie.title]) {
      const correctPoster = verifiedPosters[movie.title];
      const isOk = await testUrl(correctPoster);
      if (isOk) {
        if (movie.poster_path !== correctPoster) {
          console.log(`[FIXING] ${movie.title}`);
          console.log(`   Old: ${movie.poster_path}`);
          console.log(`   New: ${correctPoster}`);
          movie.poster_path = correctPoster;
          movie.backdrop_path = correctPoster;
          fixed++;
        } else {
          console.log(`[VERIFIED] ${movie.title} (already correct)`);
        }
      } else {
        console.warn(`[FAILED TEST] ${movie.title} -> ${correctPoster}`);
      }
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(movies, null, 2), 'utf-8');
  console.log(`\nSuccessfully updated ${fixed} Indian movie posters in curatedMovies.json!`);
}

fix();
