import React from 'react';
import { useMovieContext } from '../../context/MovieContext';
import ListMovies from '../../components/movies/ListMovies/ListMovies';
import './Home.css'; // Import CSS file for home page styles

const Home = () => {
  const { movies } = useMovieContext();
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to CinemaniaHub</h1>
      <ListMovies movies={movies}/>
    </div>
  );
};

export default Home;
