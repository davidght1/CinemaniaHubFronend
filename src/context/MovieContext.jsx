import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);

  // Function to fetch all movies
  const fetchMovies = async () => {
    try {
      const response = await axios.get('https://cinemaniahub.onrender.com/api/movie');
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
      const response = await axios.get(`https://cinemaniahub.onrender.com/api/movie/getOne/${movieId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching single movie:', error);
      return null;
    }
  };

  // Function to update movie rating
  const updateRating = async (movieId, rating, setNotification, setMovie, getSingleMovie) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({ show: true, type: 'error', message: 'Please login to rate this movie.' });
        return;
      }
  
      const response = await axios.patch(
        `https://cinemaniahub.onrender.com/api/movie/rate/${movieId}`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response && response.status === 200) {
        // Update the movie details after successful rating update
        const updatedMovie = await getSingleMovie(movieId);
        setMovie(updatedMovie);
  
        setNotification({ show: true, type: 'success', message: 'Your rating has been updated.' });
  
        setTimeout(() => {
          setNotification({ show: false, type: '', message: '' });
        }, 5000); // Clear notification after 5 seconds
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && data.message === 'User has already rated this movie') {
          setNotification({ show: true, type: 'error', message: 'You have already rated this movie.' });
        } else if (status === 401 && data.message === 'You do not have permission to rate movies.') {
          setNotification({ show: true, type: 'error', message: 'You do not have permission to rate movies.' });
        } else {
          setNotification({ show: true, type: 'error', message: 'Failed to rate the movie. Please try again.' });
        }
      } else {
        setNotification({ show: true, type: 'error', message: 'Failed to rate the movie. Please try again.' });
      }
  
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000); // Clear notification after 5 seconds
    }
  };
  
  
  

  // Function to refetch all movies
  const getMovies = async () => {
    try {
      const response = await axios.get('https://cinemaniahub.onrender.com/api/movie');
      setMovies(response.data.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const submitVote = async (movieId, selectedChoices, user, updateUserCoins) => {
    try {
      if (!user || selectedChoices.length !== 3) {
        throw new Error('Invalid user or choices');
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
  
      const response = await fetch(`https://cinemaniahub.onrender.com/api/movie/vote/${movieId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ choices: selectedChoices })
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Step 1: Update user's coins in frontend context immediately
        updateUserCoins(data.user.coins); // Update user's coins from the response
  
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

        const response = await axios.patch(
          `https://cinemaniahub.onrender.com/api/movie/commends/${movieId}`,
          { content },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
      } catch (error) {
        console.error('Error posting comment:', error);
        alert('Failed to post comment. Please try again.');
      }
    };


    // Function to delete a movie
  const deleteMovie = async (movieId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.delete(`https://cinemaniahub.onrender.com/api/movie/delete/${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Movie deleted successfully
        fetchMovies(); // Refetch movies after deletion
        return true;
      } else {
        throw new Error('Failed to delete movie');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      return false;
    }
  };

    // Function to update a movie
const updateMovie = async (movieId, updatedData, fetchMovies, setNotification, navigate) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const formData = new FormData();
    formData.append('title', updatedData.title);
    formData.append('description', updatedData.description);
    formData.append('genre', updatedData.genre);
    if (updatedData.photo) {
      formData.append('photo', updatedData.photo);
    }

    const response = await axios.patch(`https://cinemaniahub.onrender.com/api/movie/update/${movieId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    // Check response status
    if (response.status === 201) {
      // Display success notification
      setNotification({ show: true, type: 'success', message: 'Movie updated successfully!' });
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 3000); // Clear notification after 3 seconds

      return response;
    } else {
      // Handle unexpected response status (e.g., 400 Bad Request)
      throw new Error('Failed to update movie');
    }
  } catch (error) {
    console.error('Error updating movie:', error);
    // Handle error
    setNotification({ show: true, type: 'error', message: 'Ops something went wrong :( Please try again later.' });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000); // Clear notification after 3 seconds
  }
};




  return (
    <MovieContext.Provider value={{ movies, getSingleMovie, updateRating, getMovies,submitVote, postComment, deleteMovie, updateMovie }}>
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
