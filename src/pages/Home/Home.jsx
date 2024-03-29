import React from 'react'
import { useMovieContext } from '../../context/MovieContext';
import ListMovies from '../../components/movies/ListMovies/ListMovies';


const Home = () => {
  const { movies } = useMovieContext();
  return (
    <div>
       <h1>Welcome to CinemaniaHub</h1>
       <ListMovies movies={movies}/>
    </div>
  )
}

export default Home