import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import '/src/App.css';
import {FaSearch} from "react-icons/fa";

function Header() {
  const movieIds = [603692, 346698, 298618, 507089];
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
  const navigate = useNavigate();
  const [headerAtivo, setHeaderAtivo] = useState('desativado');
  const [btnAtivo, setBtnAtivo] = useState('btnDesativado');
  const [type, setType] = useState('filme');


  const btnMovies = () => {
    navigate('/Filmes')
  }

  const handleClick = (e) => {
    const valor = e.target.attributes.value.value;
    navigate(`/Page/${valor}/${type}`);
  }

  const btnInicio = () => {
    navigate('/');
    setBtnAtivo('btnDesativado');
  }
  

  const btnClick = () => {
    if (btnAtivo === 'btnDesativado'){
      setBtnAtivo('btnAtivo')
    }else{
      setBtnAtivo('btnDesativado')
    }
  }

  const btnMenuMovies = () => {
    setBtnAtivo('btnDesativado');
    navigate('/Filmes');
  }

  const btnSeriesMenu = () => {
    navigate('/Series');
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      setAutorizado(true);
    }, 1000);

    const setwidth = setTimeout(() => {
      setTelaWidth(carrosel.current?.scrollWidth - carrosel.current?.offsetWidth);
    }, 2000);
    
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
    <main id="header-main">
          <div className="header-links">
            <div className='links-content'>
              <div id="btn-filmes-series" className="link-icons">
                <button onClick={btnClick} id="btn-menu">|||</button>
                <a className="btn-header"  onClick={btnMovies}>Filmes</a>
                <a className="btn-header" onClick={btnSeriesMenu}>Séries</a>
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

        <div className="div-menu" id={btnAtivo}>
          <ul>
            <li><button onClick={btnClick}><h1 id="p-1">/</h1><h1 id="p-2">\</h1></button></li>
            <li><p onClick={btnInicio}>Inicio</p></li>
            <li><p onClick={btnMenuMovies}>Filmes</p></li>
            <li><p onClick={btnSeriesMenu}>Series</p></li>
            <li><p>Conta</p></li>
          </ul>
        </div>

        <header className={headerAtivo}>
          <div className='header-images' ref={app}>
            <motion.div className="carrosel-header" ref={carrosel} drag="x" dragConstraints={{ right: 0, left: -telaWidth}}>
                {moviesDetails.map((movie) => (
                  <div className='carrosel-img'>
                      <img src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}/>
                        <div className="movieDetails">
                          <h1>{movie.title}</h1>
                          <p>{movie.tagline}</p>
                          <button onClick={handleClick} value={movie.id} id="btn-play"><FontAwesomeIcon onClick={handleClick} value={movie.id} id="icon" icon={faPlay}/></button>
                        </div>
                        <div className='header-fim'></div>
                  </div>
                ))};
            </motion.div>

          </div>
        </header>
    </main>
  ) : null;
}


export default Header;