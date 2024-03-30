
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'

//context
import { MovieProvider } from './context/MovieContext'
import Navbar from './components/navbar/Navbar'

function App() {
  const isAuthenticated = false; // need implements later if user logged in or not
  
  return (
    <MovieProvider>
      <BrowserRouter>
      <Navbar isAuthenticated={isAuthenticated}/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
        </Routes>
      </BrowserRouter>
    </MovieProvider>
  )
}

export default App
