import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000;
      const currentTime = Date.now();
      if (currentTime > expirationTime) {
        // Token is expired, perform logout
        logoutUser();
      }
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }

    // Check token expiration every minute
    const interval = setInterval(checkTokenExpiration, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const loginUser = async (formData) => {
    try {
      const response = await axios.post('https://cinemaniahub.onrender.com/api/user/login', formData);
      if (response.status === 200) {
        const { id, email, name, userRole, coins, token } = response.data;
        setUser({ id, email, name, coins, userRole });
        setIsAuthenticated(true);
        localStorage.setItem('userData', JSON.stringify({ id, email, name, coins, userRole }));
        localStorage.setItem('token', token);
      }
      return response.data;
    } catch (error) {
      return { error: 'Login failed. Please try again.' };
    }
  };

  const logoutUser = async () => {
    try {
      await axios.get('https://cinemaniahub.onrender.com/api/user/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
  };

  const registerUser = async (formData) => {
    const { name, email, password } = formData;
  
    // Check if the password length is less than 6 characters
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters' };
    }
  
    try {
      const response = await axios.post('https://cinemaniahub.onrender.com/api/user/register', {
        name,
        email,
        password
      });
  
      // Check if the registration was successful (status 201)
      if (response.status === 201) {
        const { id, email, name, userRole, coins, token } = response.data;
  
        // Update user context with the registered user's information
        setUser({ id, email, name, coins, userRole });
        setIsAuthenticated(true);
  
        // Store user data and token in local storage for persistent login
        localStorage.setItem('userData', JSON.stringify({ id, email, name, coins, userRole }));
        localStorage.setItem('token', token);
  
        // Return the response data on successful registration
        return { data: response.data };
      } else {
        // Handle other non-201 responses (e.g., unexpected status codes)
        return { error: 'Registration failed. Please try again.' };
      }
    } catch (error) {
      // Handle axios request errors
      if (error.response) {
        // The request was made and the server responded with a non-2xx status code
        const { status, data } = error.response;
  
        if (status === 400 && data.error === "Email has already been registered") {
          // Specific error message for existing email
          return { error: 'Email is already registered. Please use a different email address.' };
        } else if(status ===400 && data.error === "Name must contain only alphabetic characters"){
          return {error: 'Name must contain only alphabetic characters. do not use spaces and Special symbols'}
        } else {
          // General error message for other server-side errors
          return { error: 'Registration failed. Please try again.' };
        }
      } else {
        // Handle network errors or other unexpected errors
        console.error('Registration error:', error);
        return { error: 'Registration failed. Please try again.' };
      }
    }
  };
  

  const updateUserCoins = async (newCoins) => {
    try {
      setUser((prevUser) => ({ ...prevUser, coins: newCoins }));
      localStorage.setItem('userData', JSON.stringify({ ...user, coins: newCoins }));
    } catch (error) {
      console.error('Failed to update user coins:', error);
    }
  };

  const getUserDetails = async (userId) => {
    try {
      const response = await axios.get(`https://cinemaniahub.onrender.com/api/user/getUserDetails/${userId}`);
      return response.data; // Assuming response.data contains user details
    } catch (error) {
      return null;
    }
  };

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, loginUser, logoutUser, registerUser, updateUserCoins, getUserDetails }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
