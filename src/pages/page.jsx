import { useState, useEffect, useRef} from "react";
import { useParams } from "react-router-dom";
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import {FaSearch} from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import '/src/App.css';

function Page() {
  const {id, type} = useParams();
  const [moviesDetails, setMoviesDetails] = useState([]);
  const apiKey = "df087968ddf338b4ac0f9876af17f739";
  const apiURL = 'https://api.themoviedb.org/3/';
  const [autorizado, setAutorizado] = useState(false);
  const navigate = useNavigate();
  const [ativo, setAtivo] = useState('desativado');
  const headerContainer = useRef();
  const [ativo2, setAtivo2] = useState('desativado');
  const [imgUrl, setImgUrl] = useState("https://image.tmdb.org/t/p/original");
  const [btnAtivo, setBtnAtivo] = useState('btnDesativado');
  const handleClick = () => {
    setAtivo('ativo');
    setAtivo2('ativo2')
  }

  const handleURL = () => {
    navigate("/");
  }

  const btnInicio = () => {
    navigate('/');
    setBtnAtivo('btnDesativado');
  }

  const btnClick = () => {
    if (btnAtivo === 'btnDesativado'){
      setBtnAtivo('btnAtivo')
    }else{
      setBtnAtivo('btnDesativado')
    }
  }

  const btnFilmes = () => {
    navigate('/Filmes');
  }

  const btnSeries = () => {
    navigate('/Series');
  }

  const btnPerfil = () => {
    navigate('/Perfil');
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      setAutorizado(true);
    }, 1000);

    const fetchMovies = async () => {
      if (type === 'filme') {
        try {
          const movieDetail = await fetch(`${apiURL}/movie/${id}?api_key=${apiKey}&language=pt-BR&page=1&language=pt-BR&include_image_language=pt&append_to_response=videos`);
          const data = await movieDetail.json();
          setMoviesDetails(data);
        } catch (error) {
          console.log(error);
        }
      }else{
        try {
          const movieDetail = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=pt-BR&page=1&language=pt-BR&include_image_language=pt&append_to_response=videos`);
          const data = await movieDetail.json();
          setMoviesDetails(data);
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchMovies();
  },[]);
  
  return autorizado ?(
    <main className='page-container'>

      <div className="div-menu" id={btnAtivo}>
          <ul>
            <li><button onClick={btnClick}><h1 id="p-1">/</h1><h1 id="p-2">\</h1></button></li>
            <li><p onClick={btnInicio}>Inicio</p></li>
            <li><p onClick={btnFilmes}>Filmes</p></li>
            <li><p onClick={btnSeries}>Series</p></li>
            <li><p onClick={btnPerfil}>Conta</p></li>
          </ul>
        </div>

      <header ref={headerContainer}>
        <div className="header-links">
            <div className='links-content'>
              <div id="btn-filmes-series" className="link-icons">
                <button onClick={btnClick} id="btn-menu">|||</button>
                <a onClick={handleURL} className='btn-header'>Home</a>
                <a className='btn-header' onClick={btnFilmes}>Filmes</a>
              </div>

              <div className="links-titulo">
                <h1>MovieZilla</h1>
              </div>

              <div className='link-icons'>
                <FaSearch className='lupa-icon'/>
                <div className="button-header-div">
                  <button onClick={btnPerfil}>C</button>
                  <h3 onClick={btnPerfil}>Conta</h3>
                </div>
              </div>

            </div>
        </div>

        <div className='header-images'>
          <div className="carrosel-header">
                <div className='carrosel-img' id={ativo}>
                  {moviesDetails.backdrop_path !== null ? (
                    <img src={`${imgUrl}${moviesDetails.backdrop_path}`}/>
                  ) : (
                    <img src={`${imgUrl}${moviesDetails.poster_path}`}/>
                  )}

                  <div className="movieDetails">
                    {moviesDetails.title ? (
                      <h2 className="pageTitle" >{moviesDetails.title}</h2>
                    ):(
                      <h2 className="pageTitle">{moviesDetails.name}</h2>
                    )}

                    {moviesDetails.tagline ? (
                      <p>{moviesDetails.tagline}</p>
                    ):(
                      <p>Subtitulo indisponivel</p>
                    )}

                    <button className="btn-play-page" id="btn-play" onClick={handleClick}><FontAwesomeIcon className="btn-icon-page" id="icon" icon={faPlay}/></button>
                  </div>
                  <div className='header-fim'></div>
                </div>
                <div id={ativo2} className='player-page'>
                  {moviesDetails.videos.results.length !== 0 ? (
                    <iframe
                    width="100%"
                    height="500"
                    src={`https://www.youtube.com/embed/${moviesDetails.videos.results[0].key}`}
                    frameBorder="0"
                    allow=" autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  ) : (
                    <div className='iframe-error'>
                      <h1>Desculpe</h1>
                      <h2>Video indisponivel</h2>
                    </div>
                  )}
                  <div className="fundoPlayer"></div>
                </div>
          </div>
        </div>

      </header>

      <div className='about-movie'>
        <hr></hr>
        <div className='about-movie-text'>
          {type === 'filme' ? (
            <h1>Sobre o filme</h1>
          ) : (
            <h1>Sobre a Serie</h1>
          )}

          {moviesDetails.overview ? (
            <p>{moviesDetails.overview}</p>
          ):(
            <p>Descrição indisponivel</p>
          )}
        </div>
      </div>
    </main>
  ) : null
}

export default Page;