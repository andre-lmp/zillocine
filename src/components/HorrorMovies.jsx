import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination'
import '/src/App.css';

const  HorrorMovies = ({page,titulo, btn, tipo}) => {
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
  const [type, setType] = useState(tipo);
  const [widthScreen, setWidthScreen] = useState(window.innerWidth);

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

  const seriesGenres = {
    10759: "Ação",
    16: "Animação",
    35: "Comédia",
    80: "Crime",
    99: "Documentário",
    18: "Drama",
    10751: "Família",
    10764: "Kids",
    9648: "Mistério",
    10767: "Nova Temporada",
    878: "Ficção científica",
    10763: "Reality",
    10762: "Soap",
    10766: "Talk Show",
    10768: "Guerra",
    37: "Faroeste"
  };

  const handleClick = (e) => {
    const valor = e.target.attributes.value.value;
    navigate(`/Page/${valor}/${type}`);
  }

  const defTipo = (e) => {
    setType(e.target.value);
  }

  const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    modules: [Navigation, Pagination],
    breakpoints: {
      1590: {
        slidesPerGroup: 7,
        slidesPerView: 7,
      },

      1380: {
        slidesPerGroup: 6,
        slidesPerView: 6,
      },

      1170: {
        slidesPerGroup: 5,
        slidesPerView: 5,
      },

      960: {
        slidesPerGroup: 4,
        slidesPerView: 4,
      },

      630: {
        slidesPerGroup: 3,
        slidesPerView: 3,
      }
    },

    effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }  
  });

  useEffect(() => {
    const delay = setTimeout(() => {
      setAutorizado(true);
    }, 1000);

    const setwidth = setTimeout(() => {
      setTelaWidth(widthCarrosel.current?.scrollWidth - widthApp.current?.offsetWidth);
    }, 2000);

    const fetchMovies = async () => {
      if (type === 'filme') {
        try{
          const lançamentos = await fetch(`${apiUrl}?api_key=${apiKey}&with_genres=${generoterror}&language=pt-BR&include_image_language=pt&page=${page}`);
          const data = await lançamentos.json();
          setMoviesDetails(data.results);
          setType('filme');
        } catch (error) {
          console.log(error);
        }
      } else{
          try{
            const lançamentos = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=9648&page=${page}`);
            const data = await lançamentos.json();
            setMoviesDetails(data.results);
            setType('serie');
          } catch (error) {
            console.log(error);
          }
        }
    }
    fetchMovies();
    
    
  },[type, widthScreen])

  return autorizado ?(
    <div>
        <div className="container-movies" ref={widthApp}>

          {titulo === 'true' ? (
            <h1>terror</h1>
          ): null}
          <hr className="linha-titulo"></hr>
          {btn === 'true' ? (
              <div className="btns-movie-serie">
                <button value='filme' onClick={defTipo}>Filmes</button>
                <button value='serie' onClick={defTipo}>Series</button>
            </div>
          ) : null}

          {widthScreen > 750 ? (
              <div className="swiper">
                <div className="swiper-wrapper">
                    {moviesDetails.map((movie) => (
                        <div className="swiper-slide" >
                          <div id="swiper-img" className="movies-img" onClick={handleClick}><img value={movie.id} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/></div>
                          <div className="movies-details">
                            <div className="details">
                            {movie.title ? (
                                <h2>{movie.title}</h2>
                              ): (
                                <h2>{movie.name}</h2>
                              )}
                              <div className="generos">
                                {tipo === 'filme' ? (
                                 <p>{moviesGenres[movie.genre_ids[0]]}</p>
                                ): (
                                  <p>{seriesGenres[movie.genre_ids[0]]}</p>
                                )}
                                <p>|</p>
                                <p>{movie.vote_average.toFixed(1)}<FontAwesomeIcon className="starIcon" icon={faStar}/></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>

                <div className="swiper-pagination"></div>
                <div className="swiper-button-next"></div>
                <div className="swiper-scrollbar"></div>
                <div className="swiper-button-prev"></div>
              </div>
          ): (
            <motion.div className="img-carrosel" drag="x" dragConstraints={{ right: 0, left: -telaWidth }} ref={widthCarrosel}>
              {moviesDetails.map((movie) => (
                <div className="movies-container" >
                  <div className="movies-img" onClick={handleClick}>
                    {movie.poster_path ? (
                        <img value={movie.id} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/>
                    ):(
                        <img value={movie.id} src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}/>
                    )}
                  </div>
                  <div className="movies-details">
                    <div className="details">
                    {movie.title ? (
                        <h2>{movie.title}</h2>
                      ): (
                        <h2>{movie.name}</h2>
                      )}
                      <div className="generos">
                        {tipo === 'filme' ? (
                          <p>{moviesGenres[movie.genre_ids[0]]}</p>
                        ): (
                          <p>{seriesGenres[movie.genre_ids[0]]}</p>
                        )}
                        <p>|</p>
                        <p>{movie.vote_average.toFixed(1)}<FontAwesomeIcon className="starIcon" icon={faStar}/></p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
       
        </div>
      </div>
  ) : null;
}



export default HorrorMovies;