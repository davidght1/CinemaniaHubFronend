import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import './Vote.css'; // Import the updated CSS file
import { useMovieContext } from '../../context/MovieContext'; // Import MovieContext

const Vote = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const { submitVote } = useMovieContext(); // Get submitVote function from MovieContext

  const [selectedChoices, setSelectedChoices] = useState([]);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const availableChoices = [
    "Scariest in the world",
    "I laughed until my stomach hurt",
    "Exciting drama",
    "Interesting docu",
    "Superheroes",
    "Explosive action",
    "A movie for the whole family",
    "Not for children"
  ];

  const choiceToNumber = {
    "Scariest in the world": 1,
    "I laughed until my stomach hurt": 2,
    "Exciting drama": 3,
    "Interesting docu": 4,
    "Superheroes": 5,
    "Explosive action": 6,
    "A movie for the whole family": 7,
    "Not for children": 8
  };

  const handleSelectChoice = (choice) => {
    if (selectedChoices.includes(choice)) {
      setSelectedChoices(selectedChoices.filter((c) => c !== choice));
    } else {
      if (selectedChoices.length < 3) {
        setSelectedChoices([...selectedChoices, choice]);
      }
    }
  };

  const handleVote = async () => {
    if (selectedChoices.length !== 3) {
      setNotification({ show: true, type: 'error', message: 'Please select exactly 3 choices.' });
      return;
    }
  
    const choicesToSubmit = selectedChoices.map(choice => choiceToNumber[choice]);
  
    try {
      const result = await submitVote(id, choicesToSubmit, user);
  
      if (result.success) {
        setNotification({ show: true, type: 'success', message: 'Yay!!! We received your vote!' });
  
        // Automatically hide the success message after 5 seconds
        setTimeout(() => {
          setNotification({ show: false, type: '', message: '' });
          navigate(`/single-movie/${id}`); // Navigate after hiding the message
        }, 3000); // 3000 milliseconds = 3 seconds
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
  
      // Handle specific error case where the user has already voted for this movie
      if (error.message === 'already_voted') {
        setNotification({ show: true, type: 'error', message: 'You have already voted for this movie.' });
      } else {
        setNotification({ show: true, type: 'error', message: 'Failed to submit vote. Please try again.' });
      }
    }
  };

  useEffect(() => {
    // Redirect to login if user is not authenticated or does not have the 'user' role
    if (!user || user.userRole !== 'user') {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="vote-container">
      <h2 className="vote-heading">Vote for the Movie</h2>
      <div className="choice-container">
        {availableChoices.map((choice) => (
          <div key={choice} className="choice-label" onClick={() => handleSelectChoice(choice)}>
            <input
              type="checkbox"
              checked={selectedChoices.includes(choice)}
              className="choice-checkbox"
              readOnly
            />
            <span>{choice}</span>
          </div>
        ))}
      </div>
      <button
        className={`vote-button ${(!user || selectedChoices.length !== 3) && 'disabled'}`}
        onClick={handleVote}
        disabled={!user || selectedChoices.length !== 3}
      >
        Vote
      </button>

      {/* Notification component */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <p>{notification.message}</p>
          <button onClick={() => setNotification({ ...notification, show: false })}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Vote;
