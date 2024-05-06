import { Swiper, SwiperSlide } from '/src/components/swiper/Swiper.jsx';
import { useEffect, useState } from 'react';
import { Pagination, Autoplay } from 'swiper/modules';
import '/src/styles/Home.css';
import 'swiper/css';
import 'swiper/element/css/autoplay';
import 'swiper/element/css/pagination';

function MovieSlides() {
    const apiKey = "df087968ddf338b4ac0f9876af17f739";
    const newDate = new Date().toISOString().split('T')[0];
    const [moviesData, setMoviesData] = useState([]);
    const [authorized, setAuthorized] = useState(false);

    const handleSelectionMovies = (data) => {
        const movieIds = [];
        for (let i = 0; i<=4; i++){
            movieIds.push(data[i]);
        }
       setMoviesData(movieIds);
    };

    const handleReleaseDate = (date) => {
        const newDate = [];
        for (let i = 0; i < 4; i++){
          newDate.push(date[i]);
        } 
        return newDate;
    }

    const NavigateToMovie = (e) => {
        const value = e.target.attributes.value.value;
        navigate(`/Page/${value}/Movie`);
      }

   useEffect(() => {
    const fetchMovies = async () => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_date.gte=${newDate}&sort=primary_release_date.desc&language=pt-BR&include_image_language=pt`);
          const data = await response.json();
          setMoviesData(data.results);
          handleSelectionMovies(data.results);
        } catch{
          console.log(error);
        }
    }
  
    window.addEventListener('load', () => {
      setAuthorized(true);
    });
    fetchMovies();
   },[]);

   if (authorized) {
    return(
        <section className='home-slides-container'>
             <Swiper className='swiper' slidesPerView={1} autoplay={{delay: 4000}} speed='500' loop={true} pagination={{clickable: true}} modules={[Pagination, Autoplay]}>
                {moviesData.map((movie) => (
                    <SwiperSlide className='slide'>
                        <img src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} />
                        <div className="movie-slides-info">
                            <h1>{movie.title}</h1>
                            <h2>{handleReleaseDate(movie.release_date)}</h2>
                            {movie.overview ? (
                            <p>{movie.overview}</p>
                            ): (
                            <p>O lançamento de um dos mais aguardados filmes de uma sequencia de sucesso</p>
                            )}
                            <button onClick={NavigateToMovie} value={movie.id} id="btn-play">Ir para o Filme</button>
                        </div>
                        <div className='container-end'></div>
                    </SwiperSlide>
                ))};
          </Swiper>
        </section>
    )
  };
};


export default MovieSlides;
