import React, { useContext, useEffect, useState } from 'react';
import { useProductContext } from '../../context/ProductContext';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './Products.css';

const Product = () => {
  const { products, loading, fetchProducts, buyProduct } = useProductContext();
  const { user, updateUserCoins } = useContext(UserContext);
  const navigate = useNavigate();

  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.userRole !== 'user') {
      navigate('/login');
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        fetchProducts(token);
      } else {
        console.error('Token not found. User is not logged in.');
      }
    }
  }, [user, fetchProducts, navigate]);

  const handleBuyProduct = async (productId) => {
    try {
      const result = await buyProduct(productId, user);
      if (result.success) {
        const { updatedCoins, coupon } = result;
        updateUserCoins(updatedCoins);
        setShowCouponPopup(true);
        setCoupon(coupon);
      } else {
        const { error } = result;
        setError(error);

        // Clear the error message after 8 seconds
        setTimeout(() => {
          setError('');
        }, 8000);
      }
    } catch (error) {
      console.error('Error buying product:', error);
      setError('Failed to buy product. Please try again.');

      // Clear the error message after 8 seconds
      setTimeout(() => {
        setError('');
      }, 8000);
    }
  };

  const handleExitPopup = () => {
    setShowCouponPopup(false);
    setCoupon('');
    setError('');
  };

  return (
    <div className="products-container">
      <h2 className="page-title">All Products</h2>
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
              <button onClick={() => handleBuyProduct(product._id)}>Buy</button>
              {error && (
                <div className="notification error">
                  {error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showCouponPopup && (
        <div className="coupon-popup">
          <h3>Coupon Number</h3>
          <p>Please take your time to save this coupon number for later use:</p>
          <p className="coupon-number">{coupon}</p>
          <button onClick={handleExitPopup}>Exit</button>
        </div>
      )}
    </div>
  );
};

export default Product;
