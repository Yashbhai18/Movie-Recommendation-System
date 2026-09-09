import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const curatedPath = path.join(__dirname, '../data/curatedMovies.json');
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'));

const updates = {
  545611: {
    poster_path: 'https://image.tmdb.org/t/p/w500/u68AjlvlutfEIcpmbYpKcdi09ut.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg',
    tagline: 'The universe is so much bigger than you realize.'
  },
  335984: {
    poster_path: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/gNdLJU9TxrpGx4dkZidjys3fyy0.jpg',
    tagline: "There's still a page left."
  },
  593: {
    poster_path: 'https://image.tmdb.org/t/p/w500/pgqj7QoBPWFLLKtLEpPmFYFRMgB.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/jZv1u7uzpOE5JOc2MmrvPUZWoyb.jpg',
    tagline: 'There are no answers, only choices.'
  },
  329865: {
    poster_path: 'https://image.tmdb.org/t/p/w500/pEzNVQfdzYDzVK0XqxERIw2x2se.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/8MUZz7oPXQftFTslZpRP3CVMOoq.jpg',
    tagline: 'Why are they here?'
  },
  1398: {
    poster_path: 'https://image.tmdb.org/t/p/w500/1qhOyf5C4s9ZdvY8d5JDx9DFMeT.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/6yrbWzzrPp7pwz6zHdifspJk8t3.jpg',
    tagline: 'A journey into the forbidden zone of the soul.'
  },
  62: {
    poster_path: 'https://image.tmdb.org/t/p/w500/ve72VxNqjGM69Uky4WTo2bK6rfq.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/w5IDXtifKntw0ajv2co7jFlTQDM.jpg',
    tagline: 'An epic drama of adventure and exploration.'
  },
  46648: {
    poster_path: 'https://image.tmdb.org/t/p/w500/dC7jkj2g1aU8sxKqM6D4g44xA6w.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/v8YFr8BbU9qsO8PYIulzTeM6Qk.jpg',
    tagline: 'Touch darkness and darkness touches you back.'
  }
};

let count = 0;
for (const movie of curated) {
  if (updates[movie.id]) {
    Object.assign(movie, updates[movie.id]);
    count++;
    console.log(`Updated ${movie.title} (${movie.id}) with authentic assets.`);
  }
}

fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2), 'utf8');
console.log(`\nSuccessfully updated ${count} movies in curatedMovies.json!`);
