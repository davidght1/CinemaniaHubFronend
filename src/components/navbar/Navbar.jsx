import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../../public/CinemaniaHub.png';
import { UserContext } from '../../context/UserContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logoutUser } = useContext(UserContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
  };

  useEffect(() => {
    // Debug: Log authentication state and user object
  }, [isAuthenticated, user]);

  // Debug: Log user role for additional visibility
  useEffect(() => {
    if (user && user.userRole) {
    }
  }, [user]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={logo} alt="CinemaniaHub Logo" />
        </Link>
        <div className="menu-toggle" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <ul className={isOpen ? 'nav-links open' : 'nav-links'}>
          <li>
            <Link to="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          {!isAuthenticated ? (
            <>
              <li>
                <Link to="/login" onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMenu}>
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              {user && user.userRole === 'admin' && (
                <li>
                  <Link to="/add-movie" onClick={closeMenu}>
                    Add Movie
                  </Link>
                </li>
              )}
              {user && user.userRole === 'cinemaowner' && (
                <li>
                  <Link to="/movie-stats" onClick={closeMenu}>
                    Movie Stats
                  </Link>
                </li>
              )}
              {user && user.userRole === 'user' && (
                <li>
                  <Link to="/products" onClick={closeMenu}>
                    Products
                  </Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
              {user && (
                <li className="welcome-back">
                  Welcome back, {user.name}
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
