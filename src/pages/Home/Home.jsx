import React, { useEffect, useState } from 'react';
import { useMovieContext } from '../../context/MovieContext';
import ListMovies from '../../components/movies/ListMovies/ListMovies';
import './Home.css';

const Home = () => {
  const { movies, getMovies } = useMovieContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    // Fetch movies when Home component mounts
    getMovies();
  }, []);

  useEffect(() => {
    // Filter movies based on search term and selected genres
    let filtered = movies;

    if (searchTerm) {
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenres.length > 0) {
      filtered = filtered.filter(movie => selectedGenres.includes(movie.genre));
    }

    setFilteredMovies(filtered);
  }, [movies, searchTerm, selectedGenres]);

  const handleGenreChange = (genre) => {
    setSelectedGenres(prevSelectedGenres =>
      prevSelectedGenres.includes(genre)
        ? prevSelectedGenres.filter(g => g !== genre)
        : [...prevSelectedGenres, genre]
    );
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to CinemaniaHub</h1>
      
      <div className="filters-container">
        <input 
          type="text" 
          placeholder="Search movies..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="search-input"
        />
        
        <div className="genre-checkboxes">
          <label>
            <input 
              type="checkbox" 
              value="Horror" 
              onChange={() => handleGenreChange('Horror')}
            />
            Horror
          </label>
          <label>
            <input 
              type="checkbox" 
              value="Comedy" 
              onChange={() => handleGenreChange('Comedy')}
            />
            Comedy
          </label>
          <label>
            <input 
              type="checkbox" 
              value="Drama" 
              onChange={() => handleGenreChange('Drama')}
            />
            Drama
          </label>
          <label>
            <input 
              type="checkbox" 
              value="Documentary" 
              onChange={() => handleGenreChange('Documentary')}
            />
            Documentary
          </label>
          <label>
            <input 
              type="checkbox" 
              value="Science Fiction" 
              onChange={() => handleGenreChange('Science Fiction')}
            />
            Science Fiction
          </label>
          <label>
            <input 
              type="checkbox" 
              value="Action" 
              onChange={() => handleGenreChange('Action')}
            />
            Action
          </label>
          <label>
            <input 
              type="checkbox" 
              value="Family Film" 
              onChange={() => handleGenreChange('Family Film')}
            />
            Family Film
          </label>
          <label>
            <input 
              type="checkbox" 
              value="Not For Children" 
              onChange={() => handleGenreChange('Not For Children')}
            />
            Not for Children
          </label>
        </div>
      </div>

      <ListMovies movies={filteredMovies} />
    </div>
  );
};

export default Home;
