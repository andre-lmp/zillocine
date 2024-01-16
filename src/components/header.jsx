import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import '/src/App.css';
import {FaSearch} from "react-icons/fa";
import { transform } from "typescript";

function Header() {
  const movieIds = [603692, 346698, 298618, 507089];
  const [moviesDetails, setMoviesDetails] = useState([]);
  const newDate = new Date().toISOString().split('T')[0];
  const apiKey = "df087968ddf338b4ac0f9876af17f739";
  const apiURL = 'https://api.themoviedb.org/3/';
  const [move, setMove] = useState(0);
  const app = useRef();
  const carrosel = useRef();
  const [telaWidth, setTelaWidth] = useState(0);
  const [autorizado, setAutorizado] = useState(false);
  const navigate = useNavigate();
  const [headerAtivo, setHeaderAtivo] = useState('desativado');
  const [btnAtivo, setBtnAtivo] = useState('btnDesativado');
  const [type, setType] = useState('filme');
  const [translate, setTranslate] = useState(0);
  const countImgs = movieIds.length;
  const [count, setCount] = useState(1);
  const [delay, setDelay] = useState(5000);
  const [indexImg1, setIndexImg1] = useState('indexAtivo');
  const [indexImg2, setIndexImg2] = useState();
  const [indexImg3, setIndexImg3] = useState();
  const [indexImg4, setIndexImg4] = useState();


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

  const btnPerfil = () => {
    navigate('/Perfil');
  }

  const Condição = (count) => {
    if (count === 0) {
      setIndexImg1('indexAtivo');
      setIndexImg4('indexDesativado');
    }

    if (count === 1) {
      setIndexImg2('indexAtivo');
      setIndexImg1('indexDesativado');
    } 

    if (count === 2) {
      setIndexImg3('indexAtivo');
      setIndexImg2('indexDesativado');
    }

    if (count === 3) {
      setIndexImg4('indexAtivo');
      setIndexImg3('indexDesativado');
    }
  }

  const netxCarrosel = () => {
    setCount(count + 1);
    if (count !== countImgs) {
      setTranslate(count * -100);
    }else{
      setCount(0);
      setDelay(0);
    };
    
    Condição(count);
    setDelay(6000); 
  }

  setTimeout(netxCarrosel, delay);
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
                  <button id="icon-conta" onClick={btnPerfil}>C</button>
                  <h3 onClick={btnPerfil}>Conta</h3>
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
            <li><p onClick={btnPerfil}>Conta</p></li>
          </ul>
        </div>

        <header className={headerAtivo}>
          <div className="imgIndex">
            <ul>
              <li id={0} className={indexImg1}></li>
              <li id={1} className={indexImg2}></li>
              <li id={2} className={indexImg3}></li>
              <li id={3} className={indexImg4}></li>
            </ul>
          </div>
          <div className='header-images' ref={app}>
            <motion.div style={{transform:`translateX(${translate}%)`}} className="carrosel-header" ref={carrosel}  dragConstraints={{ right: 0, left: -telaWidth}}>
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