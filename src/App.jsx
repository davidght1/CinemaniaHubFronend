// App.js
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { MovieProvider } from './context/MovieContext';
import Navbar from './components/navbar/Navbar';
import { UserProvider } from './context/UserContext';

function App() {
  const isAuthenticated = false; // Implement authentication logic here

  return (
    <MovieProvider>
      <UserProvider>
      <BrowserRouter>
        <Navbar isAuthenticated={isAuthenticated} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
      </UserProvider>
    </MovieProvider>
  );
}

export default App;
