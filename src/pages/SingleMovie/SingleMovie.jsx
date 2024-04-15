import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMovieContext } from '../../context/MovieContext';
import { FaStar } from 'react-icons/fa';
import './SingleMovie.css'; // Import the CSS file
import { UserContext } from '../../context/UserContext';

const SingleMovie = () => {
  const { id } = useParams();
  const { getSingleMovie, updateRating } = useMovieContext();
  const [movie, setMovie] = useState(null);
  const [commentText, setCommentText] = useState('');
  const { user } = useContext(UserContext);

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
      await updateRating(id, rating, setMovie);
    } catch (error) {
      console.error('Error rating movie:', error);
      alert('Failed to rate the movie. Please try again.');
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (commentText.trim() === '') {
      alert('Please enter a comment.');
      return;
    }

    try {
      await postComment(id, commentText);
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

          {/* Display vote button conditionally */}
          {user && user.userRole === 'user' && (
            <Link to={`/vote/${id}`} className="vote-button-single">
              Vote
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
          {/* Display post if user loggedIn*/}
          {user && (
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <p>Write your comment:</p>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter your comment..."
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
