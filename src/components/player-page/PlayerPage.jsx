import { useState, useEffect, useRef} from "react";
import React from "react";
import { Swiper, SwiperSlide } from '../app/shared-components/Swiper';
import { useParams } from "react-router-dom";
import { IoPlay } from "react-icons/io5";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import MoviesFetcher from '../app/shared-components/MovieFetcher';
import Message from '../app/shared-components/ErrorMessage';
import Player from "./Player";
import './Player.css';

function PlayerPage() {
  const {id, type} = useParams();
  const [contentData, setContentData] = useState([]);
  const [contentSeasons, setContentSeasons] = useState([]);
  const apiKey = "e1534e69b483f2e9d62ea1c394850e4e";
  const apiURL = 'https://api.themoviedb.org/3/';
  const [authorized, setAuthorized] = useState(false);
  const movieImgRef = useRef(undefined);
  const movieDetailsRef = useRef(undefined);
  const [swiperRef, setSwiperRef] = useState(undefined);
  const [playerRef, setPlayerRef] = useState(undefined);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const breakpoints = {
    750: {
      slidesPerView: 1,
      spaceBetween: 10
    },
    820:{
      slidesPerView: 2,
      spaceBetween: 17
    },
    990:{
      slidesPerView: 3,
      spaceBetween: 17
    },
    1160:{
      slidesPerView: 4,
      spaceBetween: 17
    },
    1330:{
      slidesPerView: 5,
      spaceBetween: 17
    }
  };

  const handleReleaseDate = (date) => {
    if (date){
      const newDate = [];
      for (let i = 0; i < 4; i++){
        newDate.push(date[i]);
      } 
      return newDate;
    }

    return undefined;
  };

  const handleGenres = (object) => {
    let genres = '';
    for (let genre in object){
      genres = object[genre].name;
      return genres;
    }
    return 'Comedia';
  };

  const handleRunTime = (runtime) => {
    let hours = 0;
    let minites = 0;
    const time = [];

    if (runtime >= 60){
      hours = parseInt(runtime / 60);
      minites = parseInt(runtime - (hours * 60));
      time.push(hours, minites);
    }else{
      minites = runtime;
      time.push(hours, minites);
    }

    return(
      <h2 className="content-runtime">
        <span>{time[0]}h</span>
        <span>{time[1]}m</span>
      </h2>
    );
  };

  const handleCompanyLogo = (url) => {
    let imgUrl = '';

    for (let index in url){
      if (url[index].logo_path){
        imgUrl = url[index].logo_path;
        return <img src={`https://image.tmdb.org/t/p/original${imgUrl}`}/>
      }
    }

    return undefined;
  };

  const handleSwiperControl = (command) => {
    if (swiperRef){
      if (command === 'next') {
        swiperRef.slideNext();
      }else{
        swiperRef.slidePrev();
      }
    }
  };

  const handleVideoPlayer = async (e) => {
    if (playerRef){
      const state = await playerRef.getInternalPlayer().getPlayerState();
    
      if (state === 1){
        playerRef.internalPlayer.pauseVideo();
        e.target.innerText = 'Click para retomar'
        setIsPlayerVisible(true);
      }else{
        if (state === 5 || state === 2){
            playerRef.internalPlayer.playVideo();
            e.target.innerText = 'Click para pausar'
            setIsPlayerVisible(true);
        }else{
          if (state === 0){
            playerRef.internalPlayer.loadVideoById(contentData.videos.results[0].key);
          }
        }
      }
    }else{
      setIsErrorMessage(true);
    };
  };

  useEffect(() => {
    const fetchMovies = async () => {
      if (type === 'Movie') {
        try {
          const response = await fetch(`${apiURL}/movie/${id}?api_key=${apiKey}&language=pt-BR&page=1&include_image_language=pt&append_to_response=videos`);
          if (response.ok){
            const data = await response.json();
            setContentData(data);
            setAuthorized(true);
          }else{
            setAuthorized(false);
          }
        } catch (error) {
          console.log(error);
          setAuthorized(false);
        }
      }else{
        try {
          const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=pt-BR&page=1&include_image_language=pt&append_to_response=videos`);
          if (response.ok) {
            const data = await response.json();
            setContentData(data);
            setAuthorized(true);
            setContentSeasons(data.seasons);
          }else{
            setAuthorized(false);
          }
        } catch (error) {
          setAuthorized(false);
          console.log(error);
        }
      }
    }

    fetchMovies();

    const equalizeHeights = () => {
      if (movieDetailsRef.current && movieImgRef.current){
        movieImgRef.current.style.height = `${movieDetailsRef.current.offsetHeight}px`;
      }else{
        setTimeout(equalizeHeights, 100);
      }
    };

    equalizeHeights();
  },[id]);
  
  return(
    <section className="player-component">
      {authorized ? (
        <section className="player-container">
          <section className="player-bg-img">

            {contentData.videos.results.length > 0 ? (
              <Player youtubeRef={setPlayerRef} isVisible={isPlayerVisible} id={contentData.videos.results[0].key}/>
            ): (
              <Message isVisible={isErrorMessage}/>
            )}

            {contentData.backdrop_path ? (
              <img src={`https://image.tmdb.org/t/p/original${contentData.backdrop_path}`} alt="tmdb images" />
            ): (
              <img src={`https://image.tmdb.org/t/p/original${contentData.poster_path}`} alt="tmdb images" />
            )}
            <div className="player-img-info">
              <h1>
                {contentData.title ? (
                  contentData.title
                ): (
                  contentData.name
                )}
              </h1>
              <div className="date-details">
                <h2 className="release-date">{contentData.release_date ? (
                    handleReleaseDate(contentData.release_date)
                  ): null }
        
                  {contentData.first_air_date ?  (
                    handleReleaseDate(contentData.first_air_date)
                  ): (
                    handleReleaseDate(contentData.last_air_date)
                  )}
                </h2>
                {contentData.runtime ? (
                  handleRunTime(contentData.runtime)
                ): null}
                {contentData.number_of_seasons ? (
                  <h2>{contentData.number_of_seasons} Temporadas</h2>
                ): null}
                {contentData.production_companies ? (
                  handleCompanyLogo(contentData.production_companies)
                ): null}
              </div>
              <button key={contentData.id} onClick={(e) => {handleVideoPlayer(e)}}>
                <IoPlay className="play-icon"/>
                Click para assistir
              </button>
            </div>
          </section>
          <section className="player-content-info">
            <p>{contentData.overview ? (
              contentData.overview
            ) : (
              'Desculpe, a descrição não está disponível no momento.'
            )}</p>
          </section>
          {type === 'Movie' ? (
            <section className="additional-content">
              <MoviesFetcher visible={true} isLoading={undefined} title='Você pode gostar' page='1' type='Movie' genre={handleGenres(contentData.genres)}/>
            </section>
          ): (
            <section className="additional-content">
              <h1 className="player-swiper-title">Temporadas</h1>
              <section className="swiper-box">
                <button className="swiper-btns-control btn-left" ><SlArrowLeft onClick={() => {handleSwiperControl('prev')}} className="arrows"/></button>
                <button className="swiper-btns-control btn-right" ><SlArrowRight onClick={() => {handleSwiperControl('next')}} className="arrows"/></button>
                <Swiper  breakpoints={breakpoints} swiperRef={setSwiperRef} >
                  {contentSeasons ? (
                    contentSeasons.map((seasons) => (
                      <SwiperSlide >
                        <div className="content-seasons">
                          {seasons.backdrop_path ? (
                            <img src={`https://image.tmdb.org/t/p/original${seasons.backdrop_path}`} alt="tmdb images" />
                          ): (
                            <img src={`https://image.tmdb.org/t/p/original${seasons.poster_path}`} alt="tmdb images" />
                          )}
                          <div className="content-seasons-info">
                            <h2>{seasons.name}</h2>
                            <span>
                              {seasons.air_date ? (
                                handleReleaseDate(seasons.air_date)
                              ): null}
                            </span>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  ): null}
                </Swiper>
              </section>
            </section>
          )}
        </section>
      ):(
        <Message/>
      )}
    </section>
  )
}

export default PlayerPage;