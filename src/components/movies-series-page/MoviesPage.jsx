import React from 'react';
import MoviesFetcher from '../app/shared-components/MovieFetcher';
import Loading from '../app/shared-components/LoadingContent';
import { useState, useRef} from "react";
import MovieSlides from '../app/shared-components/MoviesSlides';
import './Movies-Series.css';

function Movies() {
    const [movieGenre, setMovieGenre] = useState('Lançamentos');
    const genreBtns = useRef(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const handleComponentIsLoading = (e) => {
        setIsLoading(e);
    };

    const componentIsVisible = (e) => {
        setIsVisible(e);
    };

    const handleGenres = (e) => {
        if (!isLoading){
            setMovieGenre(e.target.value);
            handleColorBtn(e.target.value);
        }
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

    return(
        <section className='movies-pg'>
            <section className="movies-pg-container">
                <MovieSlides isVisible={componentIsVisible} contentType={'Filme'} currentPage={'MoviesPage'}/>
                
                {isVisible  &&
                    <div className='genres-bar'>
                        <ul ref={genreBtns}>
                            <li><button value='Lançamentos' onClick={handleGenres}>Lançamentos</button></li>
                            <li><button value='Terror' onClick={handleGenres}>Terror</button></li>
                            <li><button value='Ação' onClick={handleGenres}>Ação</button></li>
                            <li><button value='Comedia' onClick={handleGenres}>Comedia</button></li>
                            <li><button value='Guerra' onClick={handleGenres}>Guerra</button></li>
                            <li><button value='Animação' onClick={handleGenres}>Animação</button></li>
                            <li><button value='Documentario' onClick={handleGenres}>Documentarios</button></li>
                        </ul>
                    </div>
                };
                    
                <section className='box-movies'>
                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={true} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={movieGenre} btn='false' page='1' type='Movie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={movieGenre} btn='false' page='1' type='Movie' genre={movieGenre}/>
                            </div>
                        )}


                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={false} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='2' type='Movie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={false} btn='false' page='2' type='Movie' genre={movieGenre}/>
                            </div>
                        )}


                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={false} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='3' type='Movie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={false} btn='false' page='3' type='Movie' genre={movieGenre}/>
                            </div>
                        )}


                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={false} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='4' type='Movie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={false} btn='false' page='4' type='Movie' genre={movieGenre}/>
                            </div>
                        )}


                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={false} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='5' type='Movie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={false} btn='false' page='5' type='Movie' genre={movieGenre}/>
                            </div>
                        )}

                        
                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={false} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='6' type='Movie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={false} btn='false' page='6' type='Movie' genre={movieGenre}/>
                            </div>
                        )}
                </section>

            </section>
        </section>
    )
}

export default Movies;