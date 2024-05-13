import { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { HiXMark } from "react-icons/hi2";
import { IoStar } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import '/src/styles/App.css';

function Search(props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const apiKey = "df087968ddf338b4ac0f9876af17f739";
    const searchComponentRef = useRef();
    const Navigate = useNavigate();
    const btnMovies = useRef();
    const btnSeries = useRef();
    const resultContainerRef = useRef(undefined);
    const [type, setType] = useState('filme');
    const [typeContent, setTypeContent] = useState('filme');
    const [loading, setLoading] = useState('true');
    const [authorized, setAuthorized] = useState(false);

    const handleInputChange = (e) => {
        if (e){
            setSearchTerm(e.target.value);
        }else{
            setSearchTerm('');
        }
    };

    const disableMenu = () => {
        props.isDisable(false);
    };

    const SearchNavigate = (e) => {
        const idMovie = e.target.id;
        console.log(e);
        Navigate(`/Page/${idMovie}/${typeContent}`);
    };

    const btnClickMovies = () => {
        setType('filme');
        if (btnMovies.current){
            btnMovies.current.style.border = '1pt solid white';
            btnSeries.current.style.border = '1pt solid red';
        };
    }

    const btnClickSeries = () => {
        setType('serie');
        if (btnSeries) {
            btnSeries.current.style.border = '1pt solid white';
            btnMovies.current.style.border = '1pt solid red';
        }
    };

    const handleLoaderImage = () => {
        setLoading('false');
    };  

    useEffect(() => {
        if (type === 'filme') {
                const fetchMovies = async () => {
                    try{
                        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${searchTerm}`);
                        if (response.ok && searchTerm.length > 2){
                            const data = await response.json();
                            setSearchResult(data.results);
                            setAuthorized(true);
                        }else{
                            setSearchResult([]);
                        }
                    }catch (error) {
                        console.log(error);
                        setAuthorized(false);
                        setSearchResult([]);
                    }
                }
            setTypeContent('filme');

        }else{
                const fetchMovies = async () => {
                    try{
                        const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=pt-BR&query=${searchTerm}`);
                        if (response.ok && searchTerm){
                            const data = await response.json();
                            setSearchResult(data.results);
                            setAuthorized(true);
                        }else{
                            setSearchResult([]);
                        }
                    }catch (error) {
                        console.log(error);
                        setAuthorized(false);
                        setSearchResult([]);
                    }
                }

            setTypeContent('serie');
        };

        if (!props.isActive) {
            setSearchTerm(undefined);
            setSearchResult([]);
        };

    },[searchTerm, type, props.isActive]);

    useEffect(() => {
        const handleSearchBarActive = () => {
            if (searchComponentRef.current) {
                if (props.isActive){
                    setAuthorized(false);
                    searchComponentRef.current.style.transform = 'translateY(0%)';
                }else{
                    setAuthorized(false);
                    searchComponentRef.current.style.transform = 'translateY(-100%)';
                }
            }
        };

        handleSearchBarActive();
    },[props.isActive]);

    return(
        <section ref={searchComponentRef} className="search-component">
            <div className="search-bar-container">
                <div className="Search-input-container">
                    <LuSearch id="search-icon-bar" className="lupa-icon"/>
                    <input onChange={handleInputChange} type="text" className="inputSearch" placeholder="O que voce está procurando ?"></input>
                    <HiXMark onClick={disableMenu} className="close-bar-icon"/>
                </div>
                <div className="search-options">
                    <label>
                        <button ref={btnMovies} onClick={btnClickMovies}>Filmes</button>
                    </label>

                    <label>
                        <button ref={btnSeries} onClick={btnClickSeries} >Series</button>
                    </label>
                </div>
            </div>

            {authorized ? (
                <div ref={resultContainerRef} className="fetch-result">
                    <div className="section-title">
                        <h1>Resultados ({searchResult.length})</h1>
                        <hr id="line"></hr>
                    </div>
                    {searchResult.map((movie) => (
                        <motion.div key={movie.id} initial={{y: 100, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{ease: 'easeOut',duration: 0.3}} className="movies-box" >
                            <div display={loading} className="image-box">
                                {movie.poster_path !== null ? (
                                    <img onLoad={handleLoaderImage} id={movie.id} onClick={SearchNavigate} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/>
                                ):(
                                    <img onLoad={handleLoaderImage} id={movie.id} onClick={SearchNavigate} src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}/>
                                )}
                            </div>

                            <div className="info-section">
                                {movie.title ? (
                                    <h2 className="movie-title" id={movie.id} onClick={SearchNavigate} >{movie.title}</h2>
                                ):(
                                    <h2 className="movie-title" id={movie.id} onClick={SearchNavigate}>{movie.name}</h2>
                                )}

                                <div className="review-section">
                                    <h3>Avaliação</h3>
                                    <div className="review-stars">
                                        <p>{movie.vote_average.toFixed(1)}</p>
                                        <p>/</p>
                                        <p><IoStar className="star-icon"/></p>
                                    </div>
                                </div>

                                {movie.overview ? (
                                    <p id="review-description" className="review-description">{movie.overview}</p>
                                ):(
                                    <p className="review-description">Descrição indisponivel</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            ): null}
        </section>
    )
}

export default Search;