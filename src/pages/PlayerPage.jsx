import { useState, useEffect, useRef} from "react";
import { useParams } from "react-router-dom";
import { IoPlay } from "react-icons/io5";
import '/src/styles/Player.css';

function PlayerPage() {
  const {id, type} = useParams();
  const [contentData, setContentData] = useState([]);
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
            setContentData(data);
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
            setContentData(data);
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
    <section className="player-pg-container">
      <div className="player-bg-img">
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
            <h2>2024</h2>
            <h2>1h 06m</h2>
          </div>
          <button>
            <IoPlay className="play-icon"/>
            Assistir Trailer</button>
        </div>
      </div>
    </section>
  ) : null
}

export default PlayerPage;