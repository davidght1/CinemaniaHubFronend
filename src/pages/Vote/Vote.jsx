import React, { useContext, useState } from 'react';
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

  // Mapping from word-based choices to numerical values (1 to 8)
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
      alert("Please select exactly 3 choices.");
      return;
    }

    // Map selected word-based choices to numerical values
    const choicesToSubmit = selectedChoices.map(choice => choiceToNumber[choice]);

    // Call submitVote function from context with numerical choices
    await submitVote(id, choicesToSubmit, navigate);
  };

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
    </div>
  );
};

export default Vote;
