import '../../shared-styles/App.css';
import { Swiper, SwiperSlide } from '../swiper-element/Swiper.jsx';
import { useEffect, useState, useContext } from 'react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { PiArrowElbowDownRightBold } from "react-icons/pi";
import 'swiper/css';
import 'swiper/element/css/autoplay';
import 'swiper/element/css/pagination';
import { TmdbContext } from '../context-api/tmdb-context/tmdbContext.jsx';

function MovieSlides(props) {
  const newDate = new Date().toISOString().split('T')[0];
  const [contentData, setContentData] = useState([]);
  const navigate = useNavigate(undefined);
  const apiKey = useContext(TmdbContext);

  const selectMovies = (data) => {
    const movieIds = [];
    for (let i = 0; i <= 6; i++) {
      movieIds.push(data[i]);
    }

    setContentData(movieIds);
    props.isVisible(true)
  };

  const getReleaseDate = (date) => {
    const newDate = [];
    for (let i = 0; i < 4; i++) {
      newDate.push(date[i]);
    }
    return newDate;
  }

  const navigateTo = (currentPage, id) => {
    currentPage === 'Movies' || currentPage === 'Home' ? (
      navigate(`/Player/Movie/${id}`)
    ) : (
      navigate(`/Player/Serie/${id}`)
    )
  }

  const fetchSeries = async (token, genre) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${token}&language=pt-BR&with_genres=${genre}&page=1`);
      if (response.ok) {
        const data = await response.json();
        return data.results;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMovies = async (genre, currentPage) => {
    if (currentPage === 'Home') {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey.token}&primary_release_date.gte=${newDate}&sort=primary_release_date.desc&language=pt-BR&include_image_language=pt`);
        if (response.ok) {
          const data = await response.json();
          selectMovies(data.results);
        }
      } catch {
        console.log(error);
        props.isVisible(false);
      }

    } else {
      if (currentPage === 'Movies') {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey.token}&with_genres=${genre}&language=pt-BR&include_image_language=pt&page=1`);
          if (response.ok) {
            const data = await response.json();
            return data.results
          }

        } catch (error) {
          console.error(error);
        }
      }
    };
  };

  const selectBestMovies = async (list) => {
    const selectResult = [];

    const select = (item) => {
      let maxScore = 0;
      let maxScoreIndex = 0

      item.forEach((element, index) => {
        if (element.vote_average > maxScore) {
          maxScore = element.vote_average
          maxScoreIndex = index;
        }
      });

      return item[maxScoreIndex];
    };

    for (let index in list) {
      const getResultSelect = async () => {
        const result = await select(list[index]);
        result ? (selectResult.push(result)) : null;
      };

      getResultSelect();
    }

    setContentData(selectResult);
    props.isVisible(true);
  };

  const fetchAllGenres = async (currentPage) => {
    const fetchDataResult = [];
    let genres = [''];

    if (props.currentPage === 'Movies') {
      genres = ['27', '878', '28', '10752', '10749', '99'];
    };

    if (props.currentPage === 'Series') {
      genres = ['9648', '878', '10759', '10764', '10768', '16', '99'];
    };

    try {
      for (let index in genres) {
        const result = currentPage === 'Series' ? await fetchSeries(apiKey.token, genres[index]) : await fetchMovies(genres[index], currentPage);
        fetchDataResult.push(result);
      }
    }

    catch (error) {
      console.error(error);
    }

    finally {
      selectBestMovies(fetchDataResult);
    }
  };

  useEffect(() => {
    props.currentPage === 'Home' ? (
      fetchMovies(null, props.currentPage)
    ) : (
      fetchAllGenres(props.currentPage)
    )
  }, []);

  return (
    contentData ? (
      <section className='presentation-slides' key={contentData.length}>
        <Swiper
          className='swiper'
          slidesPerView={1}
          spaceBetween={0}
          autoplay={{ delay: 4000 }}
          speed='500' 
          loop={true}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
        >
          {contentData.map((movie, index) => (
            !movie && (
              contentData[index].splice(index, 1)
            ),
            <SwiperSlide className='slide'>
              <div className='presentation-img'>
                {movie.backdrop_path ? (
                  <img src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} />
                ) : null}
                {movie.poster_path ? (
                  <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} />
                ) : null}
              </div>
              <div className="movie-slides-info">
                <h1>
                  {movie.title ? (
                    movie.title
                  ) : (
                    movie.name
                  )}
                </h1>

                <h2>
                  {movie.release_date ? (
                    getReleaseDate(movie.release_date)
                  ) : (
                    getReleaseDate(movie.first_air_date)
                  )}
                </h2>

                {movie.overview ? (
                  <p>{movie.overview}</p>
                ) : (
                  <p>O lançamento de um dos mais aguardados filmes de uma sequencia de sucesso</p>
                )}
                <button onClick={() => { navigateTo(props.currentPage, movie.id) }} id="btn-play">
                  <PiArrowElbowDownRightBold className='arrow-down' />
                  Ir para {props.currentPage === 'Home' ? 'Filmes' : (
                    props.currentPage === 'Movies' ? 'Filmes' : 'Series'
                  )}
                </button>
              </div>
            </SwiperSlide>
          ))};
        </Swiper>
      </section>
    ) : null
  )
};


export default MovieSlides;
