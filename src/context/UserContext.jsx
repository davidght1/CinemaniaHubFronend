import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to check token expiration
  const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000;
      const currentTime = Date.now();
      if (currentTime > expirationTime) {
        // Token is expired, log out the user
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
      }
    }
  };

  useEffect(() => {
    // Check if user data exists in local storage to determine authentication
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    
    // Check token expiration every minute
    const interval = setInterval(checkTokenExpiration, 60000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

// Register user
const registerUser = async (formData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/user/register', formData);
    
    if (response.status === 201) {
      // Registration successful
      const { id, email, name, token } = response.data;
      
      // Update user state and localStorage
      setUser({ id, email, name }); // Include the name in the user object
      setIsAuthenticated(true);
      localStorage.setItem('userData', JSON.stringify({ id, email, name })); // Include the name in localStorage
      localStorage.setItem('token', token);
    }
  
    return response.data; // Return response data to handle in the component
  } catch (error) {
    console.error('Error registering user:', error.response.data);
    // Check if the error response contains an error message
    if (error.response.data && error.response.data.error) {
      // If yes, return the error message
      return { error: error.response.data.error };
    } else {
      // If not, return a generic error message
      return { error: 'Registration failed. Please try again.' };
    }
  }
};

  return (
    <UserContext.Provider value={{ user, isAuthenticated, registerUser, checkTokenExpiration }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
