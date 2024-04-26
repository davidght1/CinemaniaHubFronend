import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { MovieProvider } from './context/MovieContext';
import Navbar from './components/navbar/Navbar';
import { UserContext, UserProvider } from './context/UserContext';
import React, { useContext, useEffect } from 'react';
import SingleMovie from './pages/SingleMovie/SingleMovie';
import Vote from './pages/Vote/Vote';
import Products from './pages/products/Products';
import { ProductProvider } from './context/ProductContext';
import CreateMovie from './pages/CreateMovie/CreateMovie';
import CreateProduct from './pages/CreateProduct/CreateProduct';
import UpdateMovie from './pages/UpdateMovie/UpdateMovie';

function App() {
  return (
    <MovieProvider>
      <UserProvider>
      <ProductProvider>
        <BrowserRouter>
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/single-movie/:id" element={<SingleMovie />} />
              <Route path='/vote/:id' element={<Vote/>}/>
              <Route path='/products' element={<Products/>}/>
              <Route path='/create-movie' element={<CreateMovie/>}/>
              <Route path='/create-product' element={<CreateProduct/>}/>
              <Route path='/update-movie/:id' element={<UpdateMovie/>}/>
            </Routes>
          </div>
        </BrowserRouter>
        </ProductProvider>
      </UserProvider>
    </MovieProvider>
  );
}

export default App;
