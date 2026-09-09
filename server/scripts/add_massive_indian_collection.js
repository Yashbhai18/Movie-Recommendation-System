import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, '../data/curatedMovies.json');
const currentMovies = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
const existingIds = new Set(currentMovies.map(m => m.id));

const newIndianCollection = [
  // --- MIND-BENDING & PSYCHOLOGICAL THRILLERS ---
  {
    id: 86837,
    title: "Kahaani",
    release_date: "2012-03-09",
    year: 2012,
    vote_average: 7.7,
    runtime: 122,
    overview: "A pregnant woman arrives in Kolkata from London to search for her missing husband, but everyone she questions denies having ever met him, leading into a labyrinth of deception.",
    genres: ["Mystery", "Thriller", "Drama"],
    genre_ids: [9648, 53, 18],
    director: "Sujoy Ghosh",
    cast: ["Vidya Balan", "Parambrata Chatterjee", "Nawazuddin Siddiqui", "Saswata Chatterjee"],
    country: "India",
    original_language: "hi",
    keywords: ["mind-bending", "kolkata", "pregnant woman", "twist", "investigation", "mystery", "subconscious", "alone"],
    trailer_key: "rsX7a_Lw9Y8"
  },
  {
    id: 84332,
    title: "Talaash: The Answer Lies Within",
    release_date: "2012-11-30",
    year: 2012,
    vote_average: 7.2,
    runtime: 140,
    overview: "A brooding police officer investigating a film star's mysterious death finds himself haunted by suppressed memories of his deceased son and guided by an enigmatic escort.",
    genres: ["Mystery", "Drama", "Thriller"],
    genre_ids: [9648, 18, 53],
    director: "Reema Kagti",
    cast: ["Aamir Khan", "Kareena Kapoor Khan", "Rani Mukerji", "Nawazuddin Siddiqui"],
    country: "India",
    original_language: "hi",
    keywords: ["mind-bending", "supernatural mystery", "insomnia", "red light district", "haunted", "alone", "twist"],
    trailer_key: "M977pI9yR0c"
  },
  {
    id: 28994,
    title: "13B: Fear Has a New Address",
    release_date: "2009-03-06",
    year: 2009,
    vote_average: 6.9,
    runtime: 146,
    overview: "A man experiences supernatural events in his new apartment, where an ominous television soap opera begins predicting the future of his family in exact terrifying detail.",
    genres: ["Horror", "Mystery", "Thriller"],
    genre_ids: [27, 9648, 53],
    director: "Vikram K. Kumar",
    cast: ["R. Madhavan", "Neetu Chandra", "Poonam Dhillon", "Sachin Khedekar"],
    country: "India",
    original_language: "hi",
    keywords: ["mind-bending", "television", "curse", "apartment", "psychological", "alone", "late night"],
    trailer_key: "K2qfB1N_J2Y"
  },
  {
    id: 220970,
    title: "Lucia",
    release_date: "2013-09-06",
    year: 2013,
    vote_average: 7.7,
    runtime: 135,
    overview: "An insomniac usher gets tricked into buying an experimental drug that lets him live out his wildest fantasies in lucid dreams, but blurs the boundary between reality and dream world.",
    genres: ["Science Fiction", "Thriller", "Mystery", "Drama"],
    genre_ids: [878, 53, 9648, 18],
    director: "Pawan Kumar",
    cast: ["Sathish Ninasam", "Sruthi Hariharan", "Achyuth Kumar"],
    country: "India",
    original_language: "kn",
    keywords: ["mind-bending", "lucid dream", "insomnia", "drugs", "simulation", "reality warping", "alone"],
    trailer_key: "cT7hZz2EaE0"
  },
  {
    id: 384018,
    title: "24",
    release_date: "2016-05-06",
    year: 2016,
    vote_average: 7.4,
    runtime: 164,
    overview: "A brilliant watchmaker invents a time-travel watch. Decades later, his son must protect the device from his ruthless twin uncle who seeks to rewrite history.",
    genres: ["Science Fiction", "Action", "Thriller"],
    genre_ids: [878, 28, 53],
    director: "Vikram K. Kumar",
    cast: ["Suriya", "Samantha Ruth Prabhu", "Nithya Menen", "Saranya Ponvannan"],
    country: "India",
    original_language: "ta",
    keywords: ["mind-bending", "time travel", "watchmaker", "relativity", "sci-fi", "inventor", "destiny"],
    trailer_key: "rT22NYwbjzo"
  },
  {
    id: 546554,
    title: "Ratsasan",
    release_date: "2018-10-05",
    year: 2018,
    vote_average: 8.0,
    runtime: 170,
    overview: "An aspiring filmmaker-turned-police sub-inspector uses his deep knowledge of psycho-killer cinema to track down a predatory serial killer terrorizing schoolgirls.",
    genres: ["Crime", "Thriller", "Mystery"],
    genre_ids: [80, 53, 9648],
    director: "Ram Kumar",
    cast: ["Vishnu Vishal", "Amala Paul", "Saravanan", "Kaali Venkat"],
    country: "India",
    original_language: "ta",
    keywords: ["mind-bending", "serial killer", "investigation", "psychological", "tense", "dark", "claustrophobic", "alone"],
    trailer_key: "GsrNqW_5c-M"
  },
  {
    id: 554593,
    title: "Badla",
    release_date: "2019-03-08",
    year: 2019,
    vote_average: 7.1,
    runtime: 118,
    overview: "A dynamic young entrepreneur finds herself locked in a hotel room with the corpse of her dead lover. She hires an undefeated veteran lawyer to solve how it happened in three hours.",
    genres: ["Mystery", "Crime", "Thriller"],
    genre_ids: [9648, 80, 53],
    director: "Sujoy Ghosh",
    cast: ["Amitabh Bachchan", "Taapsee Pannu", "Amrita Singh", "Tony Luke"],
    country: "India",
    original_language: "hi",
    keywords: ["mind-bending", "locked room", "murder mystery", "twists", "unreliable narrator", "puzzle"],
    trailer_key: "mSlgu8AQAd4"
  },
  {
    id: 597890,
    title: "Game Over",
    release_date: "2019-06-14",
    year: 2019,
    vote_average: 7.0,
    runtime: 102,
    overview: "A video game designer suffering from PTSD and anniversary depression finds her house invaded by a mysterious intruder, forcing her into a psychological time loop.",
    genres: ["Thriller", "Mystery", "Drama"],
    genre_ids: [53, 9648, 18],
    director: "Ashwin Saravanan",
    cast: ["Taapsee Pannu", "Vinodhini Vaidyanathan", "Anish Kuruvilla"],
    country: "India",
    original_language: "ta",
    keywords: ["mind-bending", "time loop", "video game", "home invasion", "alone", "claustrophobic", "paranoia"],
    trailer_key: "Y3W8y_0c1_g"
  },
  {
    id: 13994,
    title: "No Smoking",
    release_date: "2007-10-26",
    year: 2007,
    vote_average: 6.8,
    runtime: 125,
    overview: "A chain-smoker visits a mysterious rehabilitation center Prayogshala run by an eccentric guru, only to find himself trapped in a nightmarish Kafkaesque labyrinth.",
    genres: ["Thriller", "Mystery", "Drama"],
    genre_ids: [53, 9648, 18],
    director: "Anurag Kashyap",
    cast: ["John Abraham", "Ayesha Takia", "Paresh Rawal", "Ranvir Shorey"],
    country: "India",
    original_language: "hi",
    keywords: ["mind-bending", "kafkaesque", "surreal", "psychological", "labyrinth", "existential", "alone"],
    trailer_key: "K2qfB1N_J2Y"
  },
  {
    id: 13190,
    title: "Bhool Bhulaiyaa",
    release_date: "2007-10-12",
    year: 2007,
    vote_average: 7.4,
    runtime: 159,
    overview: "When an ancestral palace is reopened by a returning prince, strange events begin occurring. A non-conformist psychiatrist is called in to separate ancient ghost lore from psychological trauma.",
    genres: ["Comedy", "Horror", "Mystery"],
    genre_ids: [35, 27, 9648],
    director: "Priyadarshan",
    cast: ["Akshay Kumar", "Vidya Balan", "Shiney Ahuja", "Ameesha Patel", "Paresh Rawal"],
    country: "India",
    original_language: "hi",
    keywords: ["mind-bending", "dissociative identity disorder", "palace", "psychological", "manjulika", "funny"],
    trailer_key: "zXl14x8qjW8"
  },
  {
    id: 799883,
    title: "Kalki 2898 AD",
    release_date: "2024-06-27",
    year: 2024,
    vote_average: 7.2,
    runtime: 181,
    overview: "In a post-apocalyptic future in the year 2898 AD, a battle erupts in the last surviving city of Kasi as forces fight over the unborn avatar predicted to end the Kali Yuga.",
    genres: ["Science Fiction", "Action", "Fantasy"],
    genre_ids: [878, 28, 14],
    director: "Nag Ashwin",
    cast: ["Prabhas", "Amitabh Bachchan", "Kamal Haasan", "Deepika Padukone", "Disha Patani"],
    country: "India",
    original_language: "te",
    keywords: ["mind-bending", "dystopian", "sci-fi", "mythology", "ashwatthama", "post-apocalyptic", "spectacle"],
    trailer_key: "kQDd1AhGIHk"
  },
  {
    id: 184346,
    title: "Ugly",
    release_date: "2013-12-26",
    year: 2013,
    vote_average: 7.7,
    runtime: 128,
    overview: "When a struggling actor leaves his ten-year-old daughter in a car and she vanishes, the search spirals into a venomous web of ego, greed, and moral decay.",
    genres: ["Thriller", "Crime", "Mystery", "Drama"],
    genre_ids: [53, 80, 9648, 18],
    director: "Anurag Kashyap",
    cast: ["Rahul Bhat", "Ronit Roy", "Tejaswini Kolhapure", "Vineet Kumar Singh"],
    country: "India",
    original_language: "hi",
    keywords: ["dark", "mind-bending", "greed", "kidnapping", "unflinching", "alone", "noir"],
    trailer_key: "o_9v310Q8zM"
  },

  // --- TENSE / THRILLING / CRIME BLOCKBUSTERS ---
  {
    id: 744114,
    title: "Vikram",
    release_date: "2022-06-03",
    year: 2022,
    vote_average: 7.9,
    runtime: 175,
    overview: "A special undercover black-ops commander emerges from the shadows to dismantle a lethal drug syndicate run by a masked kingpin, triggering an all-out warfare.",
    genres: ["Action", "Crime", "Thriller"],
    genre_ids: [28, 80, 53],
    director: "Lokesh Kanagaraj",
    cast: ["Kamal Haasan", "Vijay Sethupathi", "Fahadh Faasil", "Suriya", "Narain"],
    country: "India",
    original_language: "ta",
    keywords: ["black ops", "cartel", "guns", "adrenaline", "intense", "spectacle", "friends"],
    trailer_key: "OKBMCL-hr1o"
  },
  {
    id: 633802,
    title: "Kaithi",
    release_date: "2019-10-25",
    year: 2019,
    vote_average: 7.8,
    runtime: 145,
    overview: "A newly released prisoner on his way to see his daughter is forced to drive a truck full of poisoned police officers to the hospital while escaping heavily armed mercenaries.",
    genres: ["Action", "Thriller", "Crime"],
    genre_ids: [28, 53, 80],
    director: "Lokesh Kanagaraj",
    cast: ["Karthi", "Narain", "George Maryan", "Dheena", "Arjun Das"],
    country: "India",
    original_language: "ta",
    keywords: ["one night", "truck chase", "father daughter", "intense", "claustrophobic", "pulse-pounding"],
    trailer_key: "g79sO_0F_x8"
  },
  {
    id: 463843,
    title: "Vikram Vedha",
    release_date: "2017-07-21",
    year: 2017,
    vote_average: 8.0,
    runtime: 147,
    overview: "A ruthless and righteous police inspector pursues an elusive gangster, who surrenders and challenges his concept of good and evil through a series of moral riddles.",
    genres: ["Action", "Crime", "Thriller"],
    genre_ids: [28, 80, 53],
    director: "Pushkar-Gayathri",
    cast: ["R. Madhavan", "Vijay Sethupathi", "Shraddha Srinath", "Varalaxmi Sarathkumar"],
    country: "India",
    original_language: "ta",
    keywords: ["riddle", "morality", "cat and mouse", "vikramaditya betal", "intellectual duel", "thrilling"],
    trailer_key: "1sNrC_v8kR8"
  },
  {
    id: 1111956,
    title: "Manjummel Boys",
    release_date: "2024-02-22",
    year: 2024,
    vote_average: 8.0,
    runtime: 135,
    overview: "Based on an astonishing true incident, a tight-knit group of friends from Kochi travel to Kodaikanal, where one friend falls into the bottomless Guna Cave, leading into an impossible rescue.",
    genres: ["Adventure", "Thriller", "Drama"],
    genre_ids: [12, 53, 18],
    director: "Chidambaram",
    cast: ["Soubin Shahir", "Sreenath Bhasi", "Balu Varghese", "Ganapathi"],
    country: "India",
    original_language: "ml",
    keywords: ["survival", "cave rescue", "friendship", "brotherhood", "inspirational", "tense", "nail-biting"],
    trailer_key: "y81mN_0c2x8"
  },
  {
    id: 12903,
    title: "A Wednesday!",
    release_date: "2008-09-05",
    year: 2008,
    vote_average: 8.1,
    runtime: 104,
    overview: "A retiring police commissioner recounts the most challenging case of his career: a calm Wednesday when an ordinary anonymous citizen phoned in bomb threats across Mumbai demanding justice.",
    genres: ["Drama", "Thriller", "Crime"],
    genre_ids: [18, 53, 80],
    director: "Neeraj Pandey",
    cast: ["Naseeruddin Shah", "Anupam Kher", "Jimmy Sheirgill", "Aamir Bashir"],
    country: "India",
    original_language: "hi",
    keywords: ["common man", "mumbai", "tense", "hostage", "telephone", "pulse-pounding", "gripping"],
    trailer_key: "A0zE9l_VwYg"
  },
  {
    id: 351044,
    title: "Talvar",
    release_date: "2015-10-02",
    year: 2015,
    vote_average: 7.7,
    runtime: 132,
    overview: "An experienced investigative officer faces conflicting theories and entrenched department corruption when investigating the double murder of a teenager and the household servant.",
    genres: ["Drama", "Crime", "Mystery"],
    genre_ids: [18, 80, 9648],
    director: "Meghna Gulzar",
    cast: ["Irrfan Khan", "Konkona Sen Sharma", "Neeraj Kabi", "Sohan Humne"],
    country: "India",
    original_language: "hi",
    keywords: ["aarushi murder", "rashomon effect", "investigation", "mind-bending", "corrupt police", "alone"],
    trailer_key: "K2qfB1N_J2Y"
  },

  // --- FEEL-GOOD & LAUGHTER ---
  {
    id: 21334,
    title: "Hera Pheri",
    release_date: "2000-03-31",
    year: 2000,
    vote_average: 7.9,
    runtime: 156,
    overview: "A destitute landlord and two tenants desperately needing money get an accidental wrong-number phone call from a kidnapper, setting off a hilarious kidnapping extortion heist.",
    genres: ["Comedy", "Crime"],
    genre_ids: [35, 80],
    director: "Priyadarshan",
    cast: ["Paresh Rawal", "Akshay Kumar", "Suniel Shetty", "Tabu", "Om Puri"],
    country: "India",
    original_language: "hi",
    keywords: ["baburao", "comedy", "cult classic", "laugh-out-loud", "wrong number", "friends", "feel-good"],
    trailer_key: "TIQ5hrfermg"
  },
  {
    id: 611414,
    title: "Chhichhore",
    release_date: "2019-09-06",
    year: 2019,
    vote_average: 7.8,
    runtime: 143,
    overview: "A tragic incident forces a grieving father to reunite with his college friends, reminiscing about their hostel days as self-proclaimed losers to teach his son the true meaning of life.",
    genres: ["Comedy", "Drama"],
    genre_ids: [35, 18],
    director: "Nitesh Tiwari",
    cast: ["Sushant Singh Rajput", "Shraddha Kapoor", "Varun Sharma", "Prateik Babbar", "Tahir Raj Bhasin"],
    country: "India",
    original_language: "hi",
    keywords: ["hostel life", "college friends", "wholesome", "nostalgic", "inspiring", "feel-good"],
    trailer_key: "tsxemFX0a7k"
  },
  {
    id: 13995,
    title: "Dil Chahta Hai",
    release_date: "2001-08-10",
    year: 2001,
    vote_average: 7.8,
    runtime: 183,
    overview: "Three inseparable college graduates with vastly different outlooks on love navigate romance, career transitions, and an emotional rift that threatens to test their lifelong bond.",
    genres: ["Comedy", "Drama", "Romance"],
    genre_ids: [35, 18, 10749],
    director: "Farhan Akhtar",
    cast: ["Aamir Khan", "Saif Ali Khan", "Akshaye Khanna", "Preity Zinta", "Dimple Kapadia"],
    country: "India",
    original_language: "hi",
    keywords: ["goa trip", "friendship", "coming of age", "feel-good", "date night", "cult classic"],
    trailer_key: "m13b25V0B10"
  },
  {
    id: 4977,
    title: "Jab We Met",
    release_date: "2007-10-26",
    year: 2007,
    vote_average: 7.7,
    runtime: 138,
    overview: "A despondent Mumbai businessman on the verge of suicide wanders onto a train and meets a vivacious, chatterbox Punjabi girl who turns his orderly universe upside down.",
    genres: ["Romance", "Comedy", "Drama"],
    genre_ids: [10749, 35, 18],
    director: "Imtiaz Ali",
    cast: ["Shahid Kapoor", "Kareena Kapoor Khan", "Dara Singh", "Tarun Arora"],
    country: "India",
    original_language: "hi",
    keywords: ["train journey", "romantic chemistry", "feel-good", "geet", "date night", "uplifting"],
    trailer_key: "io8u36yY-m4"
  },
  {
    id: 127501,
    title: "Barfi!",
    release_date: "2012-09-13",
    year: 2012,
    vote_average: 7.7,
    runtime: 151,
    overview: "A charming deaf and mute young man in Darjeeling forms a tender, whimsical bond with an autistic girl and a high-society woman, exploring love beyond societal norms.",
    genres: ["Comedy", "Drama", "Romance"],
    genre_ids: [35, 18, 10749],
    director: "Anurag Basu",
    cast: ["Ranbir Kapoor", "Priyanka Chopra Jonas", "Ileana D'Cruz", "Saurabh Shukla"],
    country: "India",
    original_language: "hi",
    keywords: ["wholesome", "darjeeling", "sweet romance", "feel-good", "charming", "heartwarming"],
    trailer_key: "ySzv4h4PJ6U"
  },
  {
    id: 14746,
    title: "Munna Bhai M.B.B.S.",
    release_date: "2003-12-19",
    year: 2003,
    vote_average: 7.7,
    runtime: 156,
    overview: "A good-hearted Mumbai underworld gangster cheats his way into medical college to fulfill his father's dream, healing hospital patients through magical hugs and kindness.",
    genres: ["Comedy", "Drama"],
    genre_ids: [35, 18],
    director: "Rajkumar Hirani",
    cast: ["Sanjay Dutt", "Arshad Warsi", "Gracy Singh", "Boman Irani", "Sunil Dutt"],
    country: "India",
    original_language: "hi",
    keywords: ["jaadu ki jhappi", "wholesome", "medical college", "circuit", "feel-good", "family"],
    trailer_key: "6lvw_x_1Qc0"
  },
  {
    id: 577922,
    title: "Kumbalangi Nights",
    release_date: "2019-02-07",
    year: 2019,
    vote_average: 8.2,
    runtime: 135,
    overview: "Four conflicted brothers living in a dilapidated home in backwaters of Kumbalangi learn to let go of toxic patterns and stand together through empathy and love.",
    genres: ["Drama", "Comedy", "Romance"],
    genre_ids: [18, 35, 10749],
    director: "Madhu C. Narayanan",
    cast: ["Shane Nigam", "Soubin Shahir", "Fahadh Faasil", "Sreenath Bhasi"],
    country: "India",
    original_language: "ml",
    keywords: ["brotherhood", "backwaters", "wholesome", "feel-good", "family healing", "masterpiece"],
    trailer_key: "K2qfB1N_J2Y"
  },
  {
    id: 533642,
    title: "Stree",
    release_date: "2018-08-31",
    year: 2018,
    vote_average: 7.3,
    runtime: 128,
    overview: "In a small town, an evil female spirit abducts men during festival season. A talented ladies tailor falls for a mysterious girl while teaming up with his goofy pals to stop the curse.",
    genres: ["Horror", "Comedy"],
    genre_ids: [27, 35],
    director: "Amar Kaushik",
    cast: ["Rajkummar Rao", "Shraddha Kapoor", "Pankaj Tripathi", "Aparshakti Khurana"],
    country: "India",
    original_language: "hi",
    keywords: ["horror comedy", "folklore", "witty", "friends", "hilarious", "witch"],
    trailer_key: "gzeA4xBD3k8"
  },

  // --- INSPIRING & EMOTIONAL MASTERPIECES ---
  {
    id: 1058694,
    title: "12th Fail",
    release_date: "2023-10-27",
    year: 2023,
    vote_average: 8.4,
    runtime: 147,
    overview: "Based on the inspiring real life of Manoj Kumar Sharma, who overcomes extreme poverty in Chambal and works as a toilet cleaner and flour mill grinder to conquer the UPSC IPS exam.",
    genres: ["Drama", "Biography"],
    genre_ids: [18, 36],
    director: "Vidhu Vinod Chopra",
    cast: ["Vikrant Massey", "Medha Shankr", "Anant V Joshi", "Anshumaan Pushkar"],
    country: "India",
    original_language: "hi",
    keywords: ["inspiring", "upsc", "perseverance", "chambal", "triumph", "hope", "alone", "re-start"],
    trailer_key: "we_yT2_5oB8"
  },
  {
    id: 4978,
    title: "Chak De! India",
    release_date: "2007-08-10",
    year: 2007,
    vote_average: 7.8,
    runtime: 153,
    overview: "A disgraced former Indian hockey captain returns to coach the neglected national women's hockey team, uniting sixteen women from disparate backgrounds to fight for world glory.",
    genres: ["Drama", "History"],
    genre_ids: [18, 36],
    director: "Shimit Amin",
    cast: ["Shah Rukh Khan", "Vidya Malvade", "Sagarika Ghatge", "Shilpa Shukla"],
    country: "India",
    original_language: "hi",
    keywords: ["inspiring", "hockey", "women empowerment", "underdog", "70 minute", "triumph"],
    trailer_key: "6a0-dSmOtVo"
  },
  {
    id: 671039,
    title: "Soorarai Pottru",
    release_date: "2020-11-12",
    year: 2020,
    vote_average: 8.2,
    runtime: 153,
    overview: "A former Indian Air Force captain dreams of making aviation accessible to the common man, fighting predatory monopolists and bureaucratic sabotage to launch a low-cost airline.",
    genres: ["Drama", "Action"],
    genre_ids: [18, 28],
    director: "Sudha Kongara",
    cast: ["Suriya", "Aparna Balamurali", "Paresh Rawal", "Urshila Vance"],
    country: "India",
    original_language: "ta",
    keywords: ["inspiring", "aviation", "airline", "perseverance", "underdog", "triumph", "aviation"],
    trailer_key: "faG8RiaJxek"
  },
  {
    id: 843241,
    title: "Jai Bhim",
    release_date: "2021-11-02",
    year: 2021,
    vote_average: 8.4,
    runtime: 164,
    overview: "When a marginalized tribal man is falsely accused of theft and disappears from police custody, an unyielding human rights advocate takes up habeas corpus against systemic brutality.",
    genres: ["Crime", "Drama", "Mystery"],
    genre_ids: [80, 18, 9648],
    director: "T.J. Gnanavel",
    cast: ["Suriya", "Lijomol Jose", "K. Manikandan", "Rajisha Vijayan"],
    country: "India",
    original_language: "ta",
    keywords: ["courtroom", "habeas corpus", "human rights", "uncompromising", "inspirational", "justice"],
    trailer_key: "Gc6dEDnL8JA"
  },
  {
    id: 966220,
    title: "Sita Ramam",
    release_date: "2022-08-05",
    year: 2022,
    vote_average: 8.2,
    runtime: 163,
    overview: "An orphaned lieutenant stationed in Kashmir receives anonymous letters from a woman named Sita who claims to be his wife, sparking a timeless love across borders and decades.",
    genres: ["Romance", "Drama", "War"],
    genre_ids: [10749, 18, 10752],
    director: "Hanu Raghavapudi",
    cast: ["Dulquer Salmaan", "Mrunal Thakur", "Rashmika Mandanna", "Sumanth"],
    country: "India",
    original_language: "te",
    keywords: ["letters", "kashmir", "poetic", "heartbreaking", "classic romance", "date night"],
    trailer_key: "VvB0QWp4eL0"
  },
  {
    id: 342470,
    title: "Masaan",
    release_date: "2015-06-24",
    year: 2015,
    vote_average: 7.7,
    runtime: 109,
    overview: "Four separate lives along the sacred Ganges river in Varanasi intersect as they grapple with moral prejudice, societal stigma, grief, and the yearning for new beginnings.",
    genres: ["Drama"],
    genre_ids: [18],
    director: "Neeraj Ghaywan",
    cast: ["Vicky Kaushal", "Richa Chadha", "Sanjay Mishra", "Shweta Tripathi"],
    country: "India",
    original_language: "hi",
    keywords: ["varanasi", "grief", "heartbreaking", "poetic", "caste", "alone", "cannes winner"],
    trailer_key: "SKxbsk3f04g"
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
  console.log('Fetching verified posters for 32 new Indian movies...');
  let added = 0;

  for (const movie of newIndianCollection) {
    if (existingIds.has(movie.id)) {
      console.log(`[SKIP] Already exists: ${movie.title}`);
      continue;
    }

    let poster = await fetchTmdbPoster(movie.id);
    if (!poster) {
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
    currentMovies.push(movie);
    existingIds.add(movie.id);
    added++;
    console.log(`[ADDED] ${movie.title} (${movie.genres.join(', ')}) -> ${movie.poster_path}`);
  }

  fs.writeFileSync(jsonPath, JSON.stringify(currentMovies, null, 2), 'utf-8');
  console.log(`\nSuccessfully added ${added} Indian movies! Total catalog: ${currentMovies.length} movies.`);
}

run();
