import React, { useEffect, useState, useRef } from "react";
const key = "6d5a438a";
export function useMovies(search) {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const controller = new AbortController();
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getMovies() {
      setLoading(true);
      setError(null); // Reset error state before each fetch

      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&s=${search}`,
          { signal }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await res.json();

        if (data.Response === "False") {
          throw new Error(data.Error);
        }
        console.log(data);
        setMovies(data.Search || []); // Default to empty array if data.Search is undefined
      } catch (err) {
        console.log(err.message);
        if (err.message !== "AbortError") setError(err.message);

        setMovies([]); // Ensure movies is always an array
      } finally {
        setLoading(false);
      }
    }

    if (search.length < 2) {
      return;
    }

    if (search.trim()) {
      getMovies();
    }

    return () => {
      controller.abort();
    };
  }, [search]);

  return { error, loading, watched, movies };
}
