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
  const updateRating = async (movieId, rating, setMovies, setNotification) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({ show: true, type: 'error', message: 'Please log in to rate this movie.' });
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
        setMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie._id === movieId ? { ...movie, ratings: response.data.ratings } : movie
          )
        );
  
        setNotification({ show: true, type: 'success', message: response.data.message });
  
        setTimeout(() => {
          setNotification({ show: false, type: '', message: '' });
        }, 5000); // 5000 milliseconds = 5 seconds
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === 'User has already rated this movie'
      ) {
        setNotification({ show: true, type: 'error', message: 'You have already rated this movie.' });
      } else if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.message === 'You do not have permission to get here'
      ) {
        setNotification({ show: true, type: 'error', message: 'You do not have permission to rate movies.' });
      } else {
        setNotification({ show: true, type: 'error', message: 'Failed to rate the movie. Please try again.' });
      }
  
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000); // 5000 milliseconds = 5 seconds
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

  const submitVote = async (movieId, selectedChoices, user) => {
    try {
      if (!user || selectedChoices.length !== 3) {
        throw new Error('Invalid user or choices');
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
  
      const response = await fetch(`http://localhost:5000/api/movie/vote/${movieId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ choices: selectedChoices })
      });
  
      if (response.ok) {
        const data = await response.json();
        return { success: true, message: 'Vote completed successfully' };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit vote');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
  
      // Handle specific error case where the user has already voted for this movie
      if (error.message.includes('already voted')) {
        throw new Error('already_voted');
      }
  
      throw new Error('Failed to submit vote. Please try again later.');
    }
  };

    // Function to post a comment to a movie
    const postComment = async (movieId, content) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in to post a comment.');
          return;
        }
        
        console.log(content)
        console.log(movieId)

        const response = await axios.patch(
          `http://localhost:5000/api/movie/commends/${movieId}`,
          { content },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // depends if we want to alert user his post 
        // if (response && response.data) {
        //   alert(response.data.message);
        // }
      } catch (error) {
        console.error('Error posting comment:', error);
        alert('Failed to post comment. Please try again.');
      }
    };



  return (
    <MovieContext.Provider value={{ movies, getSingleMovie, updateRating, getMovies,submitVote, postComment }}>
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
