import React from "react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import '/src/styles/Swiper.css';
import { Swiper, SwiperSlide } from '/src/components/swiper/Swiper.jsx';
import { reject } from "lodash";

const  fetchMovies = (props) => {
  const [moviesData, setMoviesData] = useState([]);
  const newDate = new Date().toISOString().split('T')[0];
  const apiKey = "e1534e69b483f2e9d62ea1c394850e4e";
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  const [type, setType] = useState(props.type);
  const swiper = useRef(null);
  const btnsType = useRef();
  const [loading, setLoading] = useState('true');
  const [displayWidth, setDisplayWidth] = useState(0);
  const motionRef = useRef(undefined);
  const componentRef = useRef(undefined);
  const imagesRef = useRef([]);
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
  750: {
    slidesPerView: 3
  },
  820:{
    slidesPerView: 4
  },
  990:{
    slidesPerView: 5
  },
  1160:{
    slidesPerView: 6
  },
  1330:{
    slidesPerView: 7
  },
  1640:{
    slidesPerView: 8
  },
  1950:{
    slidesPerView: 9
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
    const valor = e.target.attributes.value.value;
    navigate(`/Page/${valor}/${type}`);
  };

  const defType = (e) => {
    setType(e.target.value);
    handleChangeType(e.target.value);
  };

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
  };

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
  };

  const getMotionHeight = () => {
    let width = 0;
    if (motionRef.current){
      width = 20 + (motionRef.current.scrollWidth - motionRef.current.offsetWidth);
      return -width;
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setAuthorized(true);
    }, 1000);

    const fetchMovies = async () => {
      if (type === 'Movie') {
        if (props.genre === 'Lançamentos'){
          try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_date.gte=${newDate}&sort=primary_release_date.desc&language=pt-BR&include_image_language=pt&page=${props.page}`);
            if (response.ok){
              const data = await response.json();
              setMoviesData(data.results);
              setType('Movie');
            }else{
              props.isLoading(true);
            }
          } catch (error) {
            props.isLoading(true);
          }
        }else{
          try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${handleGenres(props.genre, 'filme')}&language=pt-BR&include_image_language=pt&page=${props.page}`);
            if (response.ok){
              const data = await response.json();
              setMoviesData(data.results);
              setType('Movie');
            }else{
              props.isLoading(true);
            }
          } catch (error) {
            props.isLoading(true);
          }
        }

      }else{
        if (props.genre === 'Lançamentos'){
          try {
            const lançamentos = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}&language=pt-BR&page=${props.page}`);
            if (lançamentos.ok) {
              const data = await lançamentos.json();
              setMoviesData(data.results);
              setType('Serie');
            }else{
              props.isLoading(true);
            }
          } catch (error) {
            props.isLoading(true);
          }
        }else{
          try{
            const lançamentos = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${handleGenres(props.genre, 'serie')}&page=${props.page}`);
            if (lançamentos.ok){
              const data = await lançamentos.json();
              setMoviesData(data.results);
              setType('Serie');
            }else{
              props.isLoading(true);
            }
          } catch (error) {
            props.isLoading(true);
          }
        }
      }
    }     
    fetchMovies();
   
  },[type, props.genre]);

  useEffect(() => {
    const getDocumentWidth = () => {
      if (window.innerWidth){
        setDisplayWidth(window.innerWidth);
      }else{
        setTimeout(getDocumentWidth, 100);
      }
    };
  
    getDocumentWidth();

    window.addEventListener('resize', getDocumentWidth);

    const disableComponent = () => {
      if (!props.visible){
        if (componentRef.current){
          componentRef.current.style.display = 'none';
        }else{
          setTimeout(disableComponent, 100);
        }
      }else{
        if (componentRef.current){
          componentRef.current.style.display = 'block';
        }else{
          setTimeout(disableComponent, 100);
        }
      }
    };

    disableComponent();

    const loadImages = (url) => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
        image.onload = resolve;
        image.onerror = reject; 
      });
    };

    const checkImagesLoaded = async () => {
      try{

        await Promise.all(imagesRef.current.map((imageRef) => loadImages(imageRef.src)));
        props.isLoading(false);
        console.log('carregou');

      }catch (error){
        console.error(error);
      }
    };

    checkImagesLoaded();

  },[props.visible]);

  return authorized ? (
    <section ref={componentRef} className="movie-fetcher">
        <div className="container-content">
          <div className="title-box">
            {props.title ? (
              <h1 key={props.title}>{handleCustomTitle(props.title)}</h1>
            ): null}
          </div>
          <hr/>
          {props.btn === 'true' ? (
              <div ref={btnsType} className="btns-movie-serie">
                <button value='Movie' onClick={defType}>Filmes</button>
                <button value='Serie' onClick={defType}>Series</button>
            </div>
          ) : null}

          {displayWidth > 750 ? (
              <Swiper ref={swiper} className="swiper-container" style={{width: '100%', height: 'auto'}} breakpoints={breakpoints}>
                      {moviesData.map((movie, index) => (
                          <SwiperSlide className="swiper-slide" >
                            <div className="swiper-image" onClick={handleMoviesNavigation}>
                              { movie.poster_path ? (
                                <img className="slide-images" key={movie.id} value={movie.id} display={undefined} ref={(e) => {imagesRef.current[index] = e}} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/>
                              ):(
                                <img src="" display='false'/>
                              )
                              }
                            </div>
                          </SwiperSlide>
                      ))}
              </Swiper>
          ): (
            <motion.div
             ref={motionRef} 
             className="motion-container" 
             drag='x'  
             dragConstraints={{right: 0, left: getMotionHeight()}}  
            >
              {moviesData.map((movie) => (
                  <div>
                    <div display={loading} key={movie.id} className="motion-slide"  onClick={handleMoviesNavigation}>
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