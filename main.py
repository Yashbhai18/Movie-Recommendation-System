# ==============================================================================
# MOVIE RECOMMENDATION SYSTEM (CONTENT-BASED FILTERING)
# ==============================================================================
import os
import sys
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Configure utf-8 stdout if running in legacy Windows terminals
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# 1. LOAD movies.csv
base_dir = os.path.dirname(os.path.abspath(__file__))
movies_path = os.path.join(base_dir, "movies.csv")

if not os.path.exists(movies_path):
    raise FileNotFoundError(f"movies.csv not found at {movies_path}")

movies = pd.read_csv(movies_path)
movies["title"] = movies["title"].astype(str).str.strip()
movies["genres"] = movies["genres"].astype(str).str.strip()

# 2. CONVERT GENRES INTO VECTORS
cv = CountVectorizer(token_pattern=None, tokenizer=lambda x: x.split(), lowercase=True)
vectors = cv.fit_transform(movies["genres"]).toarray()

# 3. CALCULATE SIMILARITY MATRIX
similarity = cosine_similarity(vectors)


# 4. RECOMMEND FUNCTION (SUPPORTS SINGLE OR MULTIPLE MOVIES, 20 TO 40 RECOMMENDATIONS)
def find_movie_index(name):
    """Fuzzy/case-insensitive lookup for a movie title."""
    normalized = name.strip().strip('"\'').lower()
    if not normalized:
        return None
    # Exact match first
    exact = movies[movies["title"].str.lower() == normalized]
    if not exact.empty:
        return exact.index[0]

    # Partial match second
    contains = movies[movies["title"].str.lower().str.contains(normalized, regex=False)]
    if not contains.empty:
        return contains.index[0]

    return None


def recommend(movies_input, top_n=20):
    """
    Recommends 20 to 40 movies based on one or multiple favorite movies.
    
    Parameters:
    -----------
    movies_input : str or list
        Either a single movie title, a comma-separated string of movies,
        or a list of movie titles.
    top_n : int, default 20
        Number of recommendations to return (e.g. 20 to 40).
        
    Returns:
    --------
    list of dict:
        Each item contains 'title', 'genres', and 'match_score' (%)
    """
    if isinstance(movies_input, str):
        # Handle comma-separated or single input
        titles = [t.strip().strip('"\'') for t in movies_input.split(",") if t.strip().strip('"\'')]
    elif isinstance(movies_input, (list, tuple)):
        titles = [str(t).strip().strip('"\'') for t in movies_input if str(t).strip().strip('"\'')]
    else:
        titles = []

    if not titles:
        return []

    input_indices = []
    found_titles = []

    for t in titles:
        idx = find_movie_index(t)
        if idx is not None:
            input_indices.append(idx)
            found_titles.append(movies.iloc[idx]["title"])

    if not input_indices:
        return []

    # If multiple movies are provided, average their similarity vectors
    combined_scores = np.mean([similarity[idx] for idx in input_indices], axis=0)

    # Rank all movies by combined similarity score
    ranked_indices = np.argsort(combined_scores)[::-1]

    recommendations = []
    for idx in ranked_indices:
        # Exclude the input movies themselves
        if idx in input_indices:
            continue

        score = combined_scores[idx]
        recommendations.append({
            "title": movies.iloc[idx]["title"],
            "genres": movies.iloc[idx]["genres"],
            "match_score": round(float(score) * 100, 1)
        })

        if len(recommendations) >= top_n:
            break

    return recommendations


# 5. INTERACTIVE CLI RUNNER
if __name__ == "__main__":
    print("=" * 68)
    print(">> CINEPULSE - MOVIE RECOMMENDATION SYSTEM (20-40 MOVIES)")
    print(f">> Dataset Size: {len(movies)} Movies Loaded (Hollywood & Indian Cinema)")
    print("=" * 68)

    movie_input = None
    count = 20

    # Command line argument support: python main.py "3 Idiots, RRR" 25
    if len(sys.argv) > 1:
        movie_input = sys.argv[1]
        if len(sys.argv) > 2:
            try:
                count = int(sys.argv[2])
            except ValueError:
                count = 20
    else:
        print("\nTip: You can enter multiple movies separated by commas!")
        print("   Examples:")
        print("   - 3 Idiots")
        print("   - RRR, Dangal, KGF Chapter 1")
        print("   - Interstellar, Inception, The Matrix\n")
        
        movie_input = input("Enter your favourite movie(s): ").strip()
        
        count_input = input("How many recommendations do you want? (20 to 40, default 20): ").strip()
        if count_input.isdigit():
            count = max(5, min(len(movies) - 1, int(count_input)))

    if not movie_input:
        movie_input = "3 Idiots, Dangal"

    results = recommend(movie_input, top_n=count)

    if not results:
        print(f"\n[X] None of the movies matching '{movie_input}' were found in the dataset.")
    else:
        print(f"\n[+] TOP {len(results)} RECOMMENDATIONS FOR [{movie_input}]:")
        print("-" * 68)
        print(f"{'#':<4} {'Movie Title':<30} {'Match':<8} {'Genres'}")
        print("-" * 68)
        for i, m in enumerate(results, 1):
            print(f"{i:<4} {m['title']:<30} {m['match_score']}%   {m['genres']}")
        print("-" * 68)
