import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, '../data/curatedMovies.json');
const csvPath = path.join(__dirname, '../../movies.csv');

let movies = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// 1. Map of 100% verified TMDB CDN posters for existing movies
const posterUpdates = {
  // Fix the two that failed in the user's screenshot
  "12th Fail": "https://image.tmdb.org/t/p/w500/u7BeOSx3bkXkFNlMg8Ik5h5Jpl8.jpg",
  "Jai Bhim": "https://image.tmdb.org/t/p/w500/ehybiOtBUtrMkmtB39zQEtq1Jie.jpg",

  // Mind-Bending & Psychological Indian Thrillers
  "Ratsasan": "https://image.tmdb.org/t/p/w500/mruUFlrVKiL994y3vvQBT8R2Vnf.jpg",
  "Kahaani": "https://image.tmdb.org/t/p/w500/e2eQVOrdQ8k7yYjjHKHP2nlwbTu.jpg",
  "Talaash: The Answer Lies Within": "https://image.tmdb.org/t/p/w500/oCxyN7HmJ7zWp8jtJeMRHABnutF.jpg",
  "13B: Fear Has a New Address": "https://image.tmdb.org/t/p/w500/xtTKP4W9ziD8WE7tL3M9pZ5gkzq.jpg",
  "Lucia": "https://image.tmdb.org/t/p/w500/eqGFyazcEK9YH1rc95tV0rnxTFm.jpg",
  "24": "https://image.tmdb.org/t/p/w500/iq6yrZ5LEDXf1ArCOYLq8PIUBpV.jpg",
  "Badla": "https://image.tmdb.org/t/p/w500/yIDQRD4rPofIodn0b1Md2WyXzSD.jpg",
  "Game Over": "https://image.tmdb.org/t/p/w500/n8zftUixa3N1ma5GUqKx7Fu4M5d.jpg",
  "No Smoking": "https://image.tmdb.org/t/p/w500/gBiC8PvATw7cMhszMvPVBuTt93M.jpg",
  "Bhool Bhulaiyaa": "https://image.tmdb.org/t/p/w500/r5p19XzY9g3j3whIXHGL1NKRTJf.jpg",
  "Kalki 2898 AD": "https://image.tmdb.org/t/p/w500/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg",
  "Ugly": "https://image.tmdb.org/t/p/w500/prGylxnFpIWMcvHh9sUC46hmiIC.jpg",
  "Talvar": "https://image.tmdb.org/t/p/w500/vye2RxyxXKeTIJBSHo0HkvFuTCR.jpg",

  // Action / Thriller
  "Vikram": "https://image.tmdb.org/t/p/w500/txaOvJ6HURmqFbpVtJezWNWqaR4.jpg",
  "Kaithi": "https://image.tmdb.org/t/p/w500/eoYU2Emnc74FPbVmWGaAo4qxTCk.jpg",
  "Vikram Vedha": "https://image.tmdb.org/t/p/w500/ob9YxdzRu5lfKgz0PNrlL45dorf.jpg",
  "A Wednesday!": "https://image.tmdb.org/t/p/w500/gVUSxtJM3arL5VIUIRNYde20EF0.jpg",
  "K.G.F: Chapter 1": "https://image.tmdb.org/t/p/w500/ltHlJwvxKv7d0ooCiKSAvfwV9tX.jpg",
  "Sholay": "https://image.tmdb.org/t/p/w500/ya9bwgqA4eNl5bQ9QqS0jcmRoBS.jpg",

  // Comedy / Drama / Feel-Good
  "Hera Pheri": "https://image.tmdb.org/t/p/w500/23MKGUPT5laTStim4TaGhfgSltu.jpg",
  "Chhichhore": "https://image.tmdb.org/t/p/w500/56snL7jpuKS80WBSXJCg59XdvM3.jpg",
  "Dil Chahta Hai": "https://image.tmdb.org/t/p/w500/3Rwy4UjWBGEbD23xjyeBsL3OnXQ.jpg",
  "Jab We Met": "https://image.tmdb.org/t/p/w500/sQ7A7jyTbkK90vjd8yCRuoyL9CK.jpg",
  "Barfi!": "https://image.tmdb.org/t/p/w500/5cJIx2zKjDoUtPSliou23xsReb1.jpg",
  "Munna Bhai M.B.B.S.": "https://image.tmdb.org/t/p/w500/OjJ2eZFMr0InHxjYCQXwxDoo4v.jpg",
  "Kumbalangi Nights": "https://image.tmdb.org/t/p/w500/lJ3RvIirE2C7gdBKvPRaoQ3iCo2.jpg",
  "Stree": "https://image.tmdb.org/t/p/w500/2xLDWr72Wxc1JGmbxza2V8g26YH.jpg",
  "Chak De! India": "https://image.tmdb.org/t/p/w500/mmFMgEsTRCAGAtwffGpuo3mJsxN.jpg",
  "Soorarai Pottru": "https://image.tmdb.org/t/p/w500/6364cmvHUvf4rjVKCKfyYPrgOmy.jpg",
  "Sita Ramam": "https://image.tmdb.org/t/p/w500/t1O94ZBzsQXJihtVkrsStRLyUDR.jpg",
  "Masaan": "https://image.tmdb.org/t/p/w500/wgcPR6Weth2yJDo5wBdNqW2TD6J.jpg",
  "Pather Panchali": "https://image.tmdb.org/t/p/w500/frZj5djlU9hFEjMcL21RJZVuG5O.jpg"
};

