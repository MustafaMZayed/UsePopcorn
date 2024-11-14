import React, { useEffect, useState, useRef } from "react";
import Star from "./Star";
import { useMovies } from "./useMovies";
const key = "6d5a438a";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function NavBar({ query, setQuery, moviesLength, search, setSearch }) {
  const selectedEl = useRef(null);
  useEffect(() => {
    function focus(e) {
      if (document.activeElement == selectedEl.current) return;
      if (e.code === "Enter") selectedEl.current.focus();
      setSearch("");
    }
    document.addEventListener("keydown", focus);
    return () => document.removeEventListener("keydown", focus);
  }, []);
  return (
    <nav className="nav-bar">
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        ref={selectedEl}
      />
      <p className="num-results">
        Found <strong>{moviesLength}</strong> results
      </p>
    </nav>
  );
}

function MovieList({ movies, setSelected, handleSelceted }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => handleSelceted(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, movies }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Box({ children, isOpen, setIsOpen }) {
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");

  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  function handleSelceted(id) {
    selected == id ? setSelected(null) : setSelected(id);
  }
  const { error, loading, watched, movies } = useMovies(search);
  return (
    <>
      <NavBar
        query={query}
        setQuery={setQuery}
        moviesLength={movies.length}
        search={search}
        setSearch={setSearch}
      />

      <main className="main">
        <Box isOpen={isOpen1} setIsOpen={setIsOpen1}>
          <MovieList
            movies={movies}
            setSelected={setSelected}
            handleSelceted={handleSelceted}
          />
        </Box>

        <Box isOpen={isOpen2} setIsOpen={setIsOpen2} selected={selected}>
          {selected ? (
            <Selectedmovies
              selected={selected}
              key={key}
              setSelected={setSelected}
            />
          ) : (
            <>
              {" "}
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} movies={movies} />
            </>
          )}
        </Box>
      </main>
    </>
  );
}
function Selectedmovies({ selected, setSelected }) {
  useEffect(() => {
    function callback(e) {
      if (e.code === "Escape") {
        setSelected(null);
      }
    }
    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [setSelected]);
  const key = "6d5a438a";
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(null);
  const {
    Title: title,
    Year: year,
    Actors: actors,
    Director: director,
    Genre: genre,
    Plot: plot,
    Poster: poster,
  } = movie;
  console.log(title, director);
  useEffect(
    function () {
      if (!title) return;
      document.title = title;
      return function () {
        document.title = "usepopcorn";
      };
    },
    [title]
  );
  useEffect(
    function () {
      async function getDetails() {
        setLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selected}`
        );
        const data = await res.json();
        setMovie(data);
        setLoading(null);
        console.log(movie.Plot);
      }
      getDetails();
    },
    [selected]
  );
  return (
    <div className="details">
      <h1>{title}</h1>
      <h2>{director}</h2>
      <h3>{actors}</h3>
      <img src={poster} alt="poster" />
      <p>{plot}</p>

      <Star className="rating" />
      {selected}
    </div>
  );
}
