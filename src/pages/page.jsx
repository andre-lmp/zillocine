import { Link } from 'react-router-dom';
import { useState, useEffect} from "react";
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import {FaSearch} from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function Page() {
  const movieId = 346698;
  const [moviesDetails, setMoviesDetails] = useState([]);
  const apiKey = "df087968ddf338b4ac0f9876af17f739";
  const apiURL = 'https://api.themoviedb.org/3/';

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movieDetail = await fetch(`${apiURL}/movie/${movieId}?api_key=${apiKey}&language=pt-BR&page=1&language=pt-BR&include_image_language=pt`)
        const data = await movieDetail.json();
        setMoviesDetails(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }

    }

    fetchMovies();

  },[]);
  
  return(
    <main className='page-container'>
      <header>
        <div className="header-links">
            <div className='links-content'>
              <div id="btn-filmes-series" className="link-icons">
                <button id="btn-menu">|||</button>
                <a href="#">Filmes</a>
                <a href="#">Séries</a>
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
                <div className='carrosel-img'>
                  <img src={`https://image.tmdb.org/t/p/original/${moviesDetails.poster_path}`}/>
                  <div className="movieDetails">
                    <h1 id="h1-page">{moviesDetails.title}</h1>
                    <p>{moviesDetails.tagline}</p>
                    <Link to="/"><button className="btn-play-page" id="btn-play"><FontAwesomeIcon id="icon" icon={faPlay}/></button></Link>
                  </div>
                  <div className='header-fim'></div>
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
  ) 
}

export default Page;