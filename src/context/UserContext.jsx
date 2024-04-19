import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('userData');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
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

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, loginUser, logoutUser, updateUserCoins }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
