import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const MovieCard = React.memo(({ movie, onClick }) => (
  <div
    className="group cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
    onClick={() => onClick(movie.imdbID)}
  >
    <img
      src={
        movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/300x450"
      }
      alt={movie.Title}
      loading="lazy"
      className="h-64 w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
    />
    <div className="bg-white p-4 dark:bg-gray-800">
      <h3 className="mb-1 truncate text-lg font-semibold text-gray-900 dark:text-white">
        {movie.Title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{movie.Year}</p>
    </div>
  </div>
));

const MovieModal = React.memo(({ selectedMovie, onClose }) => {
  const formatCurrency = (value) => {
    if (!value || value === "N/A") return "Not Available";
    return value.startsWith("$") ? value : `$${value}`;
  };

  const renderDetailRow = (label, value) => {
    if (!value || value === "N/A") return null;
    return (
      <div className="flex justify-between py-2 odd:bg-gray-50 dark:odd:bg-gray-700/30">
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {label}
        </span>
        <span className="text-gray-600 dark:text-gray-300">{value}</span>
      </div>
    );
  };

  if (!selectedMovie) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="m-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-6 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {selectedMovie.Title} ({selectedMovie.Year})
          </h2>
          <button
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="lg:w-1/3">
              <img
                src={
                  selectedMovie.Poster !== "N/A"
                    ? selectedMovie.Poster
                    : "https://via.placeholder.com/300x450"
                }
                alt={`Poster for ${selectedMovie.Title}`}
                className="rounded-lg shadow-lg"
              />
              <div className="mt-4 space-y-2">
                {selectedMovie.Rated !== "N/A" && (
                  <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-800/30 dark:text-blue-200">
                    {selectedMovie.Rated}
                  </div>
                )}
                {renderDetailRow("Runtime", selectedMovie.Runtime)}
                {renderDetailRow("Genre", selectedMovie.Genre)}
                {renderDetailRow("Released", selectedMovie.Released)}
                {renderDetailRow(
                  "Box Office",
                  formatCurrency(selectedMovie.BoxOffice)
                )}
                {renderDetailRow("IMDb Rating", selectedMovie.imdbRating)}
                {renderDetailRow("Metascore", selectedMovie.Metascore)}
              </div>
            </div>

            <div className="flex-1 space-y-6 lg:ml-6">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Plot
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedMovie.Plot}
                </p>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Ratings
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {selectedMovie.Ratings?.map((rating, index) => (
                    <div
                      key={`${rating.Source}-${index}`}
                      className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700"
                    >
                      <div className="font-medium text-gray-700 dark:text-gray-200">
                        {rating.Source}
                      </div>
                      <div className="text-lg text-gray-900 dark:text-white">
                        {rating.Value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedMovie.Awards !== "N/A" && (
                <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-800/20">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    🏆 Awards
                  </h3>
                  <p className="text-gray-600 dark:text-yellow-200">
                    {selectedMovie.Awards}
                  </p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-1">
                <div className="min-w-full">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                    Details
                  </h3>
                  <div className="rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ">
                    {renderDetailRow("Director", selectedMovie.Director)}
                    {renderDetailRow("Writers", selectedMovie.Writer)}
                    {renderDetailRow("Cast", selectedMovie.Actors)}
                    {renderDetailRow("Language", selectedMovie.Language)}
                    {renderDetailRow("Country", selectedMovie.Country)}
                    {renderDetailRow("IMDb Votes", selectedMovie.imdbVotes)}
                    {renderDetailRow("Production", selectedMovie.Production)}
                    {renderDetailRow("Type", selectedMovie.Type)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const cancelToken = useRef();

  const fetchMovies = useCallback(
    async (search) => {
      if (!apiUrl) {
        setError("API configuration error");
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        if (cancelToken.current) {
          cancelToken.current.cancel("Operation canceled by new request");
        }
        cancelToken.current = axios.CancelToken.source();

        const response = await axios.get(
          `${apiUrl}/api/search?title=${search}`,
          {
            cancelToken: cancelToken.current.token,
          }
        );

        if (response.data.Search) {
          setMovies(response.data.Search);
        } else {
          setMovies([]);
          setError("No results found");
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err.message || "Failed to fetch movies");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl]
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchMovies(searchTerm);
      } else {
        setMovies([]);
        setError("");
      }
    }, 500);

    return () => {
      clearTimeout(delayDebounce);
      if (cancelToken.current) {
        cancelToken.current.cancel();
      }
    };
  }, [searchTerm, fetchMovies]);

  const showMovieDetails = useCallback(
    async (id) => {
      try {
        const response = await axios.get(`${apiUrl}/api/movie/${id}`);
        setSelectedMovie(response.data);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch movie details");
      }
    },
    [apiUrl]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-center text-4xl font-bold text-gray-900 dark:text-white">
            Movie Search
          </h1>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-6 py-4 text-lg shadow-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
          />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-800/30 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onClick={showMovieDetails}
            />
          ))}
        </div>
      </main>

      <MovieModal
        selectedMovie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}

export default App;
