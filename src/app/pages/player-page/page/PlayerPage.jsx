import '../player-css/Player.css';
import { useState, useEffect, useRef, useContext} from "react";
import React from "react";
import { Swiper, SwiperSlide } from '../../../shared-components/swiper-element/Swiper.jsx';
import { useParams } from "react-router-dom";
import { IoPlay } from "react-icons/io5";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
const MoviesFetcher = React.lazy(() => import('../../../shared-components/content-fetcher/MoviesFetcher.jsx'));
import Message from '../../../shared-components/unavailable-content/ErrorMessage.jsx';
import Player from "../player/Player.jsx";
import { TmdbContext } from "../../../shared-components/context-api/tmdb-context/tmdbContext.jsx";

function PlayerPage() {
  const {type, id} = useParams();
  const [contentData, setContentData] = useState(undefined);
  const [contentSeasons, setContentSeasons] = useState(undefined);
  const [swiperRef, setSwiperRef] = useState(undefined);
  const [playerRef, setPlayerRef] = useState(undefined);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isThereMessage, setIsThereMessage] = useState(false);
  const [pageWidth, setPageWidth] = useState(window.innerWidth);
  const bgImageRef = useRef(undefined);
  const apiKey = useContext(TmdbContext);

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

  window.addEventListener('resize', () => {
    setPageWidth(window.innerWidth);
  });

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
        time[0] > 0 ? (
          <h2 className="content-runtime">
            <span>{time[0]}h</span>
            <span>{time[1]}m</span>
          </h2>
        ): (
          <h2 className="content-runtime">
            <span>{time[1]}m</span>
          </h2>
        )
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
    if (playerRef && contentData.videos.results.length > 0){
      setIsPlayerVisible(true);
      bgImageRef.current.style.opacity = 0;
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
      bgImageRef.current.style.opacity = 0;
      setIsThereMessage(true);
    };

  };

  const fetchMovie = async (token, movieId) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${token}&language=pt-BR&page=1&include_image_language=pt&append_to_response=videos`);
      if (response.ok){
        const data = await response.json();
        setContentData(data);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const fetchSerie = async (token, SerieId) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/tv/${SerieId}?api_key=${token}&language=pt-BR&page=1&include_image_language=pt&append_to_response=videos`);
      if (response.ok) {
        const data = await response.json();
        setContentData(data);
        setContentSeasons(data.seasons);
      }

    } catch (error) {
      console.log(error);
    }
  };
 
  useEffect(() => {
    type === 'Movie' ? (
      fetchMovie(apiKey.token, id)
    ) : (
      fetchSerie(apiKey.token, id)
    )
  },[id]);

  const removeContentIndex = (index) => {
    if (contentSeasons[index]){
      contentSeasons.splice(index, 1);
    }
  };
  
  return(
    <section className="player-component">
      {contentData ? (
        <section className="player-container">
          <section className="player-bg-img">

            {contentData.videos.results.length > 0 ? (
              <Player youtubeRef={setPlayerRef} isVisible={isPlayerVisible} id={contentData.videos.results[0].key}/>
            ): (
              <Message isVisible={isThereMessage}/>
            )}

            {contentData.backdrop_path ? (
              <img ref={bgImageRef} src={`https://image.tmdb.org/t/p/original${contentData.backdrop_path}`} alt="tmdb images" />
            ): (
              <img ref={bgImageRef} src={`https://image.tmdb.org/t/p/original${contentData.poster_path}`} alt="tmdb images" />
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
                
                {contentData.runtime &&
                  handleRunTime(contentData.runtime)
                }

                {contentData.number_of_seasons &&
                  <h2>{contentData.number_of_seasons} Temporadas</h2>
                }

                {contentData.production_companies &&
                  handleCompanyLogo(contentData.production_companies)
                }
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
              <MoviesFetcher sectionTitle={'Você pode gostar'} removeLine={true} page='1' genre={contentData.genres[0].id ? contentData.genres[0].id : 'lançamentos'}/>
            </section>
          ): (
            <section className="additional-content seasons-slides">
              <h1 className="player-swiper-title">Temporadas</h1>
              <section className="swiper-box">
                
                {swiperRef && 
                  swiperRef.virtualSize && 
                    swiperRef.virtualSize > pageWidth &&
                      <>
                        <button className="swiper-btns-control btn-left" ><SlArrowLeft onClick={() => {handleSwiperControl('prev')}} className="arrows"/></button>
                        <button className="swiper-btns-control btn-right" ><SlArrowRight onClick={() => {handleSwiperControl('next')}} className="arrows"/></button>
                      </>
                }

                <Swiper  breakpoints={breakpoints} swiperRef={setSwiperRef} >
                  {contentSeasons ? (
                    contentSeasons.map((seasons, index) => (
                      <SwiperSlide >
                        <div className="content-seasons" onMouseEnter={() => {setActiveOverlay('active-overlay')}} onMouseLeave={() => {setActiveOverlay('disabled-overlay')}}>
                          
                          {seasons.backdrop_path || seasons.poster_path &&
                            seasons.backdrop_path ? (
                              <img src={`https://image.tmdb.org/t/p/original${seasons.backdrop_path}`} alt="tmdb images" />
                            ): (
                              <img src={`https://image.tmdb.org/t/p/original${seasons.poster_path}`} alt="tmdb images" />
                            )
                          }

                          {!seasons.poster_path && !seasons.backdrop_path &&
                            removeContentIndex(index)
                          }

                          <div className="content-seasons-info">
                            <h2>{seasons.name}</h2>
                            <span>
                              {seasons.air_date ? (
                                handleReleaseDate(seasons.air_date)
                              ): null}
                            </span>
                          </div>

                          <div className='overlay-info'>
                            <h2>{contentData.name}</h2>
                            <h3>{seasons.name}</h3>
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