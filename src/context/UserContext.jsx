import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenIntervalId, setTokenIntervalId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);

      // Start token expiration check immediately on initial login
      startTokenExpirationCheck(userData.token);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const loginUser = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/login', formData);

      if (response.status === 200) {
        const userData = response.data;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('userData', JSON.stringify(userData));

        // Start or restart token expiration check on successful login
        startTokenExpirationCheck(userData.token);
      }

      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      return { error: 'Login failed. Please try again.' };
    }
  };

  const logoutUser = async () => {
    try {
      await axios.get('http://localhost:5000/api/user/logout');
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('userData');

      // Stop token expiration check on logout
      clearInterval(tokenIntervalId);
      setTokenIntervalId(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUserCoins = async (newCoins) => {
    try {
      const updatedUser = { ...user, coins: newCoins };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update user coins:', error);
    }
  };

  const startTokenExpirationCheck = (token) => {
    // Clear previous interval if exists
    clearInterval(tokenIntervalId);

    // Start new interval to check token expiration every minute
    const intervalId = setInterval(() => {
      if (token) {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenData.exp * 1000;
        const currentTime = Date.now();

        if (currentTime > expirationTime) {
          // Token is expired, log out the user
          clearInterval(intervalId); // Stop further checks
          logoutUser();
        }
      }
    }, 60000); // Check every minute (60000 milliseconds)

    // Save the intervalId in state for cleanup
    setTokenIntervalId(intervalId);
  };

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, loginUser, logoutUser, updateUserCoins }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
