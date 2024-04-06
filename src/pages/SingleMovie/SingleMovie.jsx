import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMovieContext } from '../../context/MovieContext';
import { UserContext } from '../../context/UserContext';
import { FaStar } from 'react-icons/fa';
import './SingleMovie.css'; // Import the CSS file

const SingleMovie = () => {
  const { id } = useParams();
  const { getSingleMovie } = useMovieContext();
  const { getUserDetails } = useContext(UserContext);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
        console.log(id)
      const singleMovie = await getSingleMovie(id);
      console.log('Fetched movie:', singleMovie);
      setMovie(singleMovie);
    };
    fetchMovieDetails();
  }, [id, getSingleMovie]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (movie && movie.userPosts.length > 0) {
        const updatedUserPosts = await Promise.all(
          movie.userPosts.map(async (post) => {
            if (post.userId) {
              const userDetails = await getUserDetails(post.userId);
              return { ...post, userName: userDetails?.name || 'Unknown User' };
            }
            return post;
          })
        );
        setMovie((prevMovie) => ({ ...prevMovie, userPosts: updatedUserPosts }));
      }
    };
    fetchUserDetails();
  }, [movie, getUserDetails]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} color="#ffc107" />);
      } else {
        stars.push(<FaStar key={i} color="#e4e5e9" />);
      }
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
            <p>Movie Rating:</p>
            {renderStars(
              Math.round(
                movie.ratings.reduce((acc, cur) => acc + cur.rating, 0) / movie.ratings.length
              )
            )}
          </div>

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
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SingleMovie;
