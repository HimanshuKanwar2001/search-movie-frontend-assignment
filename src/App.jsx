import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        setIsLoading(true);
        axios.get(`http://localhost:3001/api/search?title=${searchTerm}`)
          .then(res => {
            if (res.data.Search) setMovies(res.data.Search);
            setIsLoading(false);
          });
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const showMovieDetails = (id) => {
    axios.get(`http://localhost:3001/api/movie/${id}`)
      .then(res => setSelectedMovie(res.data));
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
        {movies.map(movie => (
          <div key={movie.imdbID} className="movie-card" onClick={() => showMovieDetails(movie.imdbID)}>
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'}
              alt={movie.Title}
            />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <div className="modal ">
          <div className="modal-content">
            <button onClick={() => setSelectedMovie(null)}>Close</button>
            <h2>{selectedMovie.Title} ({selectedMovie.Year})</h2>
            <img
              src={selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : 'https://via.placeholder.com/300x450'}
              alt={selectedMovie.Title}
            />
            <p>{selectedMovie.Plot}</p>
            <p><strong>Director:</strong> {selectedMovie.Director}</p>
            <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
            <p><strong>Rating:</strong> {selectedMovie.imdbRating}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;