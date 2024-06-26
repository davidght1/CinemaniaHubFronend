import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMovieContext } from '../../context/MovieContext';
import { FaStar } from 'react-icons/fa';
import './SingleMovie.css'; // Import the CSS file
import { UserContext } from '../../context/UserContext';

const SingleMovie = () => {
  const { id } = useParams();
  const { getSingleMovie, updateRating, postComment  } = useMovieContext();
  const [movie, setMovie] = useState(null);
  const [commentText, setCommentText] = useState('');
  const { user } = useContext(UserContext);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetails = async () => {
      const singleMovie = await getSingleMovie(id);
      setMovie(singleMovie);
    };
    fetchMovieDetails();
  }, [id, getSingleMovie]);

  // Handle movie rating
  const handleRateMovie = async (rating) => {
    try {
      await updateRating(id, rating, setNotification, setMovie, getSingleMovie);
    } catch (error) {
      console.error('Error rating movie:', error);
      setNotification({ show: true, type: 'error', message: 'Failed to rate the movie. Please try again.' });
  
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000); // Clear notification after 5 seconds
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (commentText.trim() === '') {
      alert('Please enter a comment.');
      return;
    }

    try {
      await postComment(id, commentText); // Call postComment function with movieId and commentText
      setCommentText(''); // Clear comment text after submission
      // Refresh movie details to display updated comments
      const updatedMovie = await getSingleMovie(id);
      setMovie(updatedMovie);
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    }
  };

  // Render stars based on average rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          color={i <= rating ? '#ffc107' : '#e4e5e9'}
          onClick={() => handleRateMovie(i)}
          style={{ cursor: 'pointer' }}
        />
      );
    }
    return stars;
  };

  return (
    <div className="single-movie-container">
      <Link to="/" className="home-button">
        Back to the Home page
      </Link>
      {movie ? (
        <>
          <h1>{movie.title}</h1>
          <div className="movie-image-container">
            <img className="movie-image" src={movie.pictureUrl} alt={movie.title} />
          </div>
          <p>Description: {movie.description}</p>
          <p>Genre: {movie.genre}</p>

          <div className="movie-ratings">
            <p>Rate Movie:</p>
            {renderStars(
              Math.round(
                movie.ratings.reduce((acc, cur) => acc + cur.rating, 0) / movie.ratings.length
              )
            )}
          </div>
          {notification.show && (
            <div className={`notification ${notification.type}`}>
              <p>{notification.message}</p>
            </div>
          )}

          {/* Display vote button conditionally */}
          {user && user.userRole === 'user' && (
            <Link to={`/vote/${id}`} className="vote-button-single">
              Vote to earn credit
            </Link>
          )}

          {/* Display user posts if available */}
          {movie.userPosts.length > 0 && (
            <div className="user-posts">
              <p>User Posts:</p>
              {movie.userPosts.map((post) => (
                <div key={post._id} className="user-post">
                  <p>Posted by: {post.userName || 'Unknown User'}</p>
                  <p>{post.content}</p>
                  <p>Posted on: {new Date(post.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
          {/* Display post if user (with user Role 'user') loggedIn*/}
          {user && user.userRole === 'user' && (
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <p>Write your opinion:</p>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter your opinion..."
                required
              />
              <button type="submit">Post</button>
            </form>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SingleMovie;
