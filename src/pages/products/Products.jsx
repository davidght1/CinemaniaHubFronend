import React from 'react';
import { useProductContext } from '../../context/ProductContext';
import './Products.css';

const Product = () => {
  const { products, loading } = useProductContext();

  return (
    <div className="products-container">
      <h2 className="page-title">All Products</h2> {/* Added class for page title */}
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
