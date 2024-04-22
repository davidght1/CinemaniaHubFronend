import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './CreateMovie.css'; // Import CSS file for styling

const CreateMovie = () => {
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and has admin role
    if (!user || user.userRole !== 'admin') {
      // Redirect unauthorized user to home page
      navigate('/');
    }
  }, [user, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('genre', genre);
      formData.append('photo', photo);

      const token = localStorage.getItem('token'); // Retrieve token from local storage

      if (!token) {
        throw new Error('Authentication token not found');
      }

      // API request to create movie
      const response = await axios.post('http://localhost:5000/api/movie', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Append token to Authorization header
        },
      });

      if (response.status === 201) {
        setMessage('Movie created successfully');
        // Reset form fields
        setTitle('');
        setDescription('');
        setGenre('');
        setPhoto(null);

        // Navigate to home page after 5 seconds
        setTimeout(() => {
          navigate('/');
        }, 5000);
      }
    } catch (error) {
      setMessage('Failed to create movie. Please try again.');
      console.error('Error creating movie:', error);
    }
  };

  return (
    <div className="create-movie-container">
    <h2>Create New Movie</h2>
    <form onSubmit={handleSubmit} className="movie-form">
      <div className="form-group">
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Genre:</label>
        <select value={genre} onChange={(e) => setGenre(e.target.value)} required>
          <option value="">Select Genre</option>
          <option value="Horror">Horror</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Docu">Documentary</option>
          <option value="ScienceFiction">Science Fiction</option>
          <option value="Action">Action</option>
          <option value="FamilyFilm">Family Film</option>
          <option value="NotForChildren">Not for Children</option>
        </select>
      </div>
      <div className="form-group">
        <label>Movie Picture:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
      </div>
      <button type="submit" className="submit-button">Create Movie</button>
    </form>
    {message && <p className="success-message">{message}</p>}
  </div>
  );
};

export default CreateMovie;
