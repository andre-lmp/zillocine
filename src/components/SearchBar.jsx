import { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { HiXMark } from "react-icons/hi2";
import { IoStar } from "react-icons/io5";

function Search({hide, onValueChange}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const apiKey = "df087968ddf338b4ac0f9876af17f739";
    const resultContainer = useRef();
    let Search = false;
    const main = useRef();
    const SearchBar = useRef();

    const handleInputChange = (e) => {
        let value = e.target.value;
        setSearchTerm(value);
    }

    if (SearchBar.current) {
        if (hide === false) {
            resultContainer.current.style.zIndex = 140;
            SearchBar.current.style.transform = 'translateY(0%)';
        }else{
            resultContainer.current.style.zIndex = -200;
            SearchBar.current.style.transform = 'translateY(-100%)';
        }
    }

    useEffect(() => {

        const fetchMovies = async () => {
            try{
                const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${searchTerm}`);
                const data = await response.json();
                if (Search) {
                    setSearchResult(data.results);
                }else{
                    setSearchResult([]);
                }
            }catch (error) {
                console.log(error);
            }
        }

        if (searchTerm.length > 2) {
            fetchMovies();
            Search = true;
            resultContainer.current.style.height = `450%`;
        }

        if (hide === true) {
            setSearchTerm('');
            setSearchResult([]);
        }

        if (searchTerm.length <= 2) {
            Search = false;
            resultContainer.current.style.height = `0%`;
            setSearchResult([]);
        }

    },[searchTerm, hide]);

    return(
        <main ref={main} className="search-container-main">
            <div ref={SearchBar} className="search-bar-container">
                <div className="Search-input-container">
                    <LuSearch id="search-icon-bar" className="lupa-icon"/>
                    <input value={searchTerm} onChange={handleInputChange} type="text" className="inputSearch" placeholder="O que voce está procurando ?"></input>
                    <HiXMark onClick={() => onValueChange(true)} className="xmark-icon-input"/>
                </div>
            </div>

            <div ref={resultContainer} className="container-result">
                {searchResult.length > 0 ? (
                    <div className="titulo-result-container">
                        <h1>Resultados ({searchResult.length})</h1>
                        <hr id="line-result-titulo"></hr>
                    </div>
                ):null}
                {searchResult.map((movie) => (
                    <div className="result-container-movies">
                        <div className="img-result-container">
                            {movie.poster_path !== null ? (
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/>
                            ):(
                                <img src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}/>
                            )}
                        </div>

                        <div className="result-movies-info">
                            {movie.title ? (
                                <h2 className="pageTitle" >{movie.title}</h2>
                            ):(
                                <h2 className="pageTitle">{movie.name}</h2>
                            )}

                            <div className="result-info-avaliação">
                                <h3>Avaliação</h3>
                                <div className="info-avaliação-div">
                                    <p>{movie.vote_average.toFixed(1)}</p>
                                    <p>/</p>
                                    <p><IoStar className="star-icon-avaliação"/></p>
                                </div>
                            </div>

                            {movie.overview ? (
                                <p id="descrição-result-id" className="descrição-movies-result">{movie.overview}</p>
                            ):(
                                <p className="descrição-movies-result">Descrição indisponivel</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Search;