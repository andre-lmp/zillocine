import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import '../shared-styles/App.css';
import { Swiper, SwiperSlide } from './Swiper.jsx';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { over } from "lodash";

const  fetchMovies = (props) => {
  const [moviesData, setMoviesData] = useState([]);
  const [swiperSlides, setSwiperSlides] = useState([]);
  const newDate = new Date().toISOString().split('T')[0];
  const apiKey = "e1534e69b483f2e9d62ea1c394850e4e";
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  const [type, setType] = useState(props.type);
  const componentRef = useRef(undefined);
  const imagesRef = useRef([]);
  const [swiperRef, setSwiperRef] = useState(undefined);

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

  const customTitles = {
    'Lançamentos': 'Em Destaque: Os Filmes Mais Recentes',
    'Ação': 'Adrenalina em cartaz',
    'Terror': 'Horror em exibição',
    'Comedia': 'Diversão com a família',
    'Documentario': 'Documentando o mundo',
    'Ficção': 'Universos paralelos: Ficção'
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

  const breakpoints = {
    300:{
      slidesPerView: 2,
      spaceBetween: 11
    },
    600: {
      slidesPerView: 3,
      spaceBetween: 17
    },
    820:{
      slidesPerView: 4,
      spaceBetween: 17
    },
    990:{
      slidesPerView: 5,
      spaceBetween: 17
    },
    1160:{
      slidesPerView: 6,
      spaceBetween: 17
    },
    1400:{
      slidesPerView: 7,
      spaceBetween: 17
    },
    1750: {
      slidesPerView: 8,
      spaceBetween: 17
    }
  };

  const handleCustomTitle = (title) => {
    if (customTitles[title]){
      return customTitles[title];
    }else{
      return title;
    }
  };
 
  const handleMoviesNavigation = (e) => {
    navigate(`/Page/${e}/${type}`);
  };

  const handleGenres = (genre, type) => {  
    let genreName = '';

    if (type === 'filme'){
      Object.entries(moviesGenres).forEach(([key, value]) => {
        if (value === genre){
          genreName = key;
        }
      });
    }
    else{
      Object.entries(seriesGenres).forEach(([key, value]) => {
        if (value === genre){
          genreName = key;
        }
      });
    }
    return genreName;
  };

  const renderSlides = (data) => {
    setSwiperSlides(
      <Swiper swiperRef={setSwiperRef} className="swiper-container" style={{width: '100%', height: 'auto'}} breakpoints={breakpoints}>
        {data.map((element, index) => (
          <SwiperSlide>
            <div key={element.id} className="swiper-image" onClick={() => {handleMoviesNavigation(element.id)}}>
              {element.poster_path && (
                <img
                  className="slide-images"
                  ref={(e) => { imagesRef.current[index] = e }}
                  src={`https://image.tmdb.org/t/p/w500${element.poster_path}`}
                  alt="Poster"
                />
              )}
              
              {element.backdrop_path && !element.poster_path && (
                <img
                  ref={(e) => { imagesRef.current[index] = e }}
                  src={`https://image.tmdb.org/t/p/w500${element.backdrop_path}`}
                  alt="Backdrop"
                />
              )}
      
              {!element.backdrop_path && !element.poster_path ? (
                handleUnavailableContent(index)
              ) : null}

              <div className="mv-overlay-info">
                  <h2>
                    {element.title &&
                      element.title
                    }
                    {element.name &&
                      element.name
                    }
                  </h2>
              </div>

            </div>
          </SwiperSlide>
        ))};
      </Swiper>
    );
    
    setAuthorized(true);
    props.isLoading(false);
  };

  useEffect(() => {

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchMovies = async () => {
      if (type === 'Movie') {
        if (props.genre === 'Lançamentos'){
          try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_date.gte=${newDate}&sort=primary_release_date.desc&language=pt-BR&include_image_language=pt&page=${props.page}`);
            if (response.ok){
              const data = await response.json();
              renderSlides(data.results);
              setMoviesData(data.results);
              setType('Movie');
            }else{
              props.isLoading(true);
              setAuthorized(false);
            }
          } catch (error) {
            props.isLoading(true);
            setAuthorized(false);
          }
        }else{
          try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${handleGenres(props.genre, 'filme')}&language=pt-BR&include_image_language=pt&page=${props.page}`);
            if (response.ok){
              const data = await response.json();
              renderSlides(data.results);
              setMoviesData(data.results);
              setType('Movie');
            }else{
              props.isLoading(true);
              setAuthorized(false);
            }
          } catch (error) {
            props.isLoading(true);
            setAuthorized(false);
          }
        }

      }else{
        if (props.genre === 'Lançamentos'){
          try {
            const lançamentos = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}&language=pt-BR&page=${props.page}`);
            if (lançamentos.ok) {
              const data = await lançamentos.json();
              setMoviesData(data.results);
              renderSlides(data.results);
              setType('Serie');
            }else{
              props.isLoading(true);
              setAuthorized(false);
            }
          } catch (error) {
            props.isLoading(true);
            setAuthorized(false);
          }
        }else{
          try{
            const lançamentos = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${handleGenres(props.genre, 'serie')}&page=${props.page}`);
            if (lançamentos.ok){
              const data = await lançamentos.json();
              setMoviesData(data.results);
              renderSlides(data.results);
              setType('Serie');
            }else{
              props.isLoading(true);
              setAuthorized(false);
            }
          } catch (error) {
            props.isLoading(true);
            setAuthorized(false);
          }
        }
      }
    }     
    fetchMovies();

    return () => {
      controller.abort();
    }
  },[type, props.genre]);

  const handleSwiperControl = (command) => {
    if (swiperRef){
      if (command === 'next') {
        swiperRef.slideNext();
      }else{
        swiperRef.slidePrev();
      }
    }
  };

  const handleUnavailableContent = (index) => {
    if (moviesData[index]){
      moviesData.splice(index, 1);
    }
  };

  return authorized && props.visible ? (
    <section ref={componentRef} className="movie-fetcher">
        <div className="container-content">
          <div className="title-box">
            {props.title ? (
              <h1 key={props.title}>{handleCustomTitle(props.title)}</h1>
            ): null}
          </div>
          <hr/>
          <section className="swiper-box">
            <button className="swiper-btns-control btn-left"><SlArrowLeft className="arrows" onClick={() => {handleSwiperControl('prev')}}/></button>
            <button className="swiper-btns-control btn-right"><SlArrowRight className="arrows" onClick={() => {handleSwiperControl('next')}}/></button>
            {swiperSlides && (
              swiperSlides
            )}
          </section>
        </div>

      </section>
  ): null;
}



export default fetchMovies;