import React, { useContext, useEffect } from 'react';
import { useProductContext } from '../../context/ProductContext';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Products.css';

const Product = () => {
  const { products, loading, fetchProducts } = useProductContext(); // Destructure fetchProducts from ProductContext
  const { user } = useContext(UserContext);
  const navigate = useNavigate(); // Access useNavigate hook for navigation

  useEffect(() => {
    if (user && user.userRole === 'user') {
      const token = localStorage.getItem('token');
      if (token) {
        fetchProducts(token); // Call fetchProducts with the token
      } else {
        console.error('Token not found. User is not logged in.');
        setLoading(false);
      }
    } else {
      navigate('/login'); // Navigate to login if user is not authenticated or doesn't have the correct role
    }
  }, [user, fetchProducts, navigate]);

  return (
    <div className="products-container">
      <h2 className="page-title">All Products</h2>
      {/* Display user's available coins if user is logged in */}
      {user && (
        <p className="coins-info">
          You have <span className="coins-count">{user.coins}$</span> available
        </p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="products-list">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.pictureUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Product;