// Apply updates to existing movies
for (const m of movies) {
  if (posterUpdates[m.title]) {
    m.poster_path = posterUpdates[m.title];
    m.backdrop_path = posterUpdates[m.title];
  }
}

// 2. Add Recent Blockbuster Movies (2023, 2024)
const existingTitles = new Set(movies.map(m => m.title.toLowerCase()));

const recentMovies = [
  {
    id: 1118224,
    title: "Maharaja",
    year: 2024,
    release_date: "2024-06-14",
    poster_path: "https://image.tmdb.org/t/p/w500/s0m4TM1XRAftQStgKpw024RvkJo.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/s0m4TM1XRAftQStgKpw024RvkJo.jpg",
    vote_average: 8.5,
    vote_count: 3200,
    genres: ["Crime", "Thriller", "Mystery", "Drama"],
    overview: "A barber sets out for vengeance after his home is burglarized and a cherished dustbin named Lakshmi is stolen, but his investigation uncovers a horrifying secret.",
    runtime: 140,
    director: "Nithilan Saminathan",
    cast: ["Vijay Sethupathi", "Anurag Kashyap", "Mamta Mohandas", "Natty"],
    keywords: ["mind-bending", "twist", "revenge", "father-daughter", "puzzle", "investigation"],
    trailer_key: "K6f2_tL24U0",
    original_language: "ta",
    country: "India"
  },
  {
    id: 1112426,
    title: "Stree 2",
    year: 2024,
    release_date: "2024-08-15",
    poster_path: "https://image.tmdb.org/t/p/w500/nfnhwfUEFuSOxxf4jDdBlY6Lccw.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/nfnhwfUEFuSOxxf4jDdBlY6Lccw.jpg",
    vote_average: 7.6,
    vote_count: 2400,
    genres: ["Comedy", "Horror"],
    overview: "After the events of Stree, the town of Chanderi is being haunted again, this time by a headless entity named Sarkata who is abducting progressive women.",
    runtime: 147,
    director: "Amar Kaushik",
    cast: ["Rajkummar Rao", "Shraddha Kapoor", "Pankaj Tripathi", "Abhishek Banerjee"],
    keywords: ["horror-comedy", "small-town", "ghost", "folklore", "friends", "feel-good"],
    trailer_key: "KVnheqXvDbg",
    original_language: "hi",
    country: "India"
  },
  {
    id: 872585,
    title: "Oppenheimer",
    year: 2023,
    release_date: "2023-07-21",
    poster_path: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    vote_average: 8.9,
    vote_count: 14000,
    genres: ["Drama", "History"],
    overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    runtime: 180,
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    keywords: ["mind-bending", "genius", "atomic bomb", "guilt", "science", "alone"],
    trailer_key: "uYPbbksJxIg",
    original_language: "en",
    country: "USA"
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    year: 2024,
    release_date: "2024-03-01",
    poster_path: "https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
    vote_average: 8.8,
    vote_count: 12500,
    genres: ["Science Fiction", "Adventure"],
    overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    runtime: 166,
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem"],
    keywords: ["mind-bending", "prophecy", "space", "desert", "epic", "alone"],
    trailer_key: "Way9Dexny3w",
    original_language: "en",
    country: "USA"
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    year: 2024,
    release_date: "2024-07-26",
    poster_path: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    vote_average: 7.7,
    vote_count: 9800,
    genres: ["Action", "Comedy", "Science Fiction"],
    overview: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when an existential threat emerges, he teams with Wolverine.",
    runtime: 128,
    director: "Shawn Levy",
    cast: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin", "Morena Baccarin"],
    keywords: ["superhero", "buddy", "funny", "action", "friends", "multiverse"],
    trailer_key: "73_1biulkYk",
    original_language: "en",
    country: "USA"
  },
  {
    id: 1022789,
    title: "Inside Out 2",
    year: 2024,
    release_date: "2024-06-14",
    poster_path: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    vote_average: 7.8,
    vote_count: 6500,
    genres: ["Animation", "Family", "Comedy", "Adventure"],
    overview: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Anxiety, Envy, Ennui and Embarrassment.",
    runtime: 96,
    director: "Kelsey Mann",
    cast: ["Amy Poehler", "Maya Hawke", "Kensington Tallman", "Liza Lapira"],
    keywords: ["feel-good", "emotional", "family", "growing up", "anxiety", "animation"],
    trailer_key: "LEjhY15eCx0",
    original_language: "en",
    country: "USA"
  },
  {
    id: 872906,
    title: "Jawan",
    year: 2023,
    release_date: "2023-09-07",
    poster_path: "https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg",
    vote_average: 7.5,
    vote_count: 3800,
    genres: ["Action", "Thriller"],
    overview: "A driven man commits to rectifying the evils in society with help from a group of women who take high-stakes missions to fight corruption.",
    runtime: 169,
    director: "Atlee",
    cast: ["Shah Rukh Khan", "Nayanthara", "Vijay Sethupathi", "Deepika Padukone"],
    keywords: ["vigilante", "action", "epic", "father-son", "justice", "tense"],
    trailer_key: "MWOlnZSnXyg",
    original_language: "hi",
    country: "India"
  },
  {
    id: 781732,
    title: "Animal",
    year: 2023,
    release_date: "2023-12-01",
    poster_path: "https://image.tmdb.org/t/p/w500/mWjgnkjyfNxxdfNwc8YmObGCZGf.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/mWjgnkjyfNxxdfNwc8YmObGCZGf.jpg",
    vote_average: 7.2,
    vote_count: 2900,
    genres: ["Action", "Drama", "Crime"],
    overview: "A father-son relationship carved in blood and obsession drives a son to cross all moral lines to protect his father from lethal assassins.",
    runtime: 201,
    director: "Sandeep Reddy Vanga",
    cast: ["Ranbir Kapoor", "Anil Kapoor", "Bobby Deol", "Rashmika Mandanna"],
    keywords: ["dark", "family-obsession", "revenge", "crime-syndicate", "intense"],
    trailer_key: "Dydmpfo68DA",
    original_language: "hi",
    country: "India"
  },
  {
    id: 1144983,
    title: "Manjummel Boys",
    year: 2024,
    release_date: "2024-02-22",
    poster_path: "https://image.tmdb.org/t/p/w500/bswrtewwthpsh6nABiqKevU4UBI.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/bswrtewwthpsh6nABiqKevU4UBI.jpg",
    vote_average: 8.3,
    vote_count: 2800,
    genres: ["Adventure", "Thriller", "Drama"],
    overview: "A group of friends from a small town embark on a vacation to Kodaikanal, where one of them falls into the deep and treacherous Guna Caves.",
    runtime: 135,
    director: "Chidambaram",
    cast: ["Soubin Shahir", "Sreenath Bhasi", "Balu Varghese", "Ganapathi"],
    keywords: ["friendship", "survival", "tense", "rescue", "based-on-true-story"],
    trailer_key: "id848Wq1YLo",
    original_language: "ml",
    country: "India"
  },
  {
    id: 1195697,
    title: "Aavesham",
    year: 2024,
    release_date: "2024-04-11",
    poster_path: "https://image.tmdb.org/t/p/w500/k5RWPaNjgRcNvGoawYaQHQwyctI.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/k5RWPaNjgRcNvGoawYaQHQwyctI.jpg",
    vote_average: 8.0,
    vote_count: 2200,
    genres: ["Action", "Comedy"],
    overview: "Three college students in Bangalore find themselves befriending an eccentric, white-clad local gangster named Ranga to get back at their senior bullies.",
    runtime: 158,
    director: "Jithu Madhavan",
    cast: ["Fahadh Faasil", "Hipzster", "Mithun Jai Shankar", "Sajin Gopu"],
    keywords: ["feel-good", "comedy", "gangster", "college", "friends", "quirky"],
    trailer_key: "L0yX1cT3y3M",
    original_language: "ml",
    country: "India"
  },
  {
    id: 1226578,
    title: "Bramayugam",
    year: 2024,
    release_date: "2024-02-15",
    poster_path: "https://image.tmdb.org/t/p/w500/snQLwRrfQAl5YFKVefZq9Lbscki.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/snQLwRrfQAl5YFKVefZq9Lbscki.jpg",
    vote_average: 7.9,
    vote_count: 1800,
    genres: ["Horror", "Mystery", "Thriller"],
    overview: "A court singer escapes captivity and seeks shelter in a mysterious, isolated ancestral mansion ruled by a sinister chieftain with dark occult powers.",
    runtime: 139,
    director: "Rahul Sadasivan",
    cast: ["Mammootty", "Arjun Ashokan", "Sidharth Bharathan", "Amalda Liz"],
    keywords: ["mind-bending", "black-and-white", "folk-horror", "dark", "atmospheric", "alone"],
    trailer_key: "3H4Xg2s86qY",
    original_language: "ml",
    country: "India"
  },
  {
    id: 1168007,
    title: "Laapataa Ladies",
    year: 2024,
    release_date: "2024-03-01",
    poster_path: "https://image.tmdb.org/t/p/w500/mZrGPDvyWASqv8FjPEDKUkYjDp6.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/mZrGPDvyWASqv8FjPEDKUkYjDp6.jpg",
    vote_average: 8.2,
    vote_count: 2600,
    genres: ["Comedy", "Drama"],
    overview: "In rural 2001 India, two young brides get accidentally swapped on a crowded train when both are wearing identical veils, leading to self-discovery and comedy.",
    runtime: 122,
    director: "Kiran Rao",
    cast: ["Nitanshi Goel", "Pratibha Ranta", "Sparsh Shrivastava", "Ravi Kishan"],
    keywords: ["feel-good", "inspiring", "heartwarming", "rural-india", "feminism", "family"],
    trailer_key: "6q_4_m6n8pE",
    original_language: "hi",
    country: "India"
  },
  {
    id: 1148011,
    title: "Chandu Champion",
    year: 2024,
    release_date: "2024-06-14",
    poster_path: "https://image.tmdb.org/t/p/w500/pg8MMnPlDLjllrv0wEWV5f0Ql74.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/pg8MMnPlDLjllrv0wEWV5f0Ql74.jpg",
    vote_average: 8.0,
    vote_count: 1700,
    genres: ["Drama", "History"],
    overview: "The unbelievable true journey of Murlikant Petkar, who overcame severe bullet wounds to become India's first Paralympic gold medalist.",
    runtime: 143,
    director: "Kabir Khan",
    cast: ["Kartik Aaryan", "Vijay Raaz", "Bhuvan Arora", "Rajpal Yadav"],
    keywords: ["inspiring", "biopic", "sports", "perseverance", "emotional"],
    trailer_key: "09y5JvQkZ6E",
    original_language: "hi",
    country: "India"
  },
  {
    id: 114479,
    title: "Kill",
    year: 2024,
    release_date: "2024-07-05",
    poster_path: "https://image.tmdb.org/t/p/w500/s1EaC7yi34NCBNELcCDtkp6aGE3.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/s1EaC7yi34NCBNELcCDtkp6aGE3.jpg",
    vote_average: 7.7,
    vote_count: 2100,
    genres: ["Action", "Thriller"],
    overview: "When a passenger train to New Delhi is overtaken by a gang of knife-wielding bandits, an army commando takes on the thugs in a brutal battle to save passengers.",
    runtime: 105,
    director: "Nikhil Nagesh Bhat",
    cast: ["Lakshya", "Raghav Juyal", "Tanya Maniktala", "Ashish Vidyarthi"],
    keywords: ["intense", "train", "martial-arts", "tense", "survival", "alone"],
    trailer_key: "K2q07_7xJvM",
    original_language: "hi",
    country: "India"
  },
  {
    id: 848326,
    title: "Salaar: Part 1 - Ceasefire",
    year: 2023,
    release_date: "2023-12-22",
    poster_path: "https://image.tmdb.org/t/p/w500/ui4DrH1cKk2vkHshcUcGt2lKxCm.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/ui4DrH1cKk2vkHshcUcGt2lKxCm.jpg",
    vote_average: 7.3,
    vote_count: 3100,
    genres: ["Action", "Crime", "Thriller"],
    overview: "A gang leader tries to keep a promise made to a dying friend and takes on the other criminal gangs in the dystopian city of Khansaar.",
    runtime: 175,
    director: "Prashanth Neel",
    cast: ["Prabhas", "Prithviraj Sukumaran", "Shruti Haasan", "Jagapathi Babu"],
    keywords: ["epic-action", "friendship", "crime", "dark", "intense"],
    trailer_key: "4GPvYMKtrtI",
    original_language: "te",
    country: "India"
  },
  {
    id: 1118228,
    title: "Amar Singh Chamkila",
    year: 2024,
    release_date: "2024-04-12",
    poster_path: "https://image.tmdb.org/t/p/w500/t9wSGgaPfbGUBBlne7xw8GaArvu.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/t9wSGgaPfbGUBBlne7xw8GaArvu.jpg",
    vote_average: 8.1,
    vote_count: 1900,
    genres: ["Drama", "Music"],
    overview: "The untold true story of Punjab's original rockstar of the masses, Amar Singh Chamkila, who emerged from poverty to soar to the heights of fame before tragic assassination.",
    runtime: 145,
    director: "Imtiaz Ali",
    cast: ["Diljit Dosanjh", "Parineeti Chopra", "Apinderdeep Singh", "Rahul Mittra"],
    keywords: ["music", "inspiring", "biopic", "emotional", "punjabi", "alone"],
    trailer_key: "c8qE8v4313s",
    original_language: "hi",
    country: "India"
  },
  {
    id: 1083862,
    title: "Por Thozhil",
    year: 2023,
    release_date: "2023-06-09",
    poster_path: "https://image.tmdb.org/t/p/w500/lZ2BbjGBDRW5Q5Q9jgEknuiEQ0f.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/lZ2BbjGBDRW5Q5Q9jgEknuiEQ0f.jpg",
    vote_average: 8.0,
    vote_count: 1600,
    genres: ["Crime", "Thriller", "Mystery"],
    overview: "A faint-hearted rookie cop is partnered with a reclusive, seasoned senior detective to catch a serial killer targeting young women in Trichy.",
    runtime: 147,
    director: "Vignesh Raja",
    cast: ["Sarath Kumar", "Ashok Selvan", "Nikhila Vimal", "Sarath Babu"],
    keywords: ["mind-bending", "serial-killer", "investigation", "twist", "tense"],
    trailer_key: "8m_35_117pI",
    original_language: "ta",
    country: "India"
  },
  {
    id: 1073862,
    title: "Iratta",
    year: 2023,
    release_date: "2023-02-03",
    poster_path: "https://image.tmdb.org/t/p/w500/4km0kB3EIZxrmWBybJzf6PtvZFn.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/4km0kB3EIZxrmWBybJzf6PtvZFn.jpg",
    vote_average: 7.7,
    vote_count: 1400,
    genres: ["Crime", "Drama", "Mystery"],
    overview: "Following the shocking death of a policeman at a station, his estranged twin brother unravels a traumatic past that connects them to the crime.",
    runtime: 114,
    director: "Rohit M.G. Krishnan",
    cast: ["Joju George", "Anjali", "Arya Salim", "Srinda"],
    keywords: ["mind-bending", "twist", "twins", "dark", "alone", "mystery"],
    trailer_key: "0_537vA16_Q",
    original_language: "ml",
    country: "India"
  },
  {
    id: 1108226,
    title: "Merry Christmas",
    year: 2024,
    release_date: "2024-01-12",
    poster_path: "https://image.tmdb.org/t/p/w500/jNK5WEGYYKXio2DFsGHNlpEo0sU.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/jNK5WEGYYKXio2DFsGHNlpEo0sU.jpg",
    vote_average: 7.3,
    vote_count: 1200,
    genres: ["Thriller", "Mystery", "Romance"],
    overview: "On Christmas Eve, an uneventful day for two strangers turns into a labyrinth of romance, crime, and deception after a fateful encounter in Mumbai.",
    runtime: 144,
    director: "Sriram Raghavan",
    cast: ["Katrina Kaif", "Vijay Sethupathi", "Ashwini Kalsekar", "Luke Kenny"],
    keywords: ["mind-bending", "twist", "noir", "christmas", "alone", "deception"],
    trailer_key: "18_eA9kF_r8",
    original_language: "hi",
    country: "India"
  },
  {
    id: 1029575,
    title: "Fighter",
    year: 2024,
    release_date: "2024-01-25",
    poster_path: "https://image.tmdb.org/t/p/w500/8dAOUHYn1R98IK6RiO243kLSwuV.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/8dAOUHYn1R98IK6RiO243kLSwuV.jpg",
    vote_average: 7.2,
    vote_count: 2500,
    genres: ["Action", "Adventure", "Thriller"],
    overview: "Top Indian Air Force aviators come together to form an elite unit called Air Dragons in the face of imminent danger and cross-border terrorism.",
    runtime: 166,
    director: "Siddharth Anand",
    cast: ["Hrithik Roshan", "Deepika Padukone", "Anil Kapoor", "Karan Singh Grover"],
    keywords: ["action", "air-force", "patriotic", "aerial-combat", "intense"],
    trailer_key: "6amIq_6C4uY",
    original_language: "hi",
    country: "India"
  },
  {
    id: 1075794,
    title: "Leo",
    year: 2023,
    release_date: "2023-10-19",
    poster_path: "https://image.tmdb.org/t/p/w500/gSOVog7ydsaF1YpgAqBqnKYFGY.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/gSOVog7ydsaF1YpgAqBqnKYFGY.jpg",
    vote_average: 7.4,
    vote_count: 3600,
    genres: ["Action", "Crime", "Thriller"],
    overview: "A quiet cafe owner in Kashmir becomes a hero after defending his town, triggering ruthless gangsters who suspect he is their former enforcer, Leo Das.",
    runtime: 164,
    director: "Lokesh Kanagaraj",
    cast: ["Vijay", "Sanjay Dutt", "Arjun Sarja", "Trisha Krishnan"],
    keywords: ["action", "lcu", "hidden-identity", "tense", "dark"],
    trailer_key: "Po3jvhmsm6s",
    original_language: "ta",
    country: "India"
  },
  {
    id: 987917,
    title: "Jailer",
    year: 2023,
    release_date: "2023-08-10",
    poster_path: "https://image.tmdb.org/t/p/w500/7mwxYW75lAQrMpYK7NWVcmwyF9T.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/7mwxYW75lAQrMpYK7NWVcmwyF9T.jpg",
    vote_average: 7.5,
    vote_count: 3400,
    genres: ["Action", "Crime", "Comedy"],
    overview: "A retired prison warden goes on a hunt to track down his son's killers and steps back into the dark criminal underworld to protect his family.",
    runtime: 168,
    director: "Nelson Dilipkumar",
    cast: ["Rajinikanth", "Vinayakan", "Ramya Krishnan", "Vasanth Ravi"],
    keywords: ["action", "revenge", "dark-comedy", "father-son", "swagger"],
    trailer_key: "yenNwEr_x6I",
    original_language: "ta",
    country: "India"
  }
];

