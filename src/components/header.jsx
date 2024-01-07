import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import {FaSearch} from "react-icons/fa";

function Header() {
  const movieIds = [299534, 346698, 507089];
  const [moviesDetails, setMoviesDetails] = useState([]);
  const newDate = new Date().toISOString().split('T')[0];
  const apiKey = "df087968ddf338b4ac0f9876af17f739";
  const apiURL = 'https://api.themoviedb.org/3/';
  const count = movieIds.length;
  const [move, setMove] = useState(0);
  const app = useRef();
  const carrosel = useRef();
  const [telaWidth, setTelaWidth] = useState(0);
  const [autorizado, setAutorizado] = useState(false);

  
  useEffect(() => {
    const delay = setTimeout(() => {
      setAutorizado(true);
    }, 2000);

    const setwidth = setTimeout(() => {
      setTelaWidth(carrosel.current?.scrollWidth - carrosel.current?.offsetWidth);
    }, 3500);
    
    const fetchMovies = async () => {
      try {
        const moviePromises = movieIds.map(async (movieId) => {
           const bilheteria = await fetch(`${apiURL}/movie/${movieId}?api_key=${apiKey}&language=pt-BR&page=1&language=pt-BR&include_image_language=pt`)
           return bilheteria.json();
        });
         const data = await Promise.all(moviePromises);
         setMoviesDetails(data);
      } catch (error) {
        console.log(error);
      }
       
    }

    fetchMovies();
  },[])
  
  return autorizado ? (
    <header>
      <div className="header-links">
          <div className='links-content'>
            <div id="btn-filmes-series" className="link-icons">
              <button id="btn-menu">|||</button>
              <a href="#">Filmes</a>
              <a href="#">Séries</a>
            </div>

            <div className="links-titulo">
              <h1>MovieZilla</h1>
            </div>

            <div className='link-icons'>
              <FaSearch className='lupa-icon'/>
              <div className="button-header-div">
                <button id="icon-conta">V</button>
                <h3>Conta</h3>
              </div>
            </div>
            
          </div>
      </div>

      <div className='header-images' ref={app}>
        <motion.div className="carrosel-header" ref={carrosel} drag="x" dragConstraints={{ right: 0, left: -telaWidth}}>
            {moviesDetails.map((movie) => (
              <div className='carrosel-img'>
                <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}/>
                <div className="movieDetails">
                  <h1>{movie.title}</h1>
                  <p>{movie.tagline}</p>
                  <Link to="/Page"><button id="btn-play"><FontAwesomeIcon id="icon" icon={faPlay}/></button></Link>
                </div>
                <div className='header-fim'></div>
              </div>
            ))};
        </motion.div>

      </div>
    </header>
  ) : null;
}

export default Header;