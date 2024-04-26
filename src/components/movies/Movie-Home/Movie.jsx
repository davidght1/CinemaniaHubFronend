import React, { useContext, useState } from 'react';
import './Movie.css'; 
import { UserContext } from '../../../context/UserContext';
import { useMovieContext } from '../../../context/MovieContext';
import { FaRegTrashCan } from "react-icons/fa6";
import { RiUpload2Line } from 'react-icons/ri';
import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Movie = ({ movie }) => {
  const { user } = useContext(UserContext);
  const {deleteMovie} = useMovieContext();
  const userRole = user && user.userRole;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState('');

  const numberOfRatings = movie.ratings ? movie.ratings.length : 0;

  // Calculate average rating
  const averageRating = calculateAverageRating(movie);

  // Function to calculate average rating
  function calculateAverageRating(movie) {
    if (movie.ratings && movie.ratings.length > 0) {
      const totalRating = movie.ratings.reduce((total, rating) => total + rating.rating, 0);
      return totalRating / movie.ratings.length;
    }
    return 0;
  }

  // Function to render star icons
  const renderStars = () => {
    const stars = [];
    const filledStars = Math.round(averageRating); // Round the average rating

    for (let i = 0; i < 5; i++) {
      if (i < filledStars) {
        // Display a filled star
        stars.push(<span key={i} className="star-filled">&#9733;</span>);
      } else {
        // Display an empty star
        stars.push(<span key={i} className="star-empty">&#9734;</span>);
      }
    }

    return stars;
  };

  // Function to handle movie deletion
  const handleDeleteMovie = async () => {
    setShowConfirmation(false); // Close confirmation dialog

    try {
      const response = await deleteMovie(movie._id);
      if (response && response.status === 200) {
        setMessage('Movie deleted successfully');
        setTimeout(() => {
          setMessage('');
        }, 5000);
      } else {
        throw new Error('Failed to delete movie');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      setMessage('Ops! Something went wrong. Please try again later.');
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  };

  return (
    <div className="movie-card">
      <img className="movie-poster" src={movie.pictureUrl} alt={movie.title} />
      <div className="movie-details">
        <h2 className="movie-title">{movie.title}</h2>
        <p className="movie-genre">Genre: {movie.genre}</p>
        <div className="movie-rating">
          <span className="rating-text">Rating:</span>
          <div className="rating-stars">{renderStars()}</div>
          <span className="rating-count">Users rate this movie: {numberOfRatings}</span>
        </div>
        {userRole === 'admin' && (
          <div className="admin-actions">
            <FaRegTrashCan onClick={() => setShowConfirmation(true)} />
            <Link to={`/update-movie/${movie._id}`}>
            <RiUpload2Line />
            </Link>
          </div>
        )}
        <Link to={`/single-movie/${movie._id}`} className="eye-icon">
          <FaEye />
        </Link>
      </div>

      {/* Confirmation dialog */}
      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to delete the movie?</p>
          <button onClick={handleDeleteMovie}>Yes</button>
          <button onClick={() => setShowConfirmation(false)}>No</button>
        </div>
      )}

      {/* Display success or error message */}
      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default Movie;
