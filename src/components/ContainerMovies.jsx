import React from "react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import '/src/App.css';
import { Swiper, SwiperSlide } from '/src/components/swiper/Swiper.jsx';

const  fetchMovies = (props) => {
  const [moviesDetails, setMoviesDetails] = useState([]);
  const newDate = new Date().toISOString().split('T')[0];
  const apiKey = "df087968ddf338b4ac0f9876af17f739";
  const [telaWidth, setTelaWidth] = useState();
  const widthCarrosel = useRef();
  const widthApp = useRef();
  const [autorizado, setAutorizado] = useState(false);
  const navigate = useNavigate();
  const [type, setType] = useState(props.tipo);
  const [widthSize, setWidthSize] = useState(window.innerWidth);
  const swiper = useRef(null);
  const btnsType = useRef();

  window.addEventListener('resize', () => {
    setWidthSize(window.innerWidth);
  })

  const moviesGenres = {
    28: 'Ação',
    12: 'Aventura',
    16: 'Animação',
    35: 'Comedia',
    80: 'Crime',
    99: 'Documentario',
    18: 'Drama',
    10751: 'Família',
    14: 'Fantasia',
    36: 'História',
    27: 'Terror',
    10402: 'Música',
    9648: 'Mistério',
    10749: 'Romance',
    878: 'Ficção Cientifica',
    10770: 'Filme de TV',
    53: 'Thriller',
    10752: 'Guerra',
    37: 'Faroeste'
  };

  const seriesGenres = {
    10759: "Ação",
    16: "Animação",
    35: "Comedia",
    80: "Crime",
    99: "Documentario",
    18: "Drama",
    10751: "Família",
    10764: "Kids",
    9648: 'Terror',
    10767: "Nova Temporada",
    878: "Ficção cientifica",
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
    handleChangeType(e.target.value);
  }

  const handleGenres = (value, type) => {
    let genre = '';
    if (type === 'filme'){
      for (let item in moviesGenres){
        if (value === moviesGenres[item]){
          genre = item;
        }
      }
    }else{
      for (let item in seriesGenres){
        if (value === seriesGenres[item]){
          genre = item;
        }
      }
    }
    return genre;
  }

  const handleChangeType = (type) => {
    if (btnsType.current){
      const children = btnsType.current.childNodes;
      for (let child in children){
        if (children[child].value === type){
          children[child].style.border = '1pt solid white';
        }else{
          children[child].style.border = '1pt solid red';
        }
      }
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      setAutorizado(true);
    }, 1000);

    const fetchMovies = async () => {
      if (type === 'filme') {
        if (props.genre === 'Lançamentos'){
          try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_date.gte=${newDate}&sort=primary_release_date.desc&language=pt-BR&include_image_language=pt&page=${props.page}`);
            const data = await response.json();
            setMoviesDetails(data.results);
            setType('filme')
          } catch (error) {
          }
        }else{
          try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${handleGenres(props.genre, 'filme')}&language=pt-BR&include_image_language=pt&page=${props.page}`);
            const data = await response.json();
            setMoviesDetails(data.results);
            setType('filme')
          } catch (error) {
          }
        }

      }else{
        if (props.genre === 'Lançamentos'){
          try {
            const lançamentos = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}&language=pt-BR&page=${props.page}`);
            const data = await lançamentos.json();
            setMoviesDetails(data.results);
            setType('serie')
          } catch (error) {
          }
        }else{
          try{
            const lançamentos = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${handleGenres(props.genre, 'serie')}&page=${props.page}`);
            const data = await lançamentos.json();
            setMoviesDetails(data.results);
            setType('serie');
          } catch (error) {
          }
        }
      }
    }     
  fetchMovies();

  },[type, props.genre])

  return autorizado ? (
    <section className="movies-container" id="movies-container">
        <div className="container-content" ref={widthApp}>
          <div className="title-box">
            {props.titulo ? (
              <h1 key={props.titulo}>{props.titulo}</h1>
            ): null}
          </div>
            <hr/>
          {props.btn === 'true' ? (
              <div ref={btnsType} className="btns-movie-serie">
                <button value='filme' onClick={defTipo}>Filmes</button>
                <button value='serie' onClick={defTipo}>Series</button>
            </div>
          ) : null}

          {widthSize > 750 ? (
              <Swiper ref={swiper} className="swiper-container" style={{width: '100%', height: 'auto'}} slidesPerView={6}>
                      {moviesDetails.map((movie) => (
                          <SwiperSlide className="swiper-slide" >
                            <div key={movie.id} id="swiper-img" className="movies-img" onClick={handleClick}><img value={movie.id} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/></div>
                          </SwiperSlide>
                      ))}
              </Swiper>
          ): (
            <motion.div className="motion-slides" drag="x" dragConstraints={{ right: 0, left: -telaWidth }} ref={widthCarrosel}>
              {moviesDetails.map((movie) => (
                <div className="container-content" >
                  <div className="movies-img"  onClick={handleClick}>
                    {movie.poster_path ? (
                      <img value={movie.id} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/>
                    ):(
                      <img value={movie.id} src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}/>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
          
        </div>
      </section>
  ): null;
}



export default fetchMovies;