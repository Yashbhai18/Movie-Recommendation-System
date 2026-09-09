import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, '../data/curatedMovies.json');
const movies = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Fix GOW & Queen
const gow = movies.find(m => m.id === 104742);
if (gow) gow.poster_path = 'https://upload.wikimedia.org/wikipedia/en/6/6a/Gangs_of_Wasseypur_poster.jpg';

const queen = movies.find(m => m.id === 247067);
if (queen) queen.poster_path = 'https://upload.wikimedia.org/wikipedia/en/4/45/QueenMoviePoster7thMarch.jpg';

// Add 5 more blockbusters
const moreIndian = [
  {
    id: 19404,
    title: "Dilwale Dulhania Le Jayenge",
    release_date: "1995-10-20",
    year: 1995,
    vote_average: 8.5,
    runtime: 189,
    overview: "Raj and Simran meet on a trip through Europe and fall in love. When Raj learns Simran is already promised to another, he follows her to India to win over her traditional family.",
    poster_path: "https://image.tmdb.org/t/p/w500/lfRkUr7DYdHldAqi3PwdQGBRBPM.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/90A8CvR4yv2ZkYj3M1N2PzYw0lA.jpg",
    genres: ["Comedy", "Drama", "Romance"],
    genre_ids: [35, 18, 10749],
    director: "Aditya Chopra",
    cast: ["Shah Rukh Khan", "Kajol", "Amrish Puri", "Farida Jalal", "Anupam Kher"],
    country: "India",
    original_language: "hi",
    keywords: ["europe trip", "classic romance", "feel-good", "date-night", "mustard fields", "family values"],
    trailer_key: "oZHNO84WvH8"
  },
  {
    id: 13915,
    title: "Sholay",
    release_date: "1975-08-15",
    year: 1975,
    vote_average: 7.7,
    runtime: 198,
    overview: "After his family is murdered by a notorious bandit, a former police officer enlists the help of two convicts to capture him alive.",
    poster_path: "https://image.tmdb.org/t/p/w500/y1mJbC17lFmC0tW3L4X4x1q8PqA.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/m8P2b3V5b7c8X0m9w1Z7x8P2b3V.jpg",
    genres: ["Action", "Adventure", "Drama"],
    genre_ids: [28, 12, 18],
    director: "Ramesh Sippy",
    cast: ["Dharmendra", "Amitabh Bachchan", "Sanjeev Kumar", "Hema Malini", "Amjad Khan"],
    country: "India",
    original_language: "hi",
    keywords: ["curry western", "gabbar singh", "revenge", "epic action", "classic", "friendship anthem"],
    trailer_key: "h_iOQO1_gXU"
  },
  {
    id: 569547,
    title: "K.G.F: Chapter 1",
    release_date: "2018-12-21",
    year: 2018,
    vote_average: 7.6,
    runtime: 156,
    overview: "In the 1970s, a fierce rebel rises against brutal oppression and becomes the symbol of hope to legions of downtrodden people in the Kolar Gold Fields.",
    poster_path: "https://image.tmdb.org/t/p/w500/xWZy8q3xW5H7B8n9V9Z9X6xWZy8.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/9xWZy8q3xW5H7B8n9V9Z9X6xWZy.jpg",
    genres: ["Action", "Crime", "Drama"],
    genre_ids: [28, 80, 18],
    director: "Prashanth Neel",
    cast: ["Yash", "Srinidhi Shetty", "Ramachandra Raju", "Archana Jois"],
    country: "India",
    original_language: "kn",
    keywords: ["gold mines", "mass hero", "rebellion", "epic action", "mother promise", "underworld"],
    trailer_key: "-KfsY-qw908"
  },
  {
    id: 350312,
    title: "Baahubali 2: The Conclusion",
    release_date: "2017-04-28",
    year: 2017,
    vote_average: 7.8,
    runtime: 167,
    overview: "When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.",
    poster_path: "https://image.tmdb.org/t/p/w500/9BAjt8nSSms62uOVYn1t3C3dVto.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/9BAjt8nSSms62uOVYn1t3C3dVto.jpg",
    genres: ["Action", "Adventure", "Fantasy"],
    genre_ids: [28, 12, 14],
    director: "S.S. Rajamouli",
    cast: ["Prabhas", "Rana Daggubati", "Anushka Shetty", "Sathyaraj", "Ramya Krishnan"],
    country: "India",
    original_language: "te",
    keywords: ["why kattappa killed baahubali", "royal betrayal", "epic war", "mythological fantasy", "spectacle"],
    trailer_key: "G62HrubdD6o"
  },
  {
    id: 5902,
    title: "Pather Panchali",
    release_date: "1955-08-26",
    year: 1955,
    vote_average: 8.0,
    runtime: 125,
    overview: "Impoverished priest Harihar Ray, dreaming of a better life for himself and his family, leaves his rural Bengal village in search of work.",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/9/91/Pather_Panchali_poster.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/9/91/Pather_Panchali_poster.jpg",
    genres: ["Drama"],
    genre_ids: [18],
    director: "Satyajit Ray",
    cast: ["Subir Banerjee", "Kanu Banerjee", "Karuna Banerjee", "Uma Dasgupta", "Chunibala Devi"],
    country: "India",
    original_language: "bn",
    keywords: ["apu trilogy", "neorealism", "childhood", "rural bengal", "masterpiece", "poetic"],
    trailer_key: "6kI_BvJ-kZg"
  }
];

const existingIds = new Set(movies.map(m => m.id));
for (const m of moreIndian) {
  if (!existingIds.has(m.id)) {
    movies.push(m);
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(movies, null, 2), 'utf-8');
console.log('Saved! Total movies in curatedMovies.json:', movies.length);
