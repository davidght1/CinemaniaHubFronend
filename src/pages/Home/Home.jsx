import React, { useEffect } from 'react';
import { useMovieContext } from '../../context/MovieContext';
import ListMovies from '../../components/movies/ListMovies/ListMovies';
import './Home.css';

const Home = () => {
  const { movies, getMovies } = useMovieContext();

  useEffect(() => {
    // Fetch movies when Home component mounts
    getMovies();
  }, [getMovies]); 

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to CinemaniaHub</h1>
      <ListMovies movies={movies} />
    </div>
  );
};

export default Home;