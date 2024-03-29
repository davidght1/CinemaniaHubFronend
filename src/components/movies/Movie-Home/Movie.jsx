import React from 'react';
import './Movie.css'; // Import CSS file for movie styles

const Movie = ({ movie }) => {
  // Calculate average rating
  const averageRating = movie.ratings.reduce((total, rating) => total + rating.rating, 0) / movie.ratings.length;

  // Function to convert rating to star icons
  const renderStars = () => {
    const stars = [];
    const filledStars = Math.floor(averageRating);
    const halfStar = averageRating - filledStars >= 0.5 ? 1 : 0;

    for (let i = 0; i < filledStars; i++) {
      stars.push(<span key={i} className="star-filled">&#9733;</span>);
    }

    if (halfStar) {
      stars.push(<span key={filledStars} className="star-half">&#9733;</span>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={filledStars + i + 1} className="star-empty">&#9734;</span>);
    }

    return stars;
  };

  return (
    <div className="movie-card">
      <img className="movie-poster" src={movie.pictureUrl} alt={movie.title} />
      <div className="movie-details">
        <h2 className="movie-title">{movie.title}</h2>
        <p className="movie-description">{movie.description}</p>
        <p className="movie-genre">Genre: {movie.genre}</p>
        <div className="movie-rating">
          <span className="rating-text">Rating:</span>
          <div className="rating-stars">{renderStars()}</div>
          <span className="average-rating">{averageRating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default Movie;
