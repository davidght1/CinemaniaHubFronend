import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/movie');
        setMovies(response.data.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

  const getSingleMovie = async (movieId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/movie/getOne/${movieId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching single movie:', error);
      return null;
    }
  };

  return (
    <MovieContext.Provider value={{ movies, getSingleMovie }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};
