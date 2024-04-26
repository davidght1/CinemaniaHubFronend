import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieContext } from '../../context/MovieContext';
import axios from 'axios';
import './UpdateMovie.css'; // Import CSS file for styling
import { UserContext } from '../../context/UserContext';

const UpdateMovie = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const { getSingleMovie, fetchMovies, updateMovie } = useMovieContext();
  const [movie, setMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    photo: null,
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Check if user is logged in and has admin role
    if (!user || user.userRole !== 'admin') {
      // Redirect unauthorized user to home page
      navigate('/');
    }
  }, [user, navigate]);
  

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const singleMovie = await getSingleMovie(id);
        setMovie(singleMovie);
        setFormData({
          title: singleMovie.title,
          description: singleMovie.description,
          genre: singleMovie.genre,
          photo: null,
        });
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };
    fetchMovieDetails();
  }, [id, getSingleMovie]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call updateMovie with movieId, formData, fetchMovies, and setNotification
    const response = await updateMovie(id, formData, fetchMovies, setNotification);

    // if movie updated successfully navigate to home page
    if (response.status === 201) {
      setTimeout(() => {
        navigate('/');
      }, 2000); // Navigate to home page after 2 seconds
    }
  };

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="edit-movie-title">Edit Movie: {movie.title}</h2>
    
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Genre:</label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className="form-control"
              required
            >
              <option value="">Select Genre</option>
              <option value="Horror">Horror</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Documentary">Documentary</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Action">Action</option>
              <option value="Family Film">Family Film</option>
              <option value="Not for Children">Not for Children</option>
            </select>
          </div>

          <div className="current-picture">
            <p>Current Picture:</p>
            <img src={movie.pictureUrl} alt={movie.title} className="movie-image" />
          </div>

          <div className="form-group">
            <label>Upload New Picture:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="form-control-file" />
          </div>
            {notification && (
            <p className={notification.type === 'success' ? 'success-message' : 'error-message'}>
                {notification.message}
            </p>
            )}
          <button type="submit" className="btn btn-primary">Update Movie</button>
     
        </form>
      </div>
    </div>
  );
};

export default UpdateMovie;
