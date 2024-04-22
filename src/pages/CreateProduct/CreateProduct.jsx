import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateProduct.css'; // Import CSS for styling

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('photo', photo);

      const token = localStorage.getItem('token'); // Retrieve token from local storage

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.post('http://localhost:5000/api/products/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });

      if (response.status === 201) {
        setMessage('Product created successfully');
        // Reset form fields
        setName('');
        setPrice('');
        setPhoto(null);

        // Navigate to home page after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      setMessage('Failed to create product. Please try again.');
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="create-product-container">
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Product Picture:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </div>
        <button type="submit" className="submit-button">Create Product</button>
      </form>
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default CreateProduct;