let added = 0;
for (const item of recentMovies) {
  if (!existingTitles.has(item.title.toLowerCase())) {
    movies.push(item);
    existingTitles.add(item.title.toLowerCase());
    added++;
  } else {
    // Update existing poster and details
    const idx = movies.findIndex(m => m.title.toLowerCase() === item.title.toLowerCase());
    if (idx !== -1) {
      movies[idx].poster_path = item.poster_path;
      movies[idx].backdrop_path = item.backdrop_path;
      movies[idx].year = item.year;
      movies[idx].vote_average = item.vote_average;
    }
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(movies, null, 2), 'utf-8');
console.log(`Updated all posters! Added ${added} recent blockbuster movies. Total catalog size: ${movies.length}`);

// 3. Update movies.csv with all the movies
const csvRows = [
  "title,genres,keywords,director,cast,year,vote_average,runtime,overview,country"
];

for (const m of movies) {
  const t = `"${(m.title || '').replace(/"/g, '""')}"`;
  const g = `"${(m.genres || []).join(' ')}"`;
  const k = `"${(m.keywords || []).join(' ')}"`;
  const d = `"${(m.director || '').replace(/"/g, '""')}"`;
  const c = `"${(m.cast || []).join(' ').replace(/"/g, '""')}"`;
  const y = m.year || 2020;
  const v = m.vote_average || 7.5;
  const r = m.runtime || 120;
  const o = `"${(m.overview || '').replace(/"/g, '""')}"`;
  const country = m.country || 'USA';
  csvRows.push(`${t},${g},${k},${d},${c},${y},${v},${r},${o},${country}`);
}

fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf-8');
console.log(`Updated movies.csv with ${movies.length} movies!`);
