import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        setIsLoading(true);
        axios.get(`${apiUrl}/api/search?title=${searchTerm}`).then((res) => {
          if (res.data.Search) setMovies(res.data.Search);
          setIsLoading(false);
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const showMovieDetails = (id) => {
    axios
      .get(`${apiUrl}/api/movie/${id}`)
      .then((res) => setSelectedMovie(res.data));
  };

  return (
    <div className="App">
      <header>
        <h1>Movie Search</h1>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>

      {isLoading && <p>Loading...</p>}

      <div className="movie-grid">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="movie-card"
            onClick={() => showMovieDetails(movie.imdbID)}
          >
            <img
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/300x450"
              }
              alt={movie.Title}
            />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
          </div>
        ))}
      </div>

      {selectedMovie && (
  <div className="modal" onClick={() => setSelectedMovie(null)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>{selectedMovie.Title} ({selectedMovie.Year})</h2>
        <button className="close-btn" onClick={() => setSelectedMovie(null)}>
          &times;
        </button>
      </div>
      
      <div className="modal-body">
        <div className="poster-section">
          <img
            src={selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : 'https://via.placeholder.com/300x450'}
            alt={selectedMovie.Title}
          />
          <div className="quick-info">
            {selectedMovie.Rated !== 'N/A' && <div className="rating-pill">{selectedMovie.Rated}</div>}
            <p><strong>Runtime:</strong> {selectedMovie.Runtime}</p>
            <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
            <p><strong>Released:</strong> {selectedMovie.Released}</p>
          </div>
        </div>

        <div className="details-section">
          <div className="ratings">
            <h3>Ratings</h3>
            <div className="ratings-grid">
              {selectedMovie.Ratings.map((rating, index) => (
                <div key={index} className="rating-item">
                  <span className="rating-source">{rating.Source}</span>
                  <span className="rating-value">{rating.Value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">Director:</span>
              <span className="info-value">{selectedMovie.Director}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Writers:</span>
              <span className="info-value">{selectedMovie.Writer}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Cast:</span>
              <span className="info-value">{selectedMovie.Actors}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Language:</span>
              <span className="info-value">{selectedMovie.Language}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Country:</span>
              <span className="info-value">{selectedMovie.Country}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Box Office:</span>
              <span className="info-value">{selectedMovie.BoxOffice}</span>
            </div>
          </div>

          <div className="plot-section">
            <h3>Plot</h3>
            <p>{selectedMovie.Plot}</p>
          </div>

          {selectedMovie.Awards !== 'N/A' && (
            <div className="awards-section">
              <h3>Awards</h3>
              <p>{selectedMovie.Awards}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default App;
