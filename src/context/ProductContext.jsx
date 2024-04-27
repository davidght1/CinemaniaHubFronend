import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Create the ProductContext
const ProductContext = createContext();

// Custom hook to use the ProductContext
export const useProductContext = () => useContext(ProductContext);

// ProductContext Provider component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponMessage, setCouponMessage] = useState(null);

  const fetchProducts = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get('https://cinemaniahub.onrender.com/api/products', config);
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const buyProduct = async (productId, user) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`https://cinemaniahub.onrender.com/api/products/buy/${productId}`, config);
  
      const { message, coupon, updatedCoins } = response.data;
      return { success: true, message, coupon, updatedCoins };
    } catch (error) {
      if (error.response.status === 400) {
        const { message } = error.response.data;
        return { success: false, error: message };
      } else {
        console.error('Error buying product:', error);
        return { success: false, error: 'Failed to buy product. Please try again.' };
      }
    }
  };


  const clearCouponMessage = () => {
    // Clear coupon message after displaying
    setCouponMessage(null);
  };

  return (
    <ProductContext.Provider value={{ products, loading, fetchProducts, buyProduct, couponMessage, clearCouponMessage }}>
      {children}
    </ProductContext.Provider>
  );
};
