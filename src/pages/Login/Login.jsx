import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import './Login.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { loginUser,user } = useContext(UserContext);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const { email, password } = formData;


  useEffect(()=>{
    if(user){
      navigate('/')
    }
  },[user])

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await loginUser(formData);
    if (response.error) {
      setError(response.error);
    } else {
      // Login successful, navigate to the home page
      navigate('/')
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" value={password} onChange={handleChange} required />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
