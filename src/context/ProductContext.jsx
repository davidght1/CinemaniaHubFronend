import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the ProductContext
const ProductContext = createContext();

// Custom hook to use the ProductContext
export const useProductContext = () => useContext(ProductContext);

// ProductContext Provider component
export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const fetchProducts = async (token) => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('http://localhost:5000/api/products', config);
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
  
    return (
      <ProductContext.Provider value={{ products, loading, fetchProducts }}>
        {children}
      </ProductContext.Provider>
    );
  };
