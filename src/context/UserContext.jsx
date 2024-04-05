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
        const { id, email, name, userRole, token } = response.data;
        setUser({ id, email, name, userRole });
        setIsAuthenticated(true);
        localStorage.setItem('userData', JSON.stringify({ id, email, name, userRole }));
        localStorage.setItem('token', token);
      }
    
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error.response.data);
      if (error.response.data && error.response.data.error) {
        return { error: error.response.data.error };
      } else {
        return { error: 'Registration failed. Please try again.' };
      }
    }
  };

  // Login user
  const loginUser = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/login', formData);
      
      if (response.status === 200) {
        const { id, email, name, userRole, token } = response.data;
        setUser({ id, email, name, userRole });
        setIsAuthenticated(true);
        localStorage.setItem('userData', JSON.stringify({ id, email, name, userRole }));
        localStorage.setItem('token', token);
      }
    
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error.response.data);
      if (error.response.data && error.response.data.error) {
        return { error: error.response.data.error };
      } else {
        return { error: 'Login failed. Please try again.' };
      }
    }
  };


  // logout user
  const logoutUser = async()=>{
    try{
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('userData')
      localStorage.removeItem('token')
      await axios.post('http://localhost:5000/api/user/logout');
    }
    catch(error){
      console.log('Something went wrong', error)
    }
  }

  return (
    <UserContext.Provider value={{ user, isAuthenticated, registerUser, loginUser, checkTokenExpiration, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
