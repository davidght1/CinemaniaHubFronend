import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { MovieProvider } from './context/MovieContext';
import Navbar from './components/navbar/Navbar';
import { UserProvider } from './context/UserContext';
import React, { useContext, useEffect } from 'react';

function App() {
  return (
    <MovieProvider>
      <UserProvider>
        <BrowserRouter>
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </BrowserRouter>
      </UserProvider>
    </MovieProvider>
  );
}

export default App;
