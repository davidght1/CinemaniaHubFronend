import React, { useContext } from 'react';
import './Movie.css'; 
import { UserContext } from '../../../context/UserContext';
import { FaRegTrashCan } from "react-icons/fa6";
import { RiUpload2Line } from 'react-icons/ri';
import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Movie = ({ movie }) => {
  const { user } = useContext(UserContext);
  const userRole = user && user.userRole;

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

  return (
    <div className="movie-card">
      <img className="movie-poster" src={movie.pictureUrl} alt={movie.title} />
      <div className="movie-details">
        <h2 className="movie-title">{movie.title}</h2>
        <p className="movie-genre">Genre: {movie.genre}</p>
        <div className="movie-rating">
          <span className="rating-text">Rating:</span>
          <div className="rating-stars">{renderStars()}</div>
          <span className="rating-count">Users rate this movie:{numberOfRatings}</span>
        </div>
        {userRole === 'admin' && (
          <div className="admin-actions">
            <FaRegTrashCan />
            <RiUpload2Line />
          </div>
        )}
        <Link to={`/single-movie/${movie._id}`} className="eye-icon">
          <FaEye />
        </Link>
      </div>
    </div>
  );
};

export default Movie;
