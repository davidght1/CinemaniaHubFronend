import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user data exists in local storage to determine authentication
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

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
      console.error('Error registering user:', error);
      return { error: 'Registration failed. Please try again.' };
    }
  };

  

  return (
    <UserContext.Provider value={{ user, isAuthenticated, registerUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
