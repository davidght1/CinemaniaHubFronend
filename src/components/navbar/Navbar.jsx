import React, { useState, useContext, useEffect } from 'react'; // Import useContext from react
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../../public/CinemaniaHub.png'; // Import the logo image
import { UserContext } from '../../context/UserContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useContext(UserContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logout");
  };

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
        <ul className={isOpen ? "nav-links open" : "nav-links"}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          {!isAuthenticated ? (
            <>
              <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
              <li><Link to="/register" onClick={closeMenu}>Register</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/products" onClick={closeMenu}>Products</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
