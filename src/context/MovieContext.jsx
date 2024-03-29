import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const MovieContext = createContext();

export const MovieProvider = ({children})=>{
    const [movies, setMovies] = useState([])

    useEffect(()=>{
        const fetchMovie = async ()=>{
            try{
                const response = await axios.get('http://localhost:5000/api/movie')
                setMovies(response.data.data)

            }
            catch(error){
                console.error('Error fetching movies:', error)
            }
        }
        fetchMovie();
    },[])   

    return (
        <MovieContext.Provider value={{ movies }}>
          {children}
        </MovieContext.Provider>
      );
}

export const useMovieContext = () => {
    const context = useContext(MovieContext);
    if (!context) {
      throw new Error('useMovieContext must be used within a MovieProvider');
    }
    return context;
  };

