import React from 'react';
import MoviesFetcher from '/src/components/MovieFetcher.jsx';
import Loading from '/src/components/LoadingContent.jsx';
import { useState, useEffect, useRef} from "react";
import '/src/styles/Movies.css';
import Footer from '/src/components/footer';

function Movies() {
    const [authorized, setAuthorized] = useState(false);
    const [movieGenre, setMovieGenre] = useState('Lançamentos');
    const [key, setKey] = useState(0); 
    const genreBtns = useRef(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingIsDisable, setLoadingIsDisable] = useState(false);

    const handleComponentLoaded = (e) => {
        setIsLoading(e);
    };

    const handleLoadingDisable = (e) => {
        setLoadingIsDisable(e);
    };

    const handleGenres = (e) => {
        if (loadingIsDisable === true){
            setIsLoading(false);
            setLoadingIsDisable(false);
            setMovieGenre(e.target.value);
            setKey(prevKey => prevKey + 1);
            handleColorBtn(e.target.value);
        };
    };

    const handleColorBtn = (genre) => {
        if (genreBtns.current){
            const children = genreBtns.current.children;
            for (let child in children){
                if (children[child].childNodes[0].value === genre){
                    children[child].childNodes[0].style.color = 'white';
                }else{
                    children[child].childNodes[0].style.color = 'rgba(255, 255, 255, 0.7)';
                }
            }
        }
    };

    useEffect(() => {
        setAuthorized(true);
    },[]);

    return(
        <main className="movies-page-container">
            {authorized === true ? (
                    <div className='genres-bar'>
                        <ul ref={genreBtns}>
                            <li><button value='Lançamentos' onClick={handleGenres}>Lançamentos</button></li>
                            <li><button value='Terror' onClick={handleGenres}>Terror</button></li>
                            <li><button value='Ação' onClick={handleGenres}>Ação</button></li>
                            <li><button value='Comedia' onClick={handleGenres}>Comedia</button></li>
                            <li><button value='Documentario' onClick={handleGenres}>Documentarios</button></li>
                        </ul>
                    </div>
                ) : null
            }
            <div className='box-movies'>
                <div className="loading-container">
                    <Loading disable={handleLoadingDisable} title={true} active={isLoading}/>
                    <MoviesFetcher isLoaded={handleComponentLoaded} title={movieGenre} btn='false' page='1' type='Movie' genre={movieGenre}/>
                </div>

                <div className="loading-container">
                    <Loading disable={handleLoadingDisable} title={false} active={isLoading}/>
                    <MoviesFetcher isLoaded={handleComponentLoaded} page='2' type='Movie' genre={movieGenre}/>
                </div>

                <div className="loading-container">
                    <Loading disable={handleLoadingDisable} title={false} active={isLoading}/>
                    <MoviesFetcher isLoaded={handleComponentLoaded} page='3' type='Movie' genre={movieGenre}/>
                </div>

                <div className="loading-container">
                    <Loading disable={handleLoadingDisable} title={false} active={isLoading}/>
                    <MoviesFetcher isLoaded={handleComponentLoaded} page='4' type='Movie' genre={movieGenre}/>
                </div>

                <div className="loading-container">
                    <Loading disable={handleLoadingDisable} title={false} active={isLoading}/>
                    <MoviesFetcher isLoaded={handleComponentLoaded} page='5' type='Movie' genre={movieGenre}/>
                </div>

            </div>

            <Footer/>
        </main>
    )
}

export default Movies;