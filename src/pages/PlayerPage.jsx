import { useState, useEffect, useRef} from "react";
import { useParams } from "react-router-dom";
import '/src/styles/Player.css';

function PlayerPage() {
  const {id, type} = useParams();
  const [moviesDetails, setMoviesDetails] = useState([]);
  const apiKey = "e1534e69b483f2e9d62ea1c394850e4e";
  const apiURL = 'https://api.themoviedb.org/3/';
  const [autorizado, setAutorizado] = useState(false);
  const [imgUrl, setImgUrl] = useState("https://image.tmdb.org/t/p/original");
  const [loading, setLoading] = useState('true');
  const movieImgRef = useRef(undefined);
  const movieDetailsRef = useRef(undefined);

  const handleReleaseDate = (date) => {
    if (date){
      const newDate = [];
      for (let i = 0; i < 4; i++){
        newDate.push(date[i]);
      } 
      return newDate;
    }else{
      return undefined;
    }
  }

  const handleGenres = (object) => {
    const genres = [];
    for (let genre in object){
      genres.push(object[genre].name);
    }
    return genres;
  }

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

    return time;
  }

  const handleLoaderImage = () => {
    setLoading('false');
  }

  useEffect(() => {
    const fetchMovies = async () => {
      if (type === 'Movie') {
        try {
          const response = await fetch(`${apiURL}/movie/${id}?api_key=${apiKey}&language=pt-BR&page=1&include_image_language=pt&append_to_response=videos`);
          if (response.ok){
            const data = await response.json();
            setMoviesDetails(data);
            setAutorizado(true);
          }else{
            setAutorizado(false);
          }
        } catch (error) {
          console.log(error);
          setAutorizado(false);
        }
      }else{
        try {
          const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=pt-BR&page=1&include_image_language=pt&append_to_response=videos`);
          if (response.ok) {
            const data = await response.json();
            setMoviesDetails(data);
            setAutorizado(true);
          }else{
            setAutorizado(false);
          }
        } catch (error) {
          setAutorizado(false);
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
  
  return autorizado ?(
    <section className='player-container'>
      <section className='player-movies'>
        <div id="player-background"></div>
        <div className="player_container_info">
            <div ref={movieImgRef} id="img-box">
              { moviesDetails.poster_path !== null ? (
                  <img onLoad={handleLoaderImage} display={loading} src={`${imgUrl}${moviesDetails.poster_path}`}/>
              ):(
                  <img onLoad={handleLoaderImage} display={loading} src={`${imgUrl}${moviesDetails.backdrop_path}`}/>
              )}
            </div>
            <div ref={movieDetailsRef} id="details-box">
              <div>

                <div id="details-box-title">
                  <h1>{moviesDetails.title ? (
                        moviesDetails.title
                      ):(
                        moviesDetails.name
                      )}
                      <span>
                          ({moviesDetails.release_date ? (
                            handleReleaseDate(moviesDetails.release_date)
                          ): (
                            handleReleaseDate(moviesDetails.first_air_date)
                          )})
                      </span>
                  </h1>
            
                </div>

                <div id="release_date">
                  <div id="date_info">
                    <span className="decoration-icon">
                      {moviesDetails.release_date ? (
                        moviesDetails.release_date
                      ):(
                        moviesDetails.first_air_date
                      )}
                    </span>
                    <div className="decoration-icon" id="runtime">
                      {handleRunTime(moviesDetails.runtime).map((time, index) => (
                          index === 0 ?(
                            <span>{time}h</span>
                          ):(
                            <span>{time}m</span>
                          )
                      ))}
                    </div>
                    {handleGenres(moviesDetails.genres).map(genre => (
                    <span className="decoration-icon">{genre}</span>
                    ))}
                  </div>
                </div>

              </div>

              <div id="vote_average">
                <h3>Classificação Geral do Fans</h3>
                <div id="count">{moviesDetails.vote_average.toFixed(0)}0 <span>%</span></div>
              </div>

              <div id='overview-box'>
                <h2>Sinopse</h2>
                <p>{moviesDetails.overview ? (
                  moviesDetails.overview
                ): (
                  'Informação do filme/serie indisponivel neste momento. Recarregue a pagina novamente'
                )}</p>
              </div>

              <div id="btn-video-box">
                <button>Assistir Trailer</button>
              </div>
            </div>
        </div>
      </section>
      <section  className="player_img_background">
              <section className="player_img_container">
                { moviesDetails.backdrop_path !== null ? (
                  <img src={`${imgUrl}${moviesDetails.backdrop_path}`}/>
                ) : (
                  <img src={`${imgUrl}${moviesDetails.poster_path}`}/>
                )}
              </section>
      </section>
    </section>
  ) : null
}

export default PlayerPage;