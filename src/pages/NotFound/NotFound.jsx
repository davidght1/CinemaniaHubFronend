import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Import CSS for styling

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>Oops! We can't reach this page.</h1>
      <p>Please come back to the <Link to="/">home page</Link> and try again later.</p>
    </div>
  );
}

export default NotFound;
