import { Swiper, SwiperSlide } from './Swiper.jsx';
import { useEffect, useState } from 'react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import '../shared-styles/App.css';
import 'swiper/css';
import 'swiper/element/css/autoplay';
import 'swiper/element/css/pagination';

function MovieSlides(props) {
  const apiKey = "e1534e69b483f2e9d62ea1c394850e4e";
  const newDate = new Date().toISOString().split('T')[0];
  const [moviesData, setMoviesData] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate(undefined);

  const handleSelectionMovies = (data) => {
      const movieIds = [];
      for (let i = 0; i<=6; i++){
          movieIds.push(data[i]);
      }
      setMoviesData(movieIds);
      setAuthorized(true);
  };

  const handleReleaseDate = (date) => {
      const newDate = [];
      for (let i = 0; i < 4; i++){
        newDate.push(date[i]);
      } 
      return newDate;
  }

  const NavigateToPlayer = (e) => {
      const value = e.target.attributes.value.value;
      if (props.currentPage === 'SeriesPage'){
        navigate(`/Page/${value}/Serie`);
      }else{
        navigate(`/Page/${value}/Movie`);
      }
  }

  useEffect(() => {
  const fetchMovies = async (genre) => {
      if (props.currentPage === 'HomePage'){
        try {
          const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_date.gte=${newDate}&sort=primary_release_date.desc&language=pt-BR&include_image_language=pt`);
          if (response.ok) {
            const data = await response.json();
            setMoviesData(data.results);
            handleSelectionMovies(data.results);
            props.isVisible(true);
          }
        } catch{
          console.log(error);
          props.isVisible(false);
        }          

      }else{
        if (props.currentPage === 'MoviesPage'){
          try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=pt-BR&include_image_language=pt&page=1`);
            if (response.ok){
              const data = await response.json();
              return data.results;
            }

          } catch (error) {
            console.error(error);
          }
        }

        if (props.currentPage === 'SeriesPage') {
          try{
            const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${genre}&page=1`);
            if (response.ok){
              const data = await response.json();
              return data.results;
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
  };

  const selectBestMovies = async (list) => {
    const selectResult = [];

    const select = (item) => {
      let maxScore = 0;
      let maxScoreIndex = 0

      item.forEach((element, index) => {
        if (element.vote_average > maxScore){
          maxScore = element.vote_average
          maxScoreIndex = index;
          console.log(index);
        }
      });

      return item[maxScoreIndex];
    };

    for (let index in list){
      const getResultSelect =  async () => {
        const result = await select(list[index]);
        selectResult.push(result);
      };

      getResultSelect();
    }

    setMoviesData(selectResult);
    setAuthorized(true);
    props.isVisible(true);
  };
  
  const handleFetchMovies = async () => {
    let genres = [''];
    if (props.currentPage === 'MoviesPage'){
      genres = ['27','878','28', '10752', '10749', '99'];
    };

    if (props.currentPage === 'SeriesPage'){
      genres = ['9648', '878', '10759', '10764', '10768', '16', '99'];
    };

    const fetchDataResult = [];
    
    try{
      for (let index in genres) {
        const result = await fetchMovies(genres[index]);
        fetchDataResult.push(result);
      }
    }

    catch (error){
      console.error(error);
    }finally{
      selectBestMovies(fetchDataResult);
    }
  };

  if (props.currentPage === 'HomePage'){
    fetchMovies();
  }else{
    handleFetchMovies();
  }
  },[props.currentPage]);

  const removeUndefined = (index) => {
  moviesData.splice(index, 1);
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

  if (authorized) {
    return(
        <section className='presentation-slides'>
             <Swiper className='swiper' slidesPerView={1} autoplay={{delay: 4000}} speed='500' loop={true} pagination={{clickable: true}} modules={[Pagination, Autoplay]}>
                {moviesData.map((movie, index) => (
                    !movie ? (removeUndefined(index)) : null,
                    <SwiperSlide className='slide'>
                        <div className='presentation-img'>
                          {movie.backdrop_path ? (
                            <img src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} />
                          ): null}
                          {movie.poster_path ? (
                            <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} />
                          ): null}
                        </div>
                        <div className="movie-slides-info">
                            <h1>
                              {movie.title ? (
                                movie.title
                              ): (
                                movie.name
                              )}
                            </h1>

                            <h2>
                              {movie.release_date ? (
                                handleReleaseDate(movie.release_date)
                              ): (
                                handleReleaseDate(movie.first_air_date)
                              )}
                            </h2>
                              
                            {movie.overview ? (
                            <p>{movie.overview}</p>
                            ): (
                            <p>O lançamento de um dos mais aguardados filmes de uma sequencia de sucesso</p>
                            )}
                            <button onClick={NavigateToPlayer} value={movie.id} id="btn-play">
                              Ir para {props.contentType}
                            </button>
                        </div>
                    </SwiperSlide>
                ))};
          </Swiper>
        </section>
    )
  };
};


export default MovieSlides;
