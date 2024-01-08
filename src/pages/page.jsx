import { Link, useParams } from 'react-router-dom';
import { useState, useEffect} from "react";
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import {FaSearch} from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import '/src/App.css';

function Page() {
  const { id } = useParams();
  const [moviesDetails, setMoviesDetails] = useState([]);
  const apiKey = "df087968ddf338b4ac0f9876af17f739";
  const apiURL = 'https://api.themoviedb.org/3/';
  const [autorizado, setAutorizado] = useState(false);
  const navigate = useNavigate();
  const [ativo, setAtivo] = useState('desativado');
  const [ativo2, setAtivo2] = useState('desativado');
  const handleClick = () => {
    setAtivo('ativo');
    setAtivo2('ativo2')
  }

  const handleURL = () => {
    navigate("/");
  }

  useEffect(() => {

    const delay = setTimeout(() => {
      setAutorizado(true);
    }, 1000);

    const fetchMovies = async () => {
      try {
        const movieDetail = await fetch(`${apiURL}/movie/${id}?api_key=${apiKey}&language=pt-BR&page=1&language=pt-BR&include_image_language=pt&append_to_response=videos`);
        const data = await movieDetail.json();
        setMoviesDetails(data);
      } catch (error) {
        console.log(error);
      }

    }

    fetchMovies();

  },[]);
  
  return autorizado ?(
    <main className='page-container'>
      <header>
        <div className="header-links">
            <div className='links-content'>
              <div id="btn-filmes-series" className="link-icons">
                <button id="btn-menu">|||</button>
                <a onClick={handleURL} className='btn-header'>Home</a>
                <a className='btn-header'>Filmes</a>
              </div>

              <div className="links-titulo">
                <h1>MovieZilla</h1>
              </div>

              <div className='link-icons'>
                <FaSearch className='lupa-icon'/>
                <div className="button-header-div">
                  <button>V</button>
                  <h3>Conta</h3>
                </div>
              </div>

            </div>
        </div>

        <div className='header-images'>
          <div className="carrosel-header">
                <div className='carrosel-img' id={ativo}>
                  <img src={`https://image.tmdb.org/t/p/original/${moviesDetails.backdrop_path}`}/>
                  <div className="movieDetails">
                    <h2 className="pageTitle" >{moviesDetails.title}</h2>
                    <p>{moviesDetails.tagline}</p>
                    <button className="btn-play-page" id="btn-play" onClick={handleClick}><FontAwesomeIcon className="btn-icon-page" id="icon" icon={faPlay}/></button>
                  </div>
                  <div className='header-fim'></div>
                </div>
                <div id={ativo2} className='player-page'>
                <iframe
                    width="100%"
                    height="500"
                    src={`https://www.youtube.com/embed/${moviesDetails.videos.results[0].key}`}
                    frameBorder="0"
                    allow=" autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
          </div>
        </div>

      </header>

      <div className='about-movie'>
        <hr></hr>
        <div className='about-movie-text'>
          <h1>Sobre o filme</h1>
          <p>{moviesDetails.overview}</p>
        </div>
      </div>
    </main>
  ) : null
}

export default Page;