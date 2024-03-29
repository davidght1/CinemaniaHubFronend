// ListMovies.jsx

import React from 'react';
import Movie from '../Movie-Home/Movie';
import './ListMovies.css';

const ListMovies = ({ movies }) => {
  // Group movies by genre
  const moviesByGenre = {};
  movies.forEach((movie) => {
    if (!moviesByGenre[movie.genre]) {
      moviesByGenre[movie.genre] = [];
    }
    moviesByGenre[movie.genre].push(movie);
  });

  return (
    <div className="movie-list-container">
      {Object.entries(moviesByGenre).map(([genre, moviesInGenre]) => (
        <div key={genre} className="genre-row">
          <h2 className="genre-title">{genre.toUpperCase()}</h2> {/* Uppercase genre title */}
          <div className="movie-list">
            {moviesInGenre.map((movie) => (
              <Movie key={movie._id} movie={movie} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListMovies;
