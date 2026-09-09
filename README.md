# CinePulse - Movie Recommendation System 🎬✨

A modern, full-stack AI-powered movie recommendation platform that combines content-based machine learning filtering, real-time TMDB metadata, mood & context exploration, and dynamic UI discovery.

---

## 🚀 Features

- **Content-Based Filtering (Machine Learning)**: Uses `scikit-learn`'s `CountVectorizer` and `cosine_similarity` to calculate vector distances across movie genres and tags, returning high-accuracy recommendations.
- **Mood & Context Discovery**: Recommends movies tailored to how you feel and the viewing occasion.
- **Surprise Me Engine**: Explores out-of-bubble recommendations across unexpected genres and classic gems.
- **Modern Responsive Frontend**: Built with React, Tailwind CSS, Lucide icons, and Vite for instant load times and fluid interactions.
- **Express Backend & TMDB Integration**: Serves movie catalogs, handles recommendation requests, and pulls posters and details from The Movie Database (TMDB) API.

---

## 📁 Project Structure

```
├── client/                 # Frontend (React + Vite + TailwindCSS)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/                 # Backend (Node.js + Express)
│   ├── routes/             # API routes (recommend, surprise, movies, auth)
│   ├── services/           # TMDB and helper services
│   ├── server.js           # Server entry point
│   ├── .env.example        # Environment variable template
│   └── package.json
├── main.py                 # Python ML recommendation engine (scikit-learn, pandas)
├── movies.csv              # Movie dataset
├── package.json            # Root workspace scripts
└── requirements.txt        # Python dependencies
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: v18 or later
- **Python**: v3.9 or later
- **Git**

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd "Movie recommedation system"
```

### 2. Python Setup (ML Recommender)

```bash
# Install Python packages
pip install -r requirements.txt

# Test the recommendation engine
python main.py
```

### 3. Server Setup

```bash
cd server
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and insert your TMDB_API_KEY (optional, fallback posters provided)

# Start backend server (runs on http://localhost:5000)
npm run dev
```

### 4. Client Setup

In a new terminal:

```bash
cd client
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

---

## 📜 License

Distributed under the MIT License.
