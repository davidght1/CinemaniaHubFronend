import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import './Register.css'; // Import CSS file for styling

const Register = () => {
  const { registerUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { name, email, password } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const success = await registerUser(formData);
    if (success) {
      window.location.href = '/'; // This will navigate to the home page
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h2>Register</h2>
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
      </div>
    </div>
  );
};

export default Register;
