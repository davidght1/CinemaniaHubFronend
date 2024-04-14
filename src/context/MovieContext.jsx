import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);

  // Function to fetch all movies
  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movie');
      setMovies(response.data.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    // Fetch movies when MovieProvider mounts
    fetchMovies();
  }, []);

  // Function to get a single movie by ID
  const getSingleMovie = async (movieId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/movie/getOne/${movieId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching single movie:', error);
      return null;
    }
  };

  // Function to update movie rating
  const updateRating = async (movieId, rating) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Guest user (unauthenticated)
        alert('Please log in to rate this movie.');
        return;
      }
  
      const response = await axios.patch(
        `http://localhost:5000/api/movie/rate/${movieId}`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response && response.data) {
        // Update the movie in the movies state with the updated rating
        setMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie._id === movieId ? { ...movie, ratings: response.data.ratings } : movie
          )
        );
  
        // Display success message
        alert(response.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === 'User has already rated this movie'
      ) {
        alert('You have already rated this movie.');
      } else if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.message === 'You do not have permission to get here'
      ) {
        alert('You do not have permission to rate movies.');
      } else {
        console.error('Failed to rate the movie:', error);
        alert('Failed to rate the movie. Please try again.');
      }
    }
  };

  // Function to refetch all movies
  const getMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movie');
      setMovies(response.data.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

   // Submit vote for a movie
   const submitVote = async (movieId, selectedChoices,user) => {
    try {
      if (!user || selectedChoices.length !== 3) {
        throw new Error('Invalid user or choices');
      }

      console.log(user)

      const response = await fetch(`http://localhost:5000/api/movie/vote/${movieId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ choices: selectedChoices })
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        navigate(`/single-movie/${movieId}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote. Please try again.');
    }
  };

  return (
    <MovieContext.Provider value={{ movies, getSingleMovie, updateRating, getMovies,submitVote }}>
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
