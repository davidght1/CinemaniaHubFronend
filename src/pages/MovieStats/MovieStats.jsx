import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';
import './MovieStats.css'; // Import custom CSS file
import { UserContext } from '../../context/UserContext';
import navigate from 'navigate';
import { useNavigate } from 'react-router-dom';

// Register necessary Chart.js components
Chart.register(CategoryScale, LinearScale, BarController, BarElement);

const MovieStats = () => {
  const [movieStats, setMovieStats] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate()


  useEffect(() => {
    // Check if user is logged in and has admin role
    if (!user || user.userRole !== 'cinemaowner') {
      // Redirect unauthorized user to home page
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchMovieStats = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          console.error('Token not found in local storage');
          return;
        }
        const response = await axios.get('https://cinemaniahub.onrender.com/api/movie/details', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setMovieStats(response.data.movieStats);
      } catch (error) {
        console.error('Error fetching movie stats:', error);
      }
    };

    fetchMovieStats();
  }, []); // Empty dependency array to fetch data only once on component mount

  // Genre mapping for most chosen votes (1 to 8)
  const genreMap = {
    1: 'Horror',
    2: 'Comedy',
    3: 'Drama',
    4: 'Documentary',
    5: 'Science Fiction',
    6: 'Action',
    7: 'Family Film',
    8: 'Not for Children',
  };

  // Function to render the chart based on fetched movie stats
  const renderMovieStatsChart = () => {
    if (movieStats.length === 0) {
      return <p>Loading...</p>; // Display loading message while data is being fetched
    }

    // Extracting data for chart
    const labels = movieStats.map(movie => movie.title);
    const mostChosenVotes = movieStats.map(movie => movie.mostChosenVote);
    const totalRatings = movieStats.map(movie => movie.totalRating);

    // Chart data and options
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Most Chosen Vote',
          backgroundColor: 'rgba(75, 192, 192, 0.4)', // Light blue color for bars
          borderColor: 'rgba(75, 192, 192, 1)', // Solid blue border color
          borderWidth: 1,
          data: mostChosenVotes,
        },
        {
          label: 'Total Rating',
          backgroundColor: 'rgba(255, 99, 132, 0.4)', // Light red color for bars
          borderColor: 'rgba(255, 99, 132, 1)', // Solid red border color
          borderWidth: 1,
          data: totalRatings,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Rating / Genre', // Updated y-axis title to 'Genre'
          },
          ticks: {
            callback: function(value, index, values) {
              const genre = genreMap[value];
              return `${value}/${genre || 'Unknown'}`;
            },
          },
        },
        x: {
          type: 'category', // Use 'category' type for x-axis since it's based on movie titles
          title: {
            display: true,
            text: 'Movie Title', // X-axis title for movie titles
          },
        },
      },
    };

    return (
      <div className="movie-stats-container">
        <h2>Movie Statistics</h2>
        <div className="chart-description">
          <p className="blue-chart">Blue Chart: Represents the most chosen vote for each movie.</p>
          <p className="red-chart">Red Chart: Represents the total rating for each movie.</p>
        </div>
        <div className="chart-container">
          <Bar data={data} options={options} />
        </div>
      </div>
    );
  };

  return <>{renderMovieStatsChart()}</>;
};

export default MovieStats;
