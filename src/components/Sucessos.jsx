import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';


const  Sucessos = () => {
  const [moviesDetails, setMoviesDetails] = useState([]);
  const newDate = new Date().toISOString().split('T')[0];
  const apiKey = "df087968ddf338b4ac0f9876af17f739";
  const [telaWidth, setTelaWidth] = useState();
  const widthCarrosel = useRef();
  const widthApp = useRef();
  const [autorizado, setAutorizado] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/Page');
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      console.log("ola");
      setAutorizado(true);
    }, 2000);

    const setwidth = setTimeout(() => {
      setTelaWidth(widthCarrosel.current?.scrollWidth - widthApp.current?.offsetWidth);
    }, 3500);

    const fetchMovies = async () => {
      try{
        const lançamentos = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&include_image_language=pt`);
        const data = await lançamentos.json();
        setMoviesDetails(data.results);
      } catch (error) {
        console.log(error);
      }
       
    }
    fetchMovies();
    
  },[])

  return autorizado ?(
    <div>
        <div className="container-movies" ref={widthApp}>
          <h1>Maiores Bilheterias</h1>
          <hr className="linha-titulo"></hr>
          <button>Filmes</button>
          <motion.div className="img-carrosel" drag="x" dragConstraints={{ right: 0, left: -telaWidth }} ref={widthCarrosel}>

            {moviesDetails.map((movie) => (
              <div className="movies-container" >
                <div className="movies-img" onClick={handleClick}><img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/></div>
                <div className="movies-details">
                  <div className="details">
                    <h2>{movie.title}</h2>
                    <p>{movie.release_date}</p>
                  </div>
                </div>
              </div>
            ))}
            
          </motion.div>
        </div>
      </div>
  ) : null;
}



export default Sucessos;