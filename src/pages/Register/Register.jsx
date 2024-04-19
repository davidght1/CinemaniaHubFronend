import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './Register.css'; // Import CSS file for styling

const Register = () => {
  const { registerUser, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const { name, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await registerUser(formData);
    if (response.error) {
      setError(response.error);
    } else {
      // Registration successful, navigate to the home page
      navigate('/');
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" value={password} onChange={handleChange} required />
          </div>
          <button type="submit" className="register-btn">Register</button>
        </form>
        
        {/* Display message and link for users who already have an account */}
        <p className="login-link">
          Already have an account?{' '}
          <Link to="/login" className="custom-login-link">
            Come back to us!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
