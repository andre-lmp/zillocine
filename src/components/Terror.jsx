import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const  Terror = ({page,titulo, btn}) => {
  const [moviesDetails, setMoviesDetails] = useState([]);
  const newDate = new Date().toISOString().split('T')[0];
  const apiKey = "df087968ddf338b4ac0f9876af17f739";
  const apiUrl = "https://api.themoviedb.org/3/discover/movie";
  const generoterror = 27;
  const [telaWidth, setTelaWidth] = useState();
  const widthCarrosel = useRef();
  const widthApp = useRef();
  const [autorizado, setAutorizado] = useState(false);
  const navigate = useNavigate();
  const moviesGenres = {
    28: 'Ação',
    12: 'Aventura',
    16: 'Animação',
    35: 'Comédia',
    80: 'Crime',
    99: 'Documentário',
    18: 'Drama',
    10751: 'Família',
    14: 'Fantasia',
    36: 'História',
    27: 'Terror',
    10402: 'Música',
    9648: 'Mistério',
    10749: 'Romance',
    878: 'Ficção Científica',
    10770: 'Filme de TV',
    53: 'Thriller',
    10752: 'Guerra',
    37: 'Faroeste'
  };

  const handleClick = (e) => {
    const valor = e.target.attributes.value.value;
    navigate(`/Page/${valor}`);
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      setAutorizado(true);
    }, 1000);

    const setwidth = setTimeout(() => {
      setTelaWidth(widthCarrosel.current?.scrollWidth - widthApp.current?.offsetWidth);
    }, 2000);

    const fetchMovies = async () => {
      try{
        const lançamentos = await fetch(`${apiUrl}?api_key=${apiKey}&with_genres=${generoterror}&language=pt-BR&include_image_language=pt&page=${page}`);
        const data = await lançamentos.json();
        setMoviesDetails(data.results);
      } catch (error) {
        console.log(error);
      }
       
    }
    fetchMovies();
    
  },[])

  return autorizado ?(
    <div>
        <div className="container-movies" ref={widthApp}>

          {titulo === 'true' ? (
            <h1>terror</h1>
          ): null}
          <hr className="linha-titulo"></hr>
          {btn === 'true' ? (
              <button>Filmes</button>
          ) : null}

          <motion.div className="img-carrosel" drag="x" dragConstraints={{ right: 0, left: -telaWidth }} ref={widthCarrosel}>

            {moviesDetails.map((movie) => (
              <div className="movies-container" >
                <div className="movies-img" onClick={handleClick}><img value={movie.id} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/></div>
                <div className="movies-details">
                  <div className="details">
                    <h2>{movie.title}</h2>
                    <div className="generos">
                      <p>{moviesGenres[movie.genre_ids[0]]}</p>
                      <p>|</p>
                      <p>{movie.vote_average.toFixed(1)}<FontAwesomeIcon className="starIcon" icon={faStar}/></p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
          </motion.div>
        </div>
      </div>
  ) : null;
}



export default Terror;